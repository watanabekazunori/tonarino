import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import SearchBox from "@/components/SearchBox";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <>
      <Header />

      {/* ═══════ HERO — Left text, Right visual ═══════ */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center px-4 pt-20 pb-16 z-10">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary-200/25 blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-secondary-200/15 blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* Left — Copy + Search */}
          <div className="animate-fade-in relative z-10">
            <h1 className="flex mb-5">
              <Logo size="md" layout="vertical" />
            </h1>
            <p className="text-[1.6rem] md:text-[2rem] font-bold text-stone-800 leading-snug tracking-tight">
              あなたの<span className="text-gradient">&ldquo;となり&rdquo;</span>、<br />見てみませんか？
            </p>
            <p className="text-stone-500 text-[15px] mt-4 leading-relaxed">
              店名を入れるだけ。AIがとなりの競合を丸ごと分析します。
            </p>

            <div className="mt-7 animate-slide-up" style={{ animationDelay: "0.12s" }}>
              <SearchBox />
            </div>
          </div>

          {/* Right — Product mockup */}
          <div className="animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <div className="rounded-2xl overflow-hidden shadow-soft-lg border border-stone-200/60">
              <Image src="/images/mock-map.svg" alt="Tonarino 競合マップ画面" width={600} height={380} className="w-full h-auto" priority />
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <span className="text-[10px] text-stone-300 tracking-widest">SCROLL</span>
          <svg className="w-4 h-4 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ═══════ TRUST BADGES — full-width gradient section ═══════ */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-primary-50" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-200/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-200/40 to-transparent" />
        {/* Decorative blurs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary-200/30 blur-[80px]" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-amber-200/30 blur-[80px]" />

        <div className="relative max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
            {/* Card 1: カンタン操作 */}
            <div className="bg-white rounded-3xl px-6 py-10 flex flex-col items-center text-center shadow-[0_4px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_48px_rgba(249,115,22,0.15)] transition-all duration-400 hover:-translate-y-2 group">
              <div className="w-24 h-24 md:w-28 md:h-28 mb-6 group-hover:scale-105 transition-transform duration-300">
                <Image src="/icons/badge-no-register.svg" alt="カンタン操作" width={112} height={112} className="w-full h-full" />
              </div>
              <p className="text-xs text-stone-400 mb-2 tracking-wider">店名を入れるだけ</p>
              <p className="text-xl md:text-2xl font-black text-stone-800 tracking-tight">カンタン操作</p>
              <svg className="w-5 h-5 text-primary-300 mt-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Card 2: 完全無料 */}
            <div className="bg-white rounded-3xl px-6 py-10 flex flex-col items-center text-center shadow-[0_4px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_48px_rgba(16,185,129,0.15)] transition-all duration-400 hover:-translate-y-2 group">
              <div className="w-24 h-24 md:w-28 md:h-28 mb-6 group-hover:scale-105 transition-transform duration-300">
                <Image src="/icons/badge-free.svg" alt="完全無料" width={112} height={112} className="w-full h-full" />
              </div>
              <p className="text-xs text-stone-400 mb-2 tracking-wider">すべての機能が0円</p>
              <p className="text-xl md:text-2xl font-black text-stone-800 tracking-tight">完全無料</p>
              <svg className="w-5 h-5 text-emerald-300 mt-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Card 3: 10秒で結果 */}
            <div className="bg-white rounded-3xl px-6 py-10 flex flex-col items-center text-center shadow-[0_4px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_48px_rgba(59,130,246,0.15)] transition-all duration-400 hover:-translate-y-2 group">
              <div className="w-24 h-24 md:w-28 md:h-28 mb-6 group-hover:scale-105 transition-transform duration-300">
                <Image src="/icons/badge-speed.svg" alt="10秒で結果" width={112} height={112} className="w-full h-full" />
              </div>
              <p className="text-xs text-stone-400 mb-2 tracking-wider">AIが瞬時に分析完了</p>
              <p className="text-xl md:text-2xl font-black text-stone-800 tracking-tight">10秒で結果</p>
              <svg className="w-5 h-5 text-blue-300 mt-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES — 3 cards with mock images ═══════ */}
      <section className="py-20 md:py-28 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label text-primary-500 mb-3">FEATURES</p>
            <h2 className="text-[1.5rem] md:text-[1.85rem] font-bold text-stone-800 leading-snug">
              店名を入れるだけで、<span className="text-gradient">ここまでわかる</span>
            </h2>
          </div>

          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
            <div className="rounded-2xl overflow-hidden shadow-soft-lg border border-stone-100">
              <Image src="/images/mock-map.svg" alt="競合マップ画面" width={600} height={380} className="w-full h-auto" />
            </div>
            <div>
              <span className="num-highlight text-5xl text-primary-200">01</span>
              <h3 className="text-xl font-bold text-stone-800 mt-1 mb-3">半径2kmの競合を自動検出</h3>
              <p className="text-[15px] text-stone-500 leading-relaxed mb-5">
                あなたのお店の周りにある競合店を、Google Maps上にマッピング。評価・口コミ件数・距離がひと目でわかります。
              </p>
              <div className="flex gap-3">
                <span className="text-xs bg-primary-50 text-primary-700 font-semibold px-3 py-1.5 rounded-full">地図表示</span>
                <span className="text-xs bg-primary-50 text-primary-700 font-semibold px-3 py-1.5 rounded-full">評価比較</span>
                <span className="text-xs bg-primary-50 text-primary-700 font-semibold px-3 py-1.5 rounded-full">距離表示</span>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
            <div className="md:order-2 rounded-2xl overflow-hidden shadow-soft-lg border border-stone-100">
              <Image src="/images/mock-report.svg" alt="AI分析レポート画面" width={600} height={380} className="w-full h-auto" />
            </div>
            <div className="md:order-1">
              <span className="num-highlight text-5xl text-primary-200">02</span>
              <h3 className="text-xl font-bold text-stone-800 mt-1 mb-3">5軸のAI口コミ分析</h3>
              <p className="text-[15px] text-stone-500 leading-relaxed mb-5">
                接客・価格・雰囲気・料理・立地の5カテゴリで、あなたのお店と競合を自動スコアリング。強みと弱みが一目瞭然。
              </p>
              <div className="flex gap-3">
                <span className="text-xs bg-primary-50 text-primary-700 font-semibold px-3 py-1.5 rounded-full">5軸分析</span>
                <span className="text-xs bg-primary-50 text-primary-700 font-semibold px-3 py-1.5 rounded-full">競合比較</span>
                <span className="text-xs bg-primary-50 text-primary-700 font-semibold px-3 py-1.5 rounded-full">改善提案</span>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="rounded-2xl overflow-hidden bg-stone-900 p-8 shadow-soft-lg">
              <div className="space-y-4">
                {["ランチセットメニューで価格評価を改善", "SNS投稿を促すフォトスポット設置", "リピーター向けポイントカード導入"].map((s, i) => (
                  <div key={i} className="flex items-start gap-3 bg-stone-800 rounded-xl p-4">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{i + 1}</span>
                    </div>
                    <p className="text-stone-200 text-sm leading-relaxed pt-1">{s}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="num-highlight text-5xl text-primary-200">03</span>
              <h3 className="text-xl font-bold text-stone-800 mt-1 mb-3">明日からできる改善提案</h3>
              <p className="text-[15px] text-stone-500 leading-relaxed mb-5">
                分析結果をもとに、AIが具体的な改善アクションを3つ提案。「何をすればいいか」がすぐにわかります。
              </p>
              <div className="flex gap-3">
                <span className="text-xs bg-primary-50 text-primary-700 font-semibold px-3 py-1.5 rounded-full">AI生成</span>
                <span className="text-xs bg-primary-50 text-primary-700 font-semibold px-3 py-1.5 rounded-full">具体的</span>
                <span className="text-xs bg-primary-50 text-primary-700 font-semibold px-3 py-1.5 rounded-full">即実行</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ PAIN POINTS — 3 items ═══════ */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label text-primary-500 mb-3">PROBLEM</p>
            <h2 className="text-[1.5rem] md:text-[1.75rem] font-bold text-stone-800">
              飲食店オーナーの<span className="text-gradient">よくある悩み</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "競合の実態が見えない",
                desc: "近くに新しい店ができても、評判や口コミを一つずつ調べるのは大変。全体像が掴めない。",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                ),
              },
              {
                num: "02",
                title: "自店の強み・弱みが不明",
                desc: "口コミを読んでも客観的な評価が難しい。他店と比べて自分の店がどうなのかわからない。",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                ),
              },
              {
                num: "03",
                title: "改善の方向性がわからない",
                desc: "なんとなく客足が減っている。でも何を改善すれば効果が出るのか、手がかりがない。",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.num} className="relative bg-white rounded-2xl border border-stone-100 p-7 hover:shadow-soft-lg transition-all duration-300">
                <span className="absolute top-4 right-5 num-highlight text-[3rem] leading-none text-stone-100 select-none">{item.num}</span>
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-stone-900 text-white flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-stone-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-stone-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <svg className="w-8 h-8 text-primary-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <p className="text-lg font-bold text-stone-800">
              <span className="text-gradient">Tonarino</span> が、すべて解決します
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ VOICE — no avatar, text-focused ═══════ */}
      <section className="dark-section py-20 md:py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label text-primary-400 mb-3">VOICE</p>
            <h2 className="text-2xl font-bold text-white">利用者の声</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                text: "隣にできたカフェの口コミを見て、すぐにメニューを見直しました。結果、評価が0.3ポイント上がりました。",
                role: "カフェ経営",
                area: "東京・渋谷",
              },
              {
                text: "接客の評価が競合より低いことに気づけた。スタッフ研修をすぐに実施して、口コミが改善しました。",
                role: "居酒屋経営",
                area: "大阪・梅田",
              },
              {
                text: "改善提案が具体的。提案通りにセットメニューを導入したら客単価が上がった。",
                role: "イタリアン経営",
                area: "福岡・天神",
              },
            ].map((v, i) => (
              <div key={i} className="bg-stone-800/60 backdrop-blur border border-stone-700/40 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-3.5 h-3.5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-stone-300 text-[13px] leading-relaxed mb-5">
                  &ldquo;{v.text}&rdquo;
                </p>
                <div className="pt-4 border-t border-stone-700/40">
                  <p className="text-xs text-stone-400 font-medium">{v.role}</p>
                  <p className="text-[11px] text-stone-500">{v.area}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-20 md:py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary-100/30 blur-[100px]" />
        </div>
        <div className="max-w-2xl mx-auto text-center">
          <p className="section-label text-primary-500 mb-3">GET STARTED</p>
          <h2 className="text-2xl md:text-[1.75rem] font-bold text-stone-800 mb-3 leading-snug">
            まずは自分のお店を検索してみてください
          </h2>
          <p className="text-stone-400 text-sm mb-10">
            登録なし・完全無料で、すぐに結果が見れます。
          </p>
          <SearchBox />
          <p className="text-stone-300 text-[11px] mt-6">
            ※ 検索データは分析目的でのみ使用し、第三者に提供することはありません
          </p>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-stone-200 py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <nav className="flex items-center gap-6 text-xs text-stone-400">
            <Link href="/register" className="hover:text-primary-500 transition-colors">無料登録</Link>
            <span className="text-stone-200">|</span>
            <span>&copy; 2025 Tonarino</span>
          </nav>
        </div>
      </footer>
    </>
  );
}
