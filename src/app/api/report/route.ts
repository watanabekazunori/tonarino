import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { classifyStore } from "@/lib/genre-classifier";

const BASE_URL = "https://maps.googleapis.com/maps/api/place";

// Rate-limit helper: wait ms
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Retry wrapper for Gemini API calls with exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
  maxRetries = 4
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (e: any) {
      const status = e?.status || e?.statusCode;
      const errMsg = e?.message || e?.errorDetails?.[0]?.reason || "";

      if ((status === 429 || status === 503) && attempt < maxRetries) {
        // Check if it's a daily limit (RPD) - don't retry on daily quota
        const isDailyLimit =
          errMsg.includes("PerDay") ||
          errMsg.includes("RATE_LIMIT_EXCEEDED") && errMsg.includes("daily");
        if (isDailyLimit) {
          console.log(`[Retry] ${label}: DAILY quota exceeded - skipping retries`);
          throw e;
        }

        // Exponential backoff: 20s, 40s, 60s, 60s
        const waitSec = Math.min(60, 20 * (attempt + 1));
        console.log(`[Retry] ${label}: ${status} error, waiting ${waitSec}s (attempt ${attempt + 1}/${maxRetries})`);
        await sleep(waitSec * 1000);
      } else {
        throw e;
      }
    }
  }
  throw new Error(`Max retries exceeded for ${label}`);
}

function getSupabase(accessToken?: string) {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    accessToken
      ? {
          global: {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        }
      : undefined
  );
  return client;
}

function getGenAI() {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
}

async function getPlaceReviews(placeId: string) {
  const url = `${BASE_URL}/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&language=ja&key=${process.env.GOOGLE_PLACES_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  console.log(
    `[PlaceReviews] place_id=${placeId}, status=${data.status}, name=${data.result?.name || "N/A"}, reviews=${data.result?.reviews?.length || 0}`
  );

  if (data.status !== "OK") {
    console.error(
      `[PlaceReviews] API error: ${data.status} - ${data.error_message || ""}`
    );
  }

  return {
    name: data.result?.name || "",
    rating: data.result?.rating || 0,
    reviewCount: data.result?.user_ratings_total || 0,
    reviews: (data.result?.reviews || []).map((r: any) => ({
      text: r.text || "",
      rating: r.rating || 0,
    })),
  };
}

// スコアを1-10にクランプ
function clampScore(score: number): number {
  return Math.max(1, Math.min(10, Math.round(score)));
}

// ========== V2: 自店の4軸分析 + 口コミ抽出を1回で実行 ==========
async function analyzeMyStoreV2(
  storeName: string,
  reviews: Array<{ text: string; rating: number }>,
  rating?: number,
  reviewCount?: number
) {
  const defaultScores = [
    { axis: "price", label: "価格", score: 5, summary: "データ不足" },
    { axis: "taste", label: "味", score: 5, summary: "データ不足" },
    { axis: "service", label: "接客", score: 5, summary: "データ不足" },
    { axis: "comfort", label: "いごこちのよさ", score: 5, summary: "データ不足" },
  ];
  const emptyExcerpts = { good: [] as any[], bad: [] as any[] };

  if (!storeName) return { scores: defaultScores, excerpts: emptyExcerpts };

  try {
    const model = getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });

    let prompt: string;

    if (reviews.length > 0) {
      const reviewTexts = reviews
        .map((r) => `[${r.rating}星] ${r.text}`)
        .join("\n");

      prompt = `あなたは飲食店の口コミ分析の専門家です。以下は「${storeName}」の口コミです。

口コミ:
${reviewTexts}

以下の2つのタスクを実行してください:

【タスク1】4つの軸について、1〜10のスコアで評価
- price (価格): 価格に対する満足度・コスパ
- taste (味): 料理の味・品質
- service (接客): スタッフの接客態度・サービス
- comfort (いごこちのよさ): 店の雰囲気・居心地・清潔さ
各軸: score 1〜10, summary 15文字以内

【タスク2】口コミから良い点・悪い点を抽出
- good_reviews: ポジティブな口コミ引用を最大4つ（各100文字以内、原文から抜粋）
- bad_reviews: ネガティブな口コミ引用を最大4つ（各100文字以内、原文から抜粋）
各引用にその口コミの星評価を付けてください。

以下のJSON形式のみ返してください（JSON以外のテキストは不要）:
{
  "scores": [
    {"axis": "price", "label": "価格", "score": 7, "summary": "コスパが良い"},
    {"axis": "taste", "label": "味", "score": 8, "summary": "味に定評あり"},
    {"axis": "service", "label": "接客", "score": 6, "summary": "普通の接客"},
    {"axis": "comfort", "label": "いごこちのよさ", "score": 7, "summary": "落ち着く雰囲気"}
  ],
  "good_reviews": [{"text": "...", "rating": 5}],
  "bad_reviews": [{"text": "...", "rating": 2}]
}`;
    } else {
      const ratingInfo = rating
        ? `Google評価: ${rating}点（${reviewCount || 0}件）`
        : "";
      prompt = `あなたは飲食店の口コミ分析の専門家です。「${storeName}」について分析してください。
${ratingInfo}

口コミデータがないため、店名や一般的な傾向から推測してください。

以下の4つの軸について、1〜10のスコアで評価してください:
- price (価格), taste (味), service (接客), comfort (いごこちのよさ)
各軸: score 1〜10, summary 15文字以内（推測である旨含む）

以下のJSON形式のみ返してください:
{
  "scores": [
    {"axis": "price", "label": "価格", "score": 5, "summary": "推測: 標準的"},
    {"axis": "taste", "label": "味", "score": 5, "summary": "推測: 標準的"},
    {"axis": "service", "label": "接客", "score": 5, "summary": "推測: 標準的"},
    {"axis": "comfort", "label": "いごこちのよさ", "score": 5, "summary": "推測: 標準的"}
  ],
  "good_reviews": [],
  "bad_reviews": []
}`;
    }

    const result = await withRetry(
      () => model.generateContent(prompt),
      `analyzeMyStoreV2(${storeName})`
    );
    const text = result.response.text();
    console.log(`[analyzeMyStoreV2] Gemini response length: ${text.length}, first 200 chars: ${text.slice(0, 200)}`);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const scores = (parsed.scores || []).map((item: any) => ({
        ...item,
        score: clampScore(item.score),
      }));
      if (scores.length !== 4) {
        console.warn(`[analyzeMyStoreV2] Expected 4 scores, got ${scores.length}. Using defaults.`);
      }
      return {
        scores: scores.length === 4 ? scores : defaultScores,
        excerpts: {
          good: (parsed.good_reviews || []).slice(0, 4),
          bad: (parsed.bad_reviews || []).slice(0, 4),
        },
      };
    } else {
      console.error(`[analyzeMyStoreV2] No JSON found in response: ${text.slice(0, 500)}`);
    }
  } catch (e: any) {
    console.error("Gemini V2 my store analysis error:", {
      message: e?.message,
      status: e?.status || e?.statusCode,
      details: e?.errorDetails,
      stack: e?.stack?.slice(0, 500),
    });
  }

  return { scores: defaultScores, excerpts: emptyExcerpts };
}

// ========== V2: 競合バッチ分析（2-3店舗を1回で分析） ==========
async function analyzeCompetitorBatchV2(
  stores: Array<{
    name: string;
    reviews: Array<{ text: string; rating: number }>;
    rating?: number;
    reviewCount?: number;
  }>
) {
  const defaultScores = [
    { axis: "price", label: "価格", score: 5, summary: "データ不足" },
    { axis: "taste", label: "味", score: 5, summary: "データ不足" },
    { axis: "service", label: "接客", score: 5, summary: "データ不足" },
    { axis: "comfort", label: "いごこちのよさ", score: 5, summary: "データ不足" },
  ];

  if (stores.length === 0) return [];

  try {
    const model = getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });

    const storeTexts = stores
      .map((s, i) => {
        const reviewTexts = s.reviews.length > 0
          ? s.reviews.map((r) => `[${r.rating}星] ${r.text.slice(0, 200)}`).join("\n")
          : `口コミなし（Google評価: ${s.rating || "不明"}点、${s.reviewCount || 0}件）`;
        return `【店舗${i + 1}: ${s.name}】\n${reviewTexts}`;
      })
      .join("\n\n");

    const prompt = `あなたは飲食店の口コミ分析の専門家です。以下の${stores.length}店舗それぞれについて4軸スコアを評価してください。

${storeTexts}

各店舗の4軸:
- price (価格): コスパ満足度
- taste (味): 料理の味・品質
- service (接客): 接客態度
- comfort (いごこちのよさ): 雰囲気・居心地

各軸: score 1〜10, summary 15文字以内

以下のJSON形式のみ返してください（JSON以外のテキストは不要）:
{
  "stores": [
    {
      "name": "${stores[0]?.name || "店舗1"}",
      "scores": [
        {"axis": "price", "label": "価格", "score": 7, "summary": "..."},
        {"axis": "taste", "label": "味", "score": 8, "summary": "..."},
        {"axis": "service", "label": "接客", "score": 6, "summary": "..."},
        {"axis": "comfort", "label": "いごこちのよさ", "score": 7, "summary": "..."}
      ]
    }
  ]
}`;

    const result = await withRetry(
      () => model.generateContent(prompt),
      `batchAnalyzeV2(${stores.map((s) => s.name).join(",")})`
    );
    const text = result.response.text();
    console.log(`[batchAnalyzeV2] Gemini response length: ${text.length}, first 200 chars: ${text.slice(0, 200)}`);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return (parsed.stores || []).map((store: any, i: number) => ({
        scores: (store.scores || []).map((item: any) => ({
          ...item,
          score: clampScore(item.score),
        })),
      }));
    } else {
      console.error(`[batchAnalyzeV2] No JSON found in response: ${text.slice(0, 500)}`);
    }
  } catch (e: any) {
    console.error("Gemini V2 batch analysis error:", {
      message: e?.message,
      status: e?.status || e?.statusCode,
      details: e?.errorDetails,
      stack: e?.stack?.slice(0, 500),
    });
  }

  // Return default scores for all stores
  return stores.map(() => ({ scores: defaultScores }));
}

// ========== V2: 4軸別差分分析 ==========
async function generateComparisonV2(
  myStore: { name: string; scores: any[]; reviewTexts: string },
  competitors: Array<{ name: string; scores: any[]; reviewTexts: string }>,
  genreContext?: string
) {
  try {
    const model = getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });

    const genreInstruction = genreContext
      ? `\n重要: この店舗は「${genreContext}」です。ジャンル特有の分析をしてください。`
      : "";

    const myScoreText = myStore.scores
      .map((s: any) => `${s.label}: ${s.score}/10`)
      .join(", ");

    const competitorTexts = competitors
      .map((c) => {
        const scoreText = c.scores
          .map((s: any) => `${s.label}: ${s.score}/10`)
          .join(", ");
        return `【${c.name}】スコア: ${scoreText}\n口コミ: ${c.reviewTexts.slice(0, 300)}`;
      })
      .join("\n\n");

    const prompt = `あなたは飲食店コンサルタントです。以下の店舗を4軸で比較分析してください。${genreInstruction}

【自店: ${myStore.name}】
スコア: ${myScoreText}
口コミ: ${myStore.reviewTexts.slice(0, 300)}

【競合店舗】
${competitorTexts}

以下を生成してください:
1. 4軸それぞれの競合との差分分析（各80文字以内）
2. 改善提案を3つ（各50文字以内）

以下のJSON形式のみ返してください:
{
  "axis_comparisons": [
    {"axis": "price", "label": "価格", "commentary": "自店は競合と比べて..."},
    {"axis": "taste", "label": "味", "commentary": "自店の味は..."},
    {"axis": "service", "label": "接客", "commentary": "接客面では..."},
    {"axis": "comfort", "label": "いごこちのよさ", "commentary": "居心地は..."}
  ],
  "suggestions": ["提案1", "提案2", "提案3"]
}`;

    const result = await withRetry(
      () => model.generateContent(prompt),
      `comparisonV2(${myStore.name})`
    );
    const text = result.response.text();
    console.log(`[comparisonV2] Gemini response length: ${text.length}, first 200 chars: ${text.slice(0, 200)}`);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      console.error(`[comparisonV2] No JSON found in response: ${text.slice(0, 500)}`);
    }
  } catch (e: any) {
    console.error("Gemini V2 comparison error:", {
      message: e?.message,
      status: e?.status || e?.statusCode,
      details: e?.errorDetails,
      stack: e?.stack?.slice(0, 500),
    });
  }

  return {
    axis_comparisons: [
      { axis: "price", label: "価格", commentary: "分析データが不足しています。" },
      { axis: "taste", label: "味", commentary: "分析データが不足しています。" },
      { axis: "service", label: "接客", commentary: "分析データが不足しています。" },
      { axis: "comfort", label: "いごこちのよさ", commentary: "分析データが不足しています。" },
    ],
    suggestions: [
      "口コミへの返信を増やしましょう",
      "SNSでの情報発信を強化しましょう",
      "リピーター向けの特典を検討しましょう",
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await getSupabase(token).auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { place_id, competitors: competitorIds } = body;

    if (!place_id) {
      return NextResponse.json(
        { error: "place_id is required" },
        { status: 400 }
      );
    }

    console.log("[Report V2] Starting report generation (optimized: 4 Gemini calls)...");

    // Get my store reviews
    const myStoreData = await getPlaceReviews(place_id);

    // ===== Gemini Call 1/4: 自店の4軸分析 + 口コミ抽出（統合） =====
    console.log("[Report V2] Call 1/4: Analyzing my store + extracting review excerpts...");
    const myStoreResult = await analyzeMyStoreV2(
      myStoreData.name,
      myStoreData.reviews,
      myStoreData.rating,
      myStoreData.reviewCount
    );
    const myStoreScores = myStoreResult.scores;
    const reviewExcerpts = myStoreResult.excerpts;

    console.log(
      `[Report V2] My store analyzed: ${myStoreData.name} (scores: ${myStoreScores.map((s: any) => `${s.label}=${s.score}`).join(", ")})`
    );
    console.log(
      `[Report V2] Excerpts: ${reviewExcerpts.good.length} good, ${reviewExcerpts.bad.length} bad`
    );

    // Get competitor reviews (top 5)
    const topCompetitors = (competitorIds || []).slice(0, 5);

    // Fetch all competitor place data in parallel (Google Places API has no tight rate limit)
    const competitorPlaceData = await Promise.all(
      topCompetitors.map((compId: string) => getPlaceReviews(compId))
    );

    // ===== Gemini Call 2/4 & 3/4: 競合バッチ分析（2-3店舗ずつ） =====
    // Split competitors into 2 batches to stay under token limits
    const batch1Size = Math.min(3, competitorPlaceData.length);
    const batch1 = competitorPlaceData.slice(0, batch1Size);
    const batch2 = competitorPlaceData.slice(batch1Size);

    console.log(`[Report V2] Waiting 15s before competitor batch 1 (${batch1.length} stores)...`);
    await sleep(15000);

    console.log(`[Report V2] Call 2/4: Batch analyzing competitors 1-${batch1Size}...`);
    const batch1Results = await analyzeCompetitorBatchV2(batch1);

    let batch2Results: any[] = [];
    if (batch2.length > 0) {
      console.log(`[Report V2] Waiting 15s before competitor batch 2 (${batch2.length} stores)...`);
      await sleep(15000);

      console.log(`[Report V2] Call 3/4: Batch analyzing competitors ${batch1Size + 1}-${competitorPlaceData.length}...`);
      batch2Results = await analyzeCompetitorBatchV2(batch2);
    }

    const allBatchResults = [...batch1Results, ...batch2Results];

    // Build competitor results
    const competitorResults: Array<{
      name: string;
      place_id: string;
      reviewCount: number;
      rating: number;
      scores: Array<{ axis: string; label: string; score: number; summary: string }>;
      reviewTexts: string;
    }> = topCompetitors.map((compId: string, i: number) => {
      const compData = competitorPlaceData[i];
      const batchResult = allBatchResults[i] || { scores: [] };
      return {
        name: compData.name,
        place_id: compId,
        reviewCount: compData.reviewCount,
        rating: compData.rating,
        scores: batchResult.scores.length === 4 ? batchResult.scores : [
          { axis: "price", label: "価格", score: 5, summary: "データ不足" },
          { axis: "taste", label: "味", score: 5, summary: "データ不足" },
          { axis: "service", label: "接客", score: 5, summary: "データ不足" },
          { axis: "comfort", label: "いごこちのよさ", score: 5, summary: "データ不足" },
        ],
        reviewTexts: compData.reviews.map((r: any) => r.text).join("\n"),
      };
    });

    console.log(
      `[Report V2] ${competitorResults.length} competitors analyzed`
    );
    competitorResults.forEach((c, i) => {
      console.log(
        `[Report V2]   ${i + 1}. ${c.name} (scores: ${c.scores.map((s: any) => `${s.label}=${s.score}`).join(", ")})`
      );
    });

    // Classify store genre for context
    const myGenre = classifyStore(myStoreData.name);
    const genreContext = myGenre.subGenre
      ? `${myGenre.subGenre}${myGenre.mainGenre !== myGenre.subGenre ? `（${myGenre.mainGenre}）` : ""}`
      : myGenre.mainGenre !== "飲食店"
      ? myGenre.mainGenre
      : undefined;

    // ===== Gemini Call 4/4: 4軸差分比較 + 改善提案 =====
    console.log("[Report V2] Waiting 15s before comparison generation...");
    await sleep(15000);

    console.log("[Report V2] Call 4/4: Generating axis comparison...");
    const comparison = await generateComparisonV2(
      {
        name: myStoreData.name,
        scores: myStoreScores,
        reviewTexts: myStoreData.reviews.map((r: any) => r.text).join("\n"),
      },
      competitorResults.map((c) => ({
        name: c.name,
        scores: c.scores,
        reviewTexts: c.reviewTexts,
      })),
      genreContext
    );

    console.log("[Report V2] Comparison generated");

    // Save report (V2 format)
    const reportData = {
      user_id: user.id,
      place_id,
      competitors_json: topCompetitors.map((id: string, i: number) => ({
        place_id: id,
        name: competitorResults[i]?.name || "",
      })),
      review_summary: {
        version: 2,
        my_store: {
          name: myStoreData.name,
          place_id: place_id,
          reviewCount: myStoreData.reviewCount,
          rating: myStoreData.rating,
          scores: myStoreScores,
        },
        competitors: competitorResults.map((c) => ({
          name: c.name,
          place_id: c.place_id,
          reviewCount: c.reviewCount,
          rating: c.rating,
          scores: c.scores,
        })),
        axis_comparisons: comparison.axis_comparisons || [],
        good_reviews: reviewExcerpts.good || [],
        bad_reviews: reviewExcerpts.bad || [],
      },
      comparison_text: (comparison.axis_comparisons || [])
        .map((ac: any) => `【${ac.label}】${ac.commentary}`)
        .join("\n"),
      suggestions: comparison.suggestions || [],
    };

    const { data: report, error: insertError } = await getSupabase(token)
      .from("reports")
      .insert(reportData)
      .select()
      .single();

    if (insertError) {
      console.error("Report insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save report" },
        { status: 500 }
      );
    }

    console.log(`[Report V2] Report saved: ${report.id}`);

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await getSupabase(token).auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reportId = request.nextUrl.searchParams.get("id");

    if (reportId) {
      const { data: report } = await getSupabase(token)
        .from("reports")
        .select("*")
        .eq("id", reportId)
        .eq("user_id", user.id)
        .single();

      return NextResponse.json({ report });
    }

    const { data: reports } = await getSupabase(token)
      .from("reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ reports: reports || [] });
  } catch (error) {
    console.error("Report fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
