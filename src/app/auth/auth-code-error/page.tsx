"use client";

import Link from "next/link";

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-xl font-bold text-stone-800 mb-2">
          ログインに失敗しました
        </h1>
        <p className="text-stone-600 mb-6">
          Google認証でエラーが発生しました。もう一度お試しください。
        </p>
        <Link
          href="/"
          className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-xl transition-colors"
        >
          トップに戻る
        </Link>
      </div>
    </div>
  );
}
