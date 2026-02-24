"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import InquiryForm from "@/components/InquiryForm";
import { supabase } from "@/lib/supabase";

// ========== V1 Legacy Types ==========
interface ReviewCategory {
  category: string;
  score: "good" | "average" | "poor";
  summary: string;
}

// ========== V2 Types ==========
interface AxisScore {
  axis: string;
  label: string;
  score: number;
  summary: string;
}

interface AxisComparison {
  axis: string;
  label: string;
  commentary: string;
}

interface ReviewExcerpt {
  text: string;
  rating: number;
}

interface StoreAnalysis {
  name: string;
  place_id: string;
  reviewCount: number;
  rating: number;
  scores: AxisScore[];
}

// ========== Report (union) ==========
interface Report {
  id: string;
  place_id: string;
  competitors_json: Array<{ place_id: string; name: string }>;
  review_summary: any;
  comparison_text: string;
  suggestions: string[];
  created_at: string;
}

// ========== Helpers ==========
const scoreColor = (score: number) => {
  if (score >= 8) return { text: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
  if (score >= 5) return { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
  return { text: "text-red-500", bg: "bg-red-50", border: "border-red-200" };
};

const scoreIconV1 = (score: string) => {
  switch (score) {
    case "good":
      return { icon: "○", color: "text-green-500", bg: "bg-green-50" };
    case "average":
      return { icon: "△", color: "text-secondary-500", bg: "bg-secondary-50" };
    case "poor":
      return { icon: "×", color: "text-red-500", bg: "bg-red-50" };
    default:
      return { icon: "-", color: "text-stone-400", bg: "bg-stone-50" };
  }
};

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? "text-amber-400" : "text-stone-200"}>
        ★
      </span>
    );
  }
  return <span className="text-sm">{stars}</span>;
};

// ========== V2 Report View ==========
function ReportV2View({
  report,
  storeName,
}: {
  report: Report;
  storeName: string;
}) {
  const data = report.review_summary;
  const myStore: StoreAnalysis = data.my_store;
  const competitors: StoreAnalysis[] = data.competitors || [];
  const axisComparisons: AxisComparison[] = data.axis_comparisons || [];
  const goodReviews: ReviewExcerpt[] = data.good_reviews || [];
  const badReviews: ReviewExcerpt[] = data.bad_reviews || [];
  const suggestions: string[] = report.suggestions || [];

  const allStores = [myStore, ...competitors];
  const axes = myStore.scores || [];

  return (
    <div className="pt-20 pb-12 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-stone-700 mb-1">
          {storeName || myStore.name || "あなたのお店"} の競合分析レポート
        </h1>
        <p className="text-stone-400 text-sm">
          {new Date(report.created_at).toLocaleDateString("ja-JP")} 作成
        </p>
      </div>

      {/* Section 1: Score Comparison Table - 縦型レイアウト */}
      <section className="mb-8 animate-slide-up">
        <h2 className="text-lg font-bold text-stone-600 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary-500 rounded-full inline-block" />
          スコア比較（上位{competitors.length}店舗）
        </h2>

        {/* Axis Labels Header */}
        <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: "1fr repeat(4, 56px)" }}>
          <div />
          {axes.map((axis) => (
            <div key={axis.axis} className="text-center text-xs font-bold text-stone-500">
              {axis.label}
            </div>
          ))}
        </div>

        {/* Store Rows */}
        <div className="space-y-2">
          {allStores.map((store, i) => (
            <div
              key={store.place_id || i}
              className={`grid gap-2 items-center rounded-xl p-2.5 ${
                i === 0
                  ? "bg-primary-50 border-2 border-primary-200"
                  : "bg-white border border-stone-100"
              }`}
              style={{ gridTemplateColumns: "1fr repeat(4, 56px)" }}
            >
              {/* Store Name + Meta */}
              <div className="min-w-0 pr-2">
                <div className={`text-sm font-bold leading-tight ${
                  i === 0 ? "text-primary-600" : "text-stone-700"
                }`}>
                  {i === 0 ? (
                    <span className="inline-block bg-primary-500 text-white text-[10px] px-1.5 py-0.5 rounded mr-1.5 align-middle">自店</span>
                  ) : null}
                  {store.name}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-stone-400">★ {store.rating}</span>
                  <span className="text-xs text-stone-400">口コミ {store.reviewCount.toLocaleString()}件</span>
                </div>
              </div>

              {/* 4 Axis Scores */}
              {axes.map((axis) => {
                const storeAxis = (store.scores || []).find(
                  (s: AxisScore) => s.axis === axis.axis
                );
                const score = storeAxis?.score || 0;
                const colors = scoreColor(score);

                return (
                  <div
                    key={axis.axis}
                    className={`text-center py-1.5 rounded-lg ${colors.bg}`}
                    title={storeAxis?.summary || ""}
                  >
                    <div className={`text-lg font-black ${colors.text}`}>
                      {score}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-end gap-4 mt-3 text-[10px] text-stone-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-green-100 inline-block" /> 8-10 高評価</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-100 inline-block" /> 5-7 普通</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-100 inline-block" /> 1-4 低評価</span>
        </div>
      </section>

      {/* Section 3: Competitive Differentials (4-axis) */}
      {axisComparisons.length > 0 && (
        <section className="mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-lg font-bold text-stone-600 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-secondary-500 rounded-full inline-block" />
            競合との差分
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {axisComparisons.map((ac) => {
              const axisColors: Record<string, string> = {
                price: "border-l-green-500",
                taste: "border-l-amber-500",
                service: "border-l-blue-500",
                comfort: "border-l-purple-500",
              };
              return (
                <div
                  key={ac.axis}
                  className={`bg-white rounded-xl p-5 border border-stone-100 border-l-4 ${
                    axisColors[ac.axis] || "border-l-stone-300"
                  }`}
                >
                  <h3 className="font-bold text-stone-700 text-sm mb-2">
                    {ac.label}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {ac.commentary}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Section 4: Good & Bad Reviews */}
      {(goodReviews.length > 0 || badReviews.length > 0) && (
        <section className="mb-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-lg font-bold text-stone-600 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-amber-500 rounded-full inline-block" />
            口コミピックアップ
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Good Reviews */}
            <div>
              <h3 className="text-sm font-bold text-green-600 mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                  ★
                </span>
                いい口コミ
                <span className="text-stone-400 font-normal">
                  ({goodReviews.length}件)
                </span>
              </h3>
              <div className="space-y-2">
                {goodReviews.map((review, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-4 border border-green-100 border-l-4 border-l-green-400"
                  >
                    <div className="mb-1.5">{renderStars(review.rating)}</div>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                ))}
                {goodReviews.length === 0 && (
                  <p className="text-stone-400 text-sm">データなし</p>
                )}
              </div>
            </div>

            {/* Bad Reviews */}
            <div>
              <h3 className="text-sm font-bold text-red-500 mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs">
                  ★
                </span>
                悪い口コミ
                <span className="text-stone-400 font-normal">
                  ({badReviews.length}件)
                </span>
              </h3>
              <div className="space-y-2">
                {badReviews.map((review, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-4 border border-red-100 border-l-4 border-l-red-400"
                  >
                    <div className="mb-1.5">{renderStars(review.rating)}</div>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                ))}
                {badReviews.length === 0 && (
                  <p className="text-stone-400 text-sm">データなし</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 5: Suggestions */}
      {suggestions.length > 0 && (
        <section className="mb-8 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-lg font-bold text-stone-600 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-green-500 rounded-full inline-block" />
            改善提案
          </h2>
          <div className="space-y-3">
            {suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-stone-100 flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-500 font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </div>
                <p className="text-stone-600 text-sm leading-relaxed pt-1">
                  {suggestion}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ========== V1 Legacy Report View ==========
function ReportV1View({
  report,
  storeName,
}: {
  report: Report;
  storeName: string;
}) {
  const myStoreCategories: ReviewCategory[] =
    report.review_summary?.my_store || [];
  const competitorAnalyses =
    report.review_summary?.competitors || [];

  return (
    <div className="pt-20 pb-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-stone-700 mb-1">
          {storeName || "あなたのお店"} の詳細レポート
        </h1>
        <p className="text-stone-400 text-sm">
          {new Date(report.created_at).toLocaleDateString("ja-JP")} 作成
        </p>
      </div>

      <section className="mb-8 animate-slide-up">
        <h2 className="text-lg font-bold text-stone-600 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary-500 rounded-full inline-block" />
          口コミキーワード分析
        </h2>
        <div className="bg-white rounded-2xl p-6 border border-primary-100 mb-4">
          <h3 className="font-bold text-primary-500 mb-4">
            {storeName || "あなたのお店"}
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {myStoreCategories.map((cat: ReviewCategory) => {
              const s = scoreIconV1(cat.score);
              return (
                <div key={cat.category} className="text-center">
                  <div className="text-sm font-medium text-stone-500 mb-2">
                    {cat.category}
                  </div>
                  <div
                    className={`text-2xl font-bold ${s.color} ${s.bg} rounded-xl py-2`}
                  >
                    {s.icon}
                  </div>
                  <div className="text-xs text-stone-400 mt-1 line-clamp-2">
                    {cat.summary}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {competitorAnalyses.map((comp: any) => (
          <div
            key={comp.place_id}
            className="bg-white rounded-2xl p-6 border border-stone-100 mb-3"
          >
            <h3 className="font-bold text-stone-500 mb-4">{comp.name}</h3>
            <div className="grid grid-cols-5 gap-3">
              {(comp.categories || []).map((cat: ReviewCategory) => {
                const s = scoreIconV1(cat.score);
                return (
                  <div key={cat.category} className="text-center">
                    <div className="text-sm font-medium text-stone-400 mb-2">
                      {cat.category}
                    </div>
                    <div
                      className={`text-xl font-bold ${s.color} ${s.bg} rounded-xl py-2`}
                    >
                      {s.icon}
                    </div>
                    <div className="text-xs text-stone-400 mt-1 line-clamp-2">
                      {cat.summary}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {report.comparison_text && (
        <section className="mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-lg font-bold text-stone-600 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-secondary-500 rounded-full inline-block" />
            競合との差分
          </h2>
          <div className="bg-white rounded-2xl p-6 border border-stone-100">
            <p className="text-stone-600 leading-relaxed">
              {report.comparison_text}
            </p>
          </div>
        </section>
      )}

      {report.suggestions && report.suggestions.length > 0 && (
        <section className="mb-8 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-lg font-bold text-stone-600 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-green-500 rounded-full inline-block" />
            改善提案
          </h2>
          <div className="space-y-3">
            {report.suggestions.map((suggestion: string, idx: number) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-stone-100 flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-500 font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </div>
                <p className="text-stone-600 text-sm leading-relaxed pt-1">
                  {suggestion}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ========== Main Page ==========
export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [storeName, setStoreName] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (!token) {
        router.push("/register");
        return;
      }

      try {
        const res = await fetch(`/api/report?id=${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.report) {
          setReport(data.report);
        }

        const { data: profile } = await supabase
          .from("users")
          .select("store_name, user_name, email")
          .single();

        if (profile) {
          setStoreName(profile.store_name);
          setUserName(profile.user_name || "");
          setUserEmail(profile.email || "");
        }
      } catch (error) {
        console.error("Failed to fetch report:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [params.id, router]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone-500">レポートを読み込み中...</p>
          </div>
        </div>
      </>
    );
  }

  if (!report) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-stone-500 mb-4">
              レポートが見つかりませんでした
            </p>
            <button
              onClick={() => router.push("/mypage")}
              className="text-primary-500 hover:text-primary-600"
            >
              マイページに戻る
            </button>
          </div>
        </div>
      </>
    );
  }

  // V1/V2 version detection
  const isV2 = report.review_summary?.version === 2;

  return (
    <>
      <Header />
      {isV2 ? (
        <ReportV2View report={report} storeName={storeName} />
      ) : (
        <ReportV1View report={report} storeName={storeName} />
      )}
      {/* お問い合わせフォーム */}
      <div className="max-w-5xl mx-auto px-4">
        <InquiryForm
          defaultName={userName}
          defaultEmail={userEmail}
          defaultStoreName={storeName}
        />
      </div>

      <div className="text-center pb-12">
        <button
          onClick={() => router.push("/mypage")}
          className="text-primary-500 hover:text-primary-600 text-sm transition-colors"
        >
          マイページに戻る
        </button>
      </div>
    </>
  );
}
