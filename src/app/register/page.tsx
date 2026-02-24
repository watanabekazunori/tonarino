"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";

const BUSINESS_TYPES = ["居酒屋", "カフェ", "バー", "ラーメン", "その他"];

const CHALLENGES = [
  "集客・新規客が足りない",
  "リピーターが定着しない",
  "人手不足",
  "SNS・販促のやり方がわからない",
  "原価・コスト管理",
  "口コミ対策ができてない",
  "その他",
];

const POSITIONS = ["オーナー", "店長", "マネージャー", "スタッフ", "その他"];

// Detect in-app browsers (LINE, Instagram, Facebook, Twitter, etc.)
function isInAppBrowser(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || navigator.vendor || "";
  return /Line|FBAN|FBAV|Instagram|Twitter|Snapchat|MicroMessenger|WeChat/i.test(ua);
}

function RegisterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const placeId = searchParams.get("place_id") || "";
  const storeName = searchParams.get("name") || "";
  const lat = searchParams.get("lat") || "";
  const lng = searchParams.get("lng") || "";

  const [authMode] = useState<"google" | "email">("google");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [position, setPosition] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [challenge, setChallenge] = useState("");
  const [challengeOther, setChallengeOther] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"auth" | "profile">("auth");
  const [user, setUser] = useState<any>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationMessage, setGenerationMessage] = useState("");
  const [inAppBrowser, setInAppBrowser] = useState(false);

  useEffect(() => {
    setInAppBrowser(isInAppBrowser());
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        setStep("profile");
      }
    });
  }, []);

  const handleGoogleLogin = async () => {
    // If in-app browser, try to open in external browser
    if (inAppBrowser) {
      const currentUrl = window.location.href;
      // Try to open in external browser (Safari/Chrome)
      window.location.href = `x-safari-${currentUrl}`;
      // Fallback: show message
      setTimeout(() => {
        setError("アプリ内ブラウザではGoogleログインが使用できません。SafariまたはChromeで開き直してください。");
      }, 500);
      return;
    }

    setIsLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(`/register?place_id=${placeId}&name=${encodeURIComponent(storeName)}&lat=${lat}&lng=${lng}`)}`,
      },
    });
    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // まずサインアップを試行
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      // 既存ユーザーの場合はログインを試行
      if (signUpError.message.includes("already registered") || signUpError.message.includes("already exists")) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
          setIsLoading(false);
          return;
        }

        if (signInData.user) {
          setUser(signInData.user);
          setStep("profile");
        }
        setIsLoading(false);
        return;
      }

      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    if (data.user) {
      setUser(data.user);
      setStep("profile");
    }
    setIsLoading(false);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError("");

    const { error: insertError } = await supabase.from("users").upsert({
      id: user.id,
      email: user.email || email,
      auth_provider: authMode,
      store_name: storeName,
      place_id: placeId,
      user_name: userName,
      position,
      business_type: businessType,
      challenge,
      challenge_other: challenge === "その他" ? challengeOther : null,
      phone,
    });

    if (insertError) {
      setError(insertError.message);
      setIsLoading(false);
      return;
    }

    // Google Sheets にユーザー登録データを書き込み（fire-and-forget）
    fetch("/api/sheets/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName,
        email: user.email || email,
        position,
        businessType,
        challenge,
        challengeOther: challenge === "その他" ? challengeOther : null,
        phone,
        storeName,
        placeId,
      }),
    }).catch(() => {}); // エラーは無視

    // Fetch competitors first, then generate report
    setGeneratingReport(true);
    setGenerationProgress(5);
    setGenerationMessage("競合店舗を検索中...");

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      // Get competitors for this store
      let competitorPlaceIds: string[] = [];
      try {
        const compRes = await fetch("/api/competitors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            place_id: placeId,
            name: storeName,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            query: storeName,
            types: "",
          }),
        });
        const compData = await compRes.json();
        competitorPlaceIds = (compData.competitors || [])
          .slice(0, 5)
          .map((c: any) => c.place_id);
      } catch {
        // If competitors fetch fails, continue with empty array
      }

      setGenerationProgress(15);
      setGenerationMessage("AIが口コミを分析中...");

      // Start progress simulation (report takes ~2 min)
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          const increment = prev < 30 ? 3 : prev < 60 ? 2 : 1;
          return prev + increment;
        });
        setGenerationMessage((prev) => {
          // Rotate messages to show activity
          const messages = [
            "自店の口コミを分析中...",
            "自店の口コミを抽出中...",
            "競合店舗のスコアを算出中...",
            "競合との差分を分析中...",
            "改善提案を生成中...",
            "レポートをまとめています...",
          ];
          const currentIdx = messages.indexOf(prev);
          return messages[Math.min(currentIdx + 1, messages.length - 1)] || prev;
        });
      }, 8000);

      const res = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          place_id: placeId,
          competitors: competitorPlaceIds,
        }),
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);
      setGenerationMessage("完了！レポートを表示します");

      const data = await res.json();

      // Short delay to show 100%
      await new Promise((r) => setTimeout(r, 500));

      if (data.report?.id) {
        router.push(`/report/${data.report.id}`);
      } else {
        router.push("/mypage");
      }
    } catch {
      setGeneratingReport(false);
      router.push("/mypage");
    }
  };

  // ========== Generating Report Screen ==========
  if (generatingReport) {
    return (
      <div className="pt-20 pb-12 px-4 max-w-md mx-auto">
        <div className="text-center animate-fade-in">
          {/* Animated icon */}
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-primary-100 rounded-full" />
            <div
              className="absolute inset-0 border-4 border-primary-500 rounded-full animate-spin"
              style={{ borderTopColor: "transparent", borderRightColor: "transparent" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>

          <h2 className="text-xl font-bold text-stone-700 mb-2">
            レポートを生成しています
          </h2>
          <p className="text-stone-400 text-sm mb-8">
            AIが口コミを分析しています。少々お待ちください
          </p>

          {/* Progress bar */}
          <div className="w-full bg-stone-100 rounded-full h-3 mb-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${generationProgress}%` }}
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-stone-500">{generationMessage}</span>
            <span className="text-sm font-bold text-primary-500">{generationProgress}%</span>
          </div>

          {/* Steps indicator */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 text-left space-y-3">
            {[
              { label: "競合店舗の検索", threshold: 10 },
              { label: "自店の口コミ分析・口コミ抽出", threshold: 25 },
              { label: "競合5店舗の口コミ分析", threshold: 55 },
              { label: "競合との差分分析・改善提案", threshold: 80 },
              { label: "レポート作成完了", threshold: 100 },
            ].map((item) => {
              const isDone = generationProgress >= item.threshold;
              const isActive = !isDone && generationProgress >= item.threshold - 15;
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    isDone
                      ? "bg-primary-500 text-white"
                      : isActive
                      ? "bg-primary-100 text-primary-500 animate-pulse"
                      : "bg-stone-100 text-stone-300"
                  }`}>
                    {isDone ? (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className={`w-2 h-2 rounded-full ${isActive ? "bg-primary-500" : "bg-stone-300"}`} />
                    )}
                  </div>
                  <span className={`text-sm ${
                    isDone ? "text-stone-700 font-medium" : isActive ? "text-stone-600" : "text-stone-400"
                  }`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-stone-400 mt-6">
            通常1〜2分で完了します。このページを閉じないでください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12 px-4 max-w-md mx-auto">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-stone-700 mb-2">
          無料登録
        </h1>
        <p className="text-stone-400 text-sm">
          詳細レポートを無料で確認できます
        </p>
      </div>

      {step === "auth" && (
        <div className="animate-slide-up">
          {/* In-app browser warning */}
          {inAppBrowser && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <p className="text-sm text-amber-800 font-medium mb-2">
                アプリ内ブラウザを検出しました
              </p>
              <p className="text-xs text-amber-700 mb-3">
                Googleログインをご利用の場合は、SafariまたはChromeで開き直してください。メールでの登録はそのままご利用いただけます。
              </p>
              <button
                onClick={() => {
                  // Copy URL to clipboard and prompt user
                  navigator.clipboard?.writeText(window.location.href);
                  alert("URLをコピーしました。SafariまたはChromeに貼り付けて開いてください。");
                }}
                className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                URLをコピーする
              </button>
            </div>
          )}

          {/* Google auth button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading || inAppBrowser}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-stone-200 hover:border-primary-300 rounded-2xl px-6 py-4 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-medium text-stone-600">
              Googleアカウントで登録
            </span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-warm-50 text-stone-400">または</span>
            </div>
          </div>

          {/* Email auth form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-primary-400 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-primary-400 transition-colors"
                placeholder="6文字以上"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {isLoading ? "処理中..." : "メールで登録"}
            </button>
          </form>

          <p className="text-center text-xs text-stone-400 mt-4">
            登録することで
            <Link
              href="/privacy"
              target="_blank"
              className="text-primary-500 hover:text-primary-600 underline underline-offset-2 transition-colors"
            >
              プライバシーポリシー
            </Link>
            に同意したものとみなされます
          </p>
        </div>
      )}

      {step === "profile" && (
        <form onSubmit={handleProfileSubmit} className="space-y-5 animate-slide-up">
          {/* Store name (auto) */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">
              店舗名
            </label>
            <input
              type="text"
              value={storeName}
              readOnly
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-500"
            />
          </div>

          {/* User name */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">
              お名前 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-primary-400 transition-colors"
              placeholder="山田 太郎"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">
              役職 <span className="text-red-400">*</span>
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-primary-400 transition-colors appearance-none"
            >
              <option value="">選択してください</option>
              {POSITIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Business type */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">
              業態 <span className="text-red-400">*</span>
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-primary-400 transition-colors appearance-none"
            >
              <option value="">選択してください</option>
              {BUSINESS_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Challenge */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">
              今一番困っていること <span className="text-red-400">*</span>
            </label>
            <div className="space-y-2">
              {CHALLENGES.map((c) => (
                <label
                  key={c}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    challenge === c
                      ? "border-primary-400 bg-primary-50"
                      : "border-stone-200 bg-white hover:border-primary-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="challenge"
                    value={c}
                    checked={challenge === c}
                    onChange={(e) => setChallenge(e.target.value)}
                    className="accent-primary-500"
                  />
                  <span className="text-sm text-stone-600">{c}</span>
                </label>
              ))}
            </div>
            {challenge === "その他" && (
              <input
                type="text"
                value={challengeOther}
                onChange={(e) => setChallengeOther(e.target.value)}
                placeholder="具体的に教えてください"
                className="w-full mt-2 px-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-primary-400 transition-colors"
              />
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">
              電話番号 <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-primary-400 transition-colors"
              placeholder="090-1234-5678"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !userName || !position || !businessType || !challenge || !phone}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 shadow-lg shadow-primary-500/20"
          >
            {isLoading ? "処理中..." : "登録して詳細レポートを見る"}
          </button>

          <p className="text-center text-xs text-stone-400 mt-4">
            登録することで
            <Link
              href="/privacy"
              target="_blank"
              className="text-primary-500 hover:text-primary-600 underline underline-offset-2 transition-colors"
            >
              プライバシーポリシー
            </Link>
            に同意したものとみなされます
          </p>
        </form>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
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
        <RegisterContent />
      </Suspense>
    </>
  );
}
