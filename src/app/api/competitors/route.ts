import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  classifyStore,
  calculateDistance,
  calculateRelevanceScore,
} from "@/lib/genre-classifier";
import { logSearch } from "@/lib/google-sheets";

const BASE_URL = "https://maps.googleapis.com/maps/api/place";
const SEARCH_RADIUS = 2000; // 2km
const MIN_RELEVANCE_SCORE = 30;
const MAX_COMPETITORS = 10;

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Google Places nearbysearch を実行
async function searchNearby(
  lat: string,
  lng: string,
  keyword: string,
  type: string,
  radius: number = SEARCH_RADIUS
): Promise<any[]> {
  const keywordParam = keyword
    ? `&keyword=${encodeURIComponent(keyword)}`
    : "";
  const url = `${BASE_URL}/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}${keywordParam}&language=ja&key=${process.env.GOOGLE_PLACES_API_KEY}`;

  console.log(`[Competitors] Searching: keyword="${keyword}", type=${type}, radius=${radius}m`);

  const res = await fetch(url);
  const data = await res.json();

  console.log(`[Competitors] Results: ${data.results?.length || 0} places found`);

  return data.results || [];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { place_id, name, lat, lng, query, types } = body;

    if (!place_id || !lat || !lng) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    // 自店のジャンル分類
    const myTypes: string[] = types ? types.split(",") : [];
    const myGenre = classifyStore(name, myTypes);

    console.log(
      `[Competitors] My store: "${name}" → ${myGenre.label} (${myGenre.mainGenre}/${myGenre.subGenre || "N/A"}) chain=${myGenre.isChain}`
    );

    // Save search log
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "";
    const userAgent = request.headers.get("user-agent") || "";

    await getSupabaseAdmin().from("searches").insert({
      query: query || name,
      place_id,
      place_name: name,
      lat,
      lng,
      area: "",
      ip,
      user_agent: userAgent,
    });

    // Google Sheetsに検索データを書き込み（fire-and-forget）
    logSearch({
      query: query || name,
      placeName: name,
      placeId: place_id,
      lat,
      lng,
      ip,
      userAgent,
    }).catch(() => {});

    // ========== 2段階検索 ==========
    const allResults: Map<string, any> = new Map();

    // ステージ1: サブジャンルキーワードで検索（サブジャンルがある場合）
    if (myGenre.subGenre && myGenre.searchKeywords.length > 0) {
      for (const kw of myGenre.searchKeywords) {
        const results = await searchNearby(lat, lng, kw, myGenre.googleType);
        for (const r of results) {
          if (!allResults.has(r.place_id)) {
            allResults.set(r.place_id, r);
          }
        }
      }
    }

    // ステージ2: メインジャンルキーワードで検索
    const mainKeyword = myGenre.mainGenre === "飲食店" ? "" : myGenre.mainGenre;
    const mainResults = await searchNearby(lat, lng, mainKeyword, myGenre.googleType);
    for (const r of mainResults) {
      if (!allResults.has(r.place_id)) {
        allResults.set(r.place_id, r);
      }
    }

    // サブジャンルもメインジャンルも結果が少ない場合、typeのみで広く検索
    if (allResults.size < 5) {
      const broadResults = await searchNearby(lat, lng, "", myGenre.googleType);
      for (const r of broadResults) {
        if (!allResults.has(r.place_id)) {
          allResults.set(r.place_id, r);
        }
      }
    }

    console.log(`[Competitors] Total unique places: ${allResults.size}`);

    // ========== フィルタリング & スコアリング ==========
    const competitors = Array.from(allResults.values())
      // 自店を除外
      .filter((p: any) => p.place_id !== place_id)
      // 営業中のみ
      .filter(
        (p: any) =>
          p.business_status === "OPERATIONAL" || !p.business_status
      )
      .map((p: any) => {
        const distance = calculateDistance(
          parseFloat(lat),
          parseFloat(lng),
          p.geometry?.location?.lat || 0,
          p.geometry?.location?.lng || 0
        );

        const compGenre = classifyStore(p.name, p.types || []);

        const relevanceScore = calculateRelevanceScore(myGenre, {
          name: p.name,
          types: p.types || [],
          rating: p.rating || 0,
          user_ratings_total: p.user_ratings_total || 0,
          distance,
        });

        return {
          place_id: p.place_id,
          name: p.name,
          rating: p.rating || 0,
          user_ratings_total: p.user_ratings_total || 0,
          lat: p.geometry?.location?.lat,
          lng: p.geometry?.location?.lng,
          address: p.formatted_address || p.vicinity || "",
          types: p.types || [],
          // 新フィールド
          distance: Math.round(distance),
          genre: compGenre.mainGenre,
          subGenre: compGenre.subGenre,
          isChain: compGenre.isChain,
          chainName: compGenre.chainName,
          relevanceScore,
          genreLabel: compGenre.label,
        };
      })
      // 関連度スコアでフィルタ
      .filter((c) => c.relevanceScore >= MIN_RELEVANCE_SCORE)
      // ソート: 関連度スコア降順 → 評価降順
      .sort((a, b) => {
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        return (b.rating || 0) - (a.rating || 0);
      })
      .slice(0, MAX_COMPETITORS);

    console.log(
      `[Competitors] After filtering: ${competitors.length} competitors (min score: ${MIN_RELEVANCE_SCORE})`
    );
    competitors.forEach((c, i) => {
      console.log(
        `  ${i + 1}. ${c.name} [${c.genreLabel}] score=${c.relevanceScore} dist=${c.distance}m chain=${c.isChain}`
      );
    });

    // ========== ランク計算 ==========
    const myPlaceRes = await fetch(
      `${BASE_URL}/details/json?place_id=${place_id}&fields=rating,user_ratings_total&language=ja&key=${process.env.GOOGLE_PLACES_API_KEY}`
    );
    const myPlaceData = await myPlaceRes.json();
    const myRating = myPlaceData.result?.rating || 0;
    const myReviewCount = myPlaceData.result?.user_ratings_total || 0;

    const allPlaces = [...competitors];
    allPlaces.push({
      place_id,
      name,
      rating: myRating,
      user_ratings_total: myReviewCount,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      address: "",
      types: [],
      distance: 0,
      genre: myGenre.mainGenre,
      subGenre: myGenre.subGenre,
      isChain: myGenre.isChain,
      chainName: myGenre.chainName,
      relevanceScore: 100,
      genreLabel: myGenre.label,
    });

    allPlaces.sort(
      (a, b) =>
        (b.rating || 0) - (a.rating || 0) ||
        (b.user_ratings_total || 0) - (a.user_ratings_total || 0)
    );
    const rank = allPlaces.findIndex((p) => p.place_id === place_id) + 1;
    const total = allPlaces.length;

    return NextResponse.json({
      competitors,
      rank,
      total,
      myRating,
      myReviewCount,
      // 新規: ジャンル情報
      myGenre: {
        mainGenre: myGenre.mainGenre,
        subGenre: myGenre.subGenre,
        label: myGenre.label,
        isChain: myGenre.isChain,
        chainName: myGenre.chainName,
      },
      searchRadius: SEARCH_RADIUS,
    });
  } catch (error) {
    console.error("Competitors error:", error);
    return NextResponse.json(
      { error: "Failed to get competitors" },
      { status: 500 }
    );
  }
}
