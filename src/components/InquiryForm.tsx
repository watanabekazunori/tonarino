"use client";

import { useState } from "react";

interface InquiryFormProps {
  defaultName?: string;
  defaultEmail?: string;
  defaultStoreName?: string;
}

export default function InquiryForm({
  defaultName = "",
  defaultEmail = "",
  defaultStoreName = "",
}: InquiryFormProps) {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [storeName] = useState(defaultStoreName);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, storeName, message }),
      });

      if (!res.ok) {
        throw new Error("送信に失敗しました");
      }

      setSubmitted(true);
    } catch {
      setError("送信に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="mb-8 animate-fade-in">
        <div className="bg-gradient-to-br from-primary-50 to-orange-50 rounded-2xl p-8 border border-primary-100 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-stone-700 mb-2">
            お問い合わせありがとうございます
          </h3>
          <p className="text-stone-500 text-sm">
            内容を確認の上、担当者よりご連絡いたします。
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8 animate-slide-up" style={{ animationDelay: "0.5s" }}>
      <h2 className="text-lg font-bold text-stone-600 mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-primary-500 rounded-full inline-block" />
        もっと詳しいレポートが必要ですか？
      </h2>

      <div className="bg-gradient-to-br from-primary-50 to-orange-50 rounded-2xl p-6 border border-primary-100">
        <p className="text-stone-600 text-sm mb-5 leading-relaxed">
          より詳細な競合分析や、具体的な改善プランをご希望の方は、
          お気軽にお問い合わせください。専門スタッフが個別にサポートいたします。
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">
              お名前 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-primary-400 transition-colors"
              placeholder="山田 太郎"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">
              メールアドレス <span className="text-red-400">*</span>
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
              店舗名
            </label>
            <input
              type="text"
              value={storeName}
              readOnly
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">
              お問い合わせ内容 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-primary-400 transition-colors resize-none"
              placeholder="詳しいレポートを希望します。特に○○について知りたいです。"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !name || !email || !message}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 shadow-lg shadow-primary-500/20"
          >
            {isSubmitting ? "送信中..." : "お問い合わせを送信"}
          </button>
        </form>
      </div>
    </section>
  );
}
