"use client";

import Header from "@/components/Header";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-2xl font-bold text-stone-700 mb-2">
            プライバシーポリシー
          </h1>
          <p className="text-stone-400 text-sm">
            最終更新日：2025年1月1日
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-10 shadow-soft animate-slide-up space-y-8">
          {/* 前文 */}
          <div>
            <p className="text-sm text-stone-600 leading-relaxed">
              Tonarino（トナリノ）（以下「本サービス」といいます）は、ユーザーの個人情報の保護を重要と考え、個人情報の保護に関する法律（個人情報保護法）を遵守するとともに、以下のプライバシーポリシー（以下「本ポリシー」といいます）に従い、適切な取り扱いおよび保護に努めます。
            </p>
          </div>

          {/* 第1条 個人情報の収集 */}
          <section>
            <h2 className="text-lg font-bold text-stone-700 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-xs font-bold">
                1
              </span>
              個人情報の収集
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-3">
              本サービスは、サービスの提供にあたり、以下の個人情報を収集する場合があります。
            </p>
            <ul className="space-y-2 text-sm text-stone-600">
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>メールアドレス</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>Googleアカウント情報（Google認証を利用した場合）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>店舗名</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>Google Place ID（店舗の識別情報）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>業態（ビジネスタイプ）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>経営課題に関する情報</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>電話番号</span>
              </li>
            </ul>
          </section>

          {/* 第2条 利用目的 */}
          <section>
            <h2 className="text-lg font-bold text-stone-700 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-xs font-bold">
                2
              </span>
              利用目的
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-3">
              収集した個人情報は、以下の目的で利用いたします。
            </p>
            <ul className="space-y-2 text-sm text-stone-600">
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>ユーザー認証およびアカウント管理</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>Google Places APIを利用した店舗口コミデータの取得および競合分析レポートの生成</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>Google Gemini AIを活用した口コミ分析および改善提案の提供</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>サービスの改善および新機能の開発</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>ユーザーへの重要なお知らせ・サポートの提供</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>サービス利用状況の分析および統計データの作成（個人を特定できない形式）</span>
              </li>
            </ul>
          </section>

          {/* 第3条 第三者への提供 */}
          <section>
            <h2 className="text-lg font-bold text-stone-700 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-xs font-bold">
                3
              </span>
              第三者への提供
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-3">
              本サービスは、以下の場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
            </p>
            <ul className="space-y-2 text-sm text-stone-600">
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>法令に基づき開示が必要な場合</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>ユーザーの生命、身体または財産の保護のために必要であり、本人の同意を得ることが困難な場合</span>
              </li>
            </ul>
            <div className="mt-4 p-4 bg-warm-50 border border-stone-100 rounded-xl">
              <p className="text-sm text-stone-600 leading-relaxed mb-2 font-medium">
                外部サービスとの連携について
              </p>
              <p className="text-sm text-stone-500 leading-relaxed">
                本サービスでは、レポート生成のために以下の外部サービスを利用しています。これらのサービスに対して、分析に必要な最小限の情報（店舗のPlace ID等）を送信します。
              </p>
              <ul className="mt-2 space-y-1 text-sm text-stone-500">
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">-</span>
                  <span>
                    <strong className="text-stone-600">Google Places API</strong>
                    ：店舗および競合店舗の口コミ・評価データの取得に使用します。Googleのプライバシーポリシーに準じて処理されます。
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">-</span>
                  <span>
                    <strong className="text-stone-600">Google Gemini AI</strong>
                    ：口コミデータの分析、競合比較、改善提案の生成に使用します。送信されたデータはGoogleのAI利用規約に準じて処理されます。
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* 第4条 個人情報の管理 */}
          <section>
            <h2 className="text-lg font-bold text-stone-700 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-xs font-bold">
                4
              </span>
              個人情報の管理
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-3">
              本サービスは、ユーザーの個人情報を適切に管理し、不正アクセス、紛失、破壊、改ざんおよび漏洩の防止に努めます。
            </p>
            <ul className="space-y-2 text-sm text-stone-600">
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>ユーザーデータは<strong className="text-stone-700">Supabase</strong>（クラウドデータベースサービス）上に安全に保管されます</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>通信はSSL/TLSにより暗号化されています</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>認証情報はSupabase Authにより安全に管理されます</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>パスワードはハッシュ化して保存され、平文で保存されることはありません</span>
              </li>
            </ul>
          </section>

          {/* 第5条 Cookie等の利用 */}
          <section>
            <h2 className="text-lg font-bold text-stone-700 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-xs font-bold">
                5
              </span>
              Cookie等の利用
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-3">
              本サービスでは、以下の目的でCookieおよび類似技術を使用する場合があります。
            </p>
            <ul className="space-y-2 text-sm text-stone-600">
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>ユーザーの認証状態の維持（セッション管理）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>サービスの利用状況の把握および改善</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">-</span>
                <span>ユーザー体験の向上</span>
              </li>
            </ul>
            <p className="text-sm text-stone-500 leading-relaxed mt-3">
              ユーザーはブラウザの設定によりCookieの受け入れを拒否することができますが、その場合、本サービスの一部機能が利用できなくなる場合があります。
            </p>
          </section>

          {/* 第6条 個人情報の開示・訂正・削除 */}
          <section>
            <h2 className="text-lg font-bold text-stone-700 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-xs font-bold">
                6
              </span>
              個人情報の開示・訂正・削除
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              ユーザーは、本サービスが保有する自身の個人情報について、開示・訂正・削除を求めることができます。ご希望の場合は、下記のお問い合わせ先までご連絡ください。ご本人確認の上、合理的な期間内に対応いたします。
            </p>
          </section>

          {/* 第7条 プライバシーポリシーの変更 */}
          <section>
            <h2 className="text-lg font-bold text-stone-700 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-xs font-bold">
                7
              </span>
              プライバシーポリシーの変更
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              本ポリシーの内容は、法令の変更やサービスの変更等により、ユーザーに通知することなく変更される場合があります。変更後のプライバシーポリシーは、本ページに掲載した時点から効力を生じるものとします。
            </p>
          </section>

          {/* 第8条 お問い合わせ */}
          <section>
            <h2 className="text-lg font-bold text-stone-700 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-xs font-bold">
                8
              </span>
              お問い合わせ
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              本ポリシーに関するお問い合わせは、以下の窓口までお願いいたします。
            </p>
            <div className="mt-3 p-4 bg-warm-50 border border-stone-100 rounded-xl">
              <p className="text-sm text-stone-600">
                <strong className="text-stone-700">サービス名</strong>：Tonarino（トナリノ）
              </p>
              <p className="text-sm text-stone-600 mt-1">
                <strong className="text-stone-700">お問い合わせ</strong>：本サービス内のお問い合わせフォームよりご連絡ください
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-stone-400">
          &copy; {new Date().getFullYear()} Tonarino（トナリノ） All rights reserved.
        </div>
      </div>
    </>
  );
}
