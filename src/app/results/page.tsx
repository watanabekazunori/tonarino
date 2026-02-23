"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import MapView from "@/components/MapView";
import Link from "next/link";

interface Competitor {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  lat: number;
  lng: number;
  address: string;
  distance?: number;
  genre?: string;
  subGenre?: string | null;
  isChain?: boolean;
  chainName?: string | null;
  relevanceScore?: number;
  genreLabel?: string;
}

interface MyGenreInfo {
  mainGenre: string;
  subGenre: string | null;
  label: string;
  isChain: boolean;
  chainName: string | null;
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const placeId = searchParams.get("place_id") || "";
  const name = searchParams.get("name") || "";
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lng = parseFloat(searchParams.get("lng") || "0");
  const query = searchParams.get("q") || "";
  const types = searchParams.get("types") || "";

  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [rank, setRank] = useState(0);
  const [total, setTotal] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [myReviewCount, setMyReviewCount] = useState(0);
  const [myGenre, setMyGenre] = useState<MyGenreInfo | null>(null);
  const [searchRadius, setSearchRadius] = useState(2000);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!placeId) return;

    const fetchCompetitors = async () => {
      try {
        const res = await fetch("/api/competitors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ place_id: placeId, name, lat, lng, query, types }),
        });
        const data = await res.json();
        setCompetitors(data.competitors || []);
        setRank(data.rank || 0);
        setTotal(data.total || 0);
        setMyRating(data.myRating || 0);
        setMyReviewCount(data.myReviewCount || 0);
        if (data.myGenre) setMyGenre(data.myGenre);
        if (data.searchRadius) setSearchRadius(data.searchRadius);
      } catch (error) {
        console.error("Failed to fetch competitors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompetitors();
  }, [placeId, name, lat, lng, query, types]);

  const mapMarkers = [
    { lat, lng, name, isMyStore: true, rating: myRating },
    ...competitors.map((c) => ({
      lat: c.lat,
      lng: c.lng,
      name: c.name,
      isMyStore: false,
      rating: c.rating,
    })),
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-500">競合店舗を分析中...</p>
          <p className="text-stone-300 text-sm mt-1">
            周辺2kmの同ジャンル店を検索しています
          </p>
        </div>
      </div>
    );
  }

  // ジャンル表示ラベル（API結果を優先、フォールバック）
  const genreLabel = myGenre?.label || "飲食店";
  const radiusText = searchRadius >= 1000 ? `${searchRadius / 1000}km` : `${searchRadius}m`;

  return (
    <div className="pt-20 pb-12 px-4 max-w-4xl mx-auto">
      {/* Store name + genre info + rank */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-stone-700 mb-2">{name}</h1>

        {/* Genre & chain badge */}
        {myGenre && (
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="inline-flex items-center bg-primary-50 text-primary-600 text-sm font-medium px-3 py-1 rounded-full border border-primary-200">
              {myGenre.label}
            </span>
            {myGenre.subGenre && (
              <span className="inline-flex items-center bg-amber-50 text-amber-600 text-xs font-medium px-2 py-0.5 rounded-full border border-amber-200">
                {myGenre.subGenre}
              </span>
            )}
            <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${
              myGenre.isChain
                ? "bg-blue-50 text-blue-600 border-blue-200"
                : "bg-green-50 text-green-600 border-green-200"
            }`}>
              {myGenre.isChain ? `チェーン${myGenre.chainName ? `(${myGenre.chainName})` : ""}` : "個人店"}
            </span>
          </div>
        )}

        {rank > 0 && (
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-2xl px-5 py-2">
            <span className="text-stone-500 text-sm">このエリアの{genreLabel}</span>
            <span className="text-2xl font-bold text-primary-500">
              {total}店中{rank}位
            </span>
          </div>
        )}
        {myRating > 0 && (
          <p className="text-stone-400 text-sm mt-2">
            評価 {myRating} / 口コミ {myReviewCount}件
          </p>
        )}
      </div>

      {/* Map */}
      <div className="mb-8 animate-slide-up">
        <h2 className="text-lg font-bold text-stone-600 mb-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary-500 inline-block" />
          周辺競合マップ
          <span className="text-xs text-stone-400 font-normal">
            （半径{radiusText}）
          </span>
        </h2>
        <MapView center={{ lat, lng }} markers={mapMarkers} radius={searchRadius} />
        <div className="flex items-center gap-4 mt-3 text-xs text-stone-400">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-primary-500 inline-block" />
            あなたのお店
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-gray-400 inline-block" />
            競合店舗
          </div>
        </div>
      </div>

      {/* Competitor list */}
      <div className="mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-lg font-bold text-stone-600 mb-3">
          周辺の競合店舗
          <span className="text-sm font-normal text-stone-400 ml-2">
            {competitors.length}件
          </span>
        </h2>
        <div className="space-y-2">
          {competitors.map((comp, idx) => (
            <div
              key={comp.place_id}
              className="flex items-center justify-between bg-white rounded-xl p-4 border border-stone-100 hover:border-primary-200 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-sm font-bold text-stone-300 w-6 text-center flex-shrink-0">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-stone-700 truncate">{comp.name}</div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {/* Genre label */}
                    {comp.genreLabel && (
                      <span className="inline-flex items-center bg-stone-50 text-stone-500 text-xs px-1.5 py-0.5 rounded border border-stone-200">
                        {comp.genreLabel}
                      </span>
                    )}
                    {/* Chain badge */}
                    {comp.isChain && (
                      <span className="inline-flex items-center bg-blue-50 text-blue-500 text-xs px-1.5 py-0.5 rounded border border-blue-200">
                        チェーン
                      </span>
                    )}
                    {!comp.isChain && comp.genre && (
                      <span className="inline-flex items-center bg-green-50 text-green-500 text-xs px-1.5 py-0.5 rounded border border-green-200">
                        個人店
                      </span>
                    )}
                    {/* Distance */}
                    {comp.distance != null && (
                      <span className="text-xs text-stone-400">
                        {comp.distance >= 1000
                          ? `${(comp.distance / 1000).toFixed(1)}km`
                          : `${comp.distance}m`}
                      </span>
                    )}
                  </div>
                  {comp.address && (
                    <div className="text-xs text-stone-400 mt-0.5 truncate">
                      {comp.address}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <div className="text-secondary-500 font-bold">
                  {comp.rating > 0 ? `★ ${comp.rating}` : "-"}
                </div>
                <div className="text-xs text-stone-400">
                  {comp.user_ratings_total}件
                </div>
                {/* Relevance score bar */}
                {comp.relevanceScore != null && (
                  <div className="mt-1">
                    <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          comp.relevanceScore >= 70
                            ? "bg-primary-500"
                            : comp.relevanceScore >= 50
                            ? "bg-amber-400"
                            : "bg-stone-300"
                        }`}
                        style={{ width: `${comp.relevanceScore}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-stone-300 mt-0.5">
                      関連度 {comp.relevanceScore}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {competitors.length === 0 && (
            <div className="text-center text-stone-400 py-8">
              <p>半径{radiusText}内に同ジャンルの競合店舗が見つかりませんでした</p>
            </div>
          )}
        </div>
      </div>

      {/* Blurred sections = registration CTA */}
      <div className="relative animate-slide-up" style={{ animationDelay: "0.4s" }}>
        {/* Blurred fake content */}
        <div className="blur-locked space-y-6">
          {/* Fake review analysis */}
          <div className="bg-white rounded-2xl p-6 border border-stone-100">
            <h2 className="text-lg font-bold text-stone-600 mb-4">
              口コミキーワード分析
            </h2>
            <div className="grid grid-cols-5 gap-3">
              {["接客", "価格", "雰囲気", "料理", "立地"].map((cat) => (
                <div key={cat} className="text-center">
                  <div className="text-sm font-medium text-stone-500 mb-2">
                    {cat}
                  </div>
                  <div className="text-2xl">○</div>
                  <div className="text-xs text-stone-400 mt-1">
                    サンプルテキスト
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fake comparison */}
          <div className="bg-white rounded-2xl p-6 border border-stone-100">
            <h2 className="text-lg font-bold text-stone-600 mb-4">
              競合との差分分析
            </h2>
            <p className="text-stone-500">
              あなたの店はディナータイムの評判が高く、特に料理の味に定評があります。
              一方で、A店はランチの評判が良く、コスパが高く評価されています。
              B店は接客の評価が高く、リピーター率が高い傾向があります。
            </p>
          </div>

          {/* Fake suggestions */}
          <div className="bg-white rounded-2xl p-6 border border-stone-100">
            <h2 className="text-lg font-bold text-stone-600 mb-4">
              改善提案
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-0.5">1.</span>
                <span className="text-stone-500">
                  ランチメニューの充実で新規顧客の獲得を図りましょう
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-0.5">2.</span>
                <span className="text-stone-500">
                  口コミ返信を積極的に行い、顧客とのコミュニケーションを強化しましょう
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-0.5">3.</span>
                <span className="text-stone-500">
                  SNSでの情報発信を強化し、店舗の認知度を向上させましょう
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-warm-50/80 to-warm-50">
          <div className="text-center bg-white rounded-3xl shadow-xl p-8 border border-primary-100 max-w-md mx-4">
            <div className="text-3xl mb-3">🔓</div>
            <h3 className="text-xl font-bold text-stone-700 mb-2">
              詳細レポートを見る
            </h3>
            <p className="text-stone-400 text-sm mb-6">
              口コミ分析・競合比較・改善提案を
              <br />
              無料登録で全て閲覧できます
            </p>
            <Link
              href={`/register?place_id=${placeId}&name=${encodeURIComponent(name)}&lat=${lat}&lng=${lng}`}
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-2xl transition-colors shadow-lg shadow-primary-500/20"
            >
              無料登録で詳細を見る
            </Link>
            <p className="text-xs text-stone-300 mt-3">
              Google認証で10秒で完了
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          </div>
        }
      >
        <ResultsContent />
      </Suspense>
    </>
  );
}
