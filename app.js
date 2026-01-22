const { useState, useEffect } = React;

// ========== アイコンコンポーネント ==========
const Icons = {
  Star: ({ filled, className = "w-4 h-4" }) => (
    <svg className={`${className} ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  TrendUp: () => (
    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  MapPin: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Home: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Trophy: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  LightBulb: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Alert: () => (
    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

// ========== 共通コンポーネント ==========
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Icons.Star key={star} filled={star <= Math.round(rating)} />
    ))}
    <span className="ml-1 text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
  </div>
);

// 広告バナーコンポーネント
const AdBanner = ({ position = "top" }) => (
  <div className={`bg-gray-100 border border-dashed border-gray-300 rounded-lg p-3 text-center ${position === 'bottom' ? 'mt-4' : 'mb-4'}`}>
    <p className="text-xs text-gray-400">広告スペース</p>
    <p className="text-xs text-gray-300">320×50 / 320×100</p>
  </div>
);

// ========== 画面コンポーネント ==========

// ログイン画面
const LoginScreen = ({ onLogin, onRegister }) => (
  <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <span className="text-white text-2xl font-bold">T</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">TONARINO</h1>
        <p className="text-xs text-gray-400 tracking-widest">トナリノ</p>
        <p className="text-sm text-gray-500 mt-2">隣のお店、気になりませんか？</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
          <input
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            placeholder="example@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
          <input
            type="password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            placeholder="••••••••"
          />
        </div>
        <button
          onClick={onLogin}
          className="w-full gradient-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          ログイン
        </button>
        <button
          onClick={onRegister}
          className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          新規登録
        </button>
      </div>
    </div>
  </div>
);

// 店舗登録画面
const RegisterScreen = ({ onRegister, onBack }) => (
  <div className="min-h-screen bg-gray-50 p-4">
    <div className="max-w-sm mx-auto">
      <button onClick={onBack} className="text-gray-500 mb-4">← 戻る</button>
      <h1 className="text-xl font-bold text-gray-800 mb-6">店舗情報を登録</h1>

      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">店舗名 *</label>
          <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500" placeholder="例: 居酒屋 さくら" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">住所 *</label>
          <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500" placeholder="例: 大阪府大阪市中央区..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">業態 *</label>
          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500">
            <option>居酒屋</option>
            <option>カフェ</option>
            <option>レストラン</option>
            <option>ラーメン</option>
            <option>焼肉</option>
            <option>寿司</option>
            <option>その他</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">オーナー名 *</label>
          <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500" placeholder="山田 太郎" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">電話番号 *</label>
          <input type="tel" className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500" placeholder="06-1234-5678" />
        </div>
        <button onClick={onRegister} className="w-full gradient-primary text-white py-3 rounded-lg font-semibold mt-4">
          登録して分析を開始
        </button>
      </div>
    </div>
  </div>
);

// ダッシュボード
const Dashboard = () => {
  const myShop = {
    name: "居酒屋 さくら",
    rating: 4.2,
    reviewCount: 156,
    rank: 3,
    totalShops: 24,
    trendValue: "+0.2"
  };

  const rankingCategories = [
    { name: "総合評価", myRank: 3, icon: "⭐" },
    { name: "口コミ数", myRank: 5, icon: "💬" },
    { name: "コスパ", myRank: 2, icon: "💰" },
    { name: "評価上昇率", myRank: 1, icon: "📈" },
    { name: "料理の味", myRank: 4, icon: "🍳" },
    { name: "接客", myRank: 2, icon: "😊" },
  ];

  return (
    <div className="space-y-4">
      <AdBanner position="top" />

      {/* ヘッダー */}
      <div className="gradient-primary rounded-xl p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Icons.MapPin />
          <span className="text-sm opacity-90">梅田駅周辺 / 居酒屋</span>
        </div>
        <h2 className="text-xl font-bold">{myShop.name}</h2>
      </div>

      {/* スコアカード */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">評価スコア</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-800">{myShop.rating}</span>
            <div className="flex items-center text-green-500 text-sm">
              <Icons.TrendUp />
              <span className="ml-1">{myShop.trendValue}</span>
            </div>
          </div>
          <StarRating rating={myShop.rating} />
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">総合ランキング</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-orange-500">{myShop.rank}位</span>
            <span className="text-sm text-gray-500">/ {myShop.totalShops}店</span>
          </div>
          <div className="mt-1 bg-orange-100 rounded-full h-2">
            <div className="gradient-primary rounded-full h-2" style={{ width: `${((myShop.totalShops - myShop.rank + 1) / myShop.totalShops) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* ランキング一覧 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">📊 あなたのお店のランキング</h3>
        <div className="grid grid-cols-3 gap-2">
          {rankingCategories.map((cat, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl p-3 text-center">
              <span className="text-2xl">{cat.icon}</span>
              <p className="text-xs text-gray-500 mt-1">{cat.name}</p>
              <p className="text-lg font-bold text-gray-800">
                {cat.myRank}位
                {cat.myRank <= 3 && <span className="ml-1">{cat.myRank === 1 ? '🥇' : cat.myRank === 2 ? '🥈' : '🥉'}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 口コミサマリー */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">💬 口コミサマリー</h3>
        <div className="flex justify-between text-center">
          <div>
            <p className="text-2xl font-bold text-gray-800">{myShop.reviewCount}</p>
            <p className="text-xs text-gray-500">総口コミ数</p>
          </div>
          <div className="border-l border-gray-200 pl-4">
            <p className="text-2xl font-bold text-green-500">78%</p>
            <p className="text-xs text-gray-500">ポジティブ</p>
          </div>
          <div className="border-l border-gray-200 pl-4">
            <p className="text-2xl font-bold text-red-500">12%</p>
            <p className="text-xs text-gray-500">ネガティブ</p>
          </div>
        </div>
      </div>

      {/* 課題アラート */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
        <h3 className="font-semibold text-gray-800 mb-2">⚠️ 今すぐ対策が必要な課題</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Icons.Alert />
            <span>「待ち時間が長い」の声が増加中（12件）</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Icons.Alert />
            <span>「価格が高い」で競合に負けています</span>
          </div>
        </div>
      </div>

      <AdBanner position="bottom" />
    </div>
  );
};

// ランキング画面
const RankingScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('総合評価');

  const categories = [
    { id: '総合評価', name: '総合評価', icon: '⭐' },
    { id: '口コミ数', name: '口コミ数', icon: '💬' },
    { id: 'コスパ', name: 'コスパ', icon: '💰' },
    { id: '客単価安い', name: '客単価(安)', icon: '💴' },
    { id: '客単価高い', name: '客単価(高)', icon: '💎' },
    { id: '評価上昇率', name: '上昇率', icon: '📈' },
    { id: '料理', name: '料理', icon: '🍳' },
    { id: '接客', name: '接客', icon: '😊' },
    { id: '雰囲気', name: '雰囲気', icon: '✨' },
    { id: '清潔感', name: '清潔感', icon: '🧹' },
    { id: '新着口コミ', name: '新着', icon: '🆕' },
    { id: 'リピート', name: 'リピート', icon: '🔄' },
  ];

  const rankingData = [
    { rank: 1, name: "炭火焼鳥 とり松", value: "4.6", sub: "312件", change: 0 },
    { rank: 2, name: "酒処 なにわ", value: "4.4", sub: "245件", change: 1 },
    { rank: 3, name: "居酒屋 さくら", value: "4.2", sub: "156件", change: 2, isMyShop: true },
    { rank: 4, name: "串カツ 大阪屋", value: "4.1", sub: "198件", change: -1 },
    { rank: 5, name: "居酒屋 月", value: "4.0", sub: "87件", change: -2 },
  ];

  const myRank = rankingData.find(r => r.isMyShop)?.rank || '-';

  return (
    <div className="space-y-4">
      <AdBanner position="top" />

      <h2 className="text-lg font-bold text-gray-800">🏆 ランキング</h2>

      {/* 自店舗の順位 */}
      <div className="gradient-primary rounded-xl p-4 text-white">
        <p className="text-sm opacity-90">「{selectedCategory}」でのあなたの順位</p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-4xl font-bold">{myRank}位</span>
          <span className="text-lg opacity-80">/ 24店中</span>
        </div>
      </div>

      {/* カテゴリ選択 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">ランキングカテゴリ</h3>
        <div className="grid grid-cols-4 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-2 rounded-lg text-center transition ${
                selectedCategory === cat.id
                  ? 'bg-orange-100 border-2 border-orange-400'
                  : 'bg-gray-50 border-2 border-transparent'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <p className="text-xs mt-1 text-gray-700 leading-tight">{cat.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ランキング一覧 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">{selectedCategory}ランキング</h3>
        <div className="space-y-2">
          {rankingData.map((shop) => (
            <div
              key={shop.rank}
              className={`flex items-center gap-3 p-3 rounded-lg ${shop.isMyShop ? 'bg-orange-50 border-2 border-orange-300' : 'bg-gray-50'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                ${shop.rank === 1 ? 'bg-yellow-400 text-white' :
                  shop.rank === 2 ? 'bg-gray-300 text-white' :
                  shop.rank === 3 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {shop.rank}
              </div>
              <div className="flex-1">
                <p className={`font-medium text-sm ${shop.isMyShop ? 'text-orange-600' : 'text-gray-800'}`}>
                  {shop.name}
                  {shop.isMyShop && <span className="ml-1 text-xs bg-orange-200 px-1 rounded">あなた</span>}
                </p>
                <p className="text-xs text-gray-500">{shop.sub}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">{shop.value}</p>
                <div className="text-xs">
                  {shop.change > 0 && <span className="text-green-500">↑{shop.change}</span>}
                  {shop.change < 0 && <span className="text-red-500">↓{Math.abs(shop.change)}</span>}
                  {shop.change === 0 && <span className="text-gray-400">-</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AdBanner position="bottom" />
    </div>
  );
};

// 課題分析画面
const AnalysisScreen = () => {
  const [activeTab, setActiveTab] = useState('issues');

  const issues = [
    {
      category: "待ち時間",
      type: "negative",
      count: 12,
      summary: "「待ち時間が長い」という声が増加",
      solutions: [
        { title: "予約システム導入", effort: "中", impact: "高" },
        { title: "ピーク時間帯の増員", effort: "高", impact: "高" },
        { title: "待ち時間の案内改善", effort: "低", impact: "中" },
      ]
    },
    {
      category: "価格・コスパ",
      type: "negative",
      count: 8,
      summary: "「価格が高め」という意見",
      solutions: [
        { title: "ハッピーアワー導入", effort: "低", impact: "高" },
        { title: "お得なセット作成", effort: "低", impact: "中" },
      ]
    },
    {
      category: "料理の味",
      type: "positive",
      count: 45,
      summary: "「料理が美味しい」と高評価！",
      solutions: [
        { title: "SNSで人気メニュー発信", effort: "低", impact: "高" },
      ]
    },
  ];

  const comparison = [
    { category: "総合評価", diff: "+0.2", status: "win" },
    { category: "料理の味", diff: "+0.4", status: "win" },
    { category: "接客", diff: "+0.4", status: "win" },
    { category: "価格満足度", diff: "-0.3", status: "lose" },
    { category: "待ち時間", diff: "-0.5", status: "lose" },
  ];

  return (
    <div className="space-y-4">
      <AdBanner position="top" />

      <h2 className="text-lg font-bold text-gray-800">🔍 課題分析 & 対策</h2>

      {/* タブ */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('issues')}
          className={`flex-1 py-2 rounded-lg font-medium text-sm transition ${
            activeTab === 'issues' ? 'gradient-primary text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          課題と対策
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`flex-1 py-2 rounded-lg font-medium text-sm transition ${
            activeTab === 'compare' ? 'gradient-primary text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          競合比較
        </button>
      </div>

      {activeTab === 'issues' && (
        <>
          {issues.map((issue, idx) => (
            <div key={idx} className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ${
              issue.type === 'negative' ? 'border-red-400' : 'border-green-400'
            }`}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      issue.type === 'negative' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {issue.type === 'negative' ? '要改善' : '強み'}
                    </span>
                    <span className="font-semibold text-gray-800">{issue.category}</span>
                  </div>
                  <span className="text-sm text-gray-500">{issue.count}件</span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{issue.summary}</p>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500">💡 対策案</p>
                  {issue.solutions.map((sol, i) => (
                    <div key={i} className="bg-amber-50 rounded-lg p-2 border border-amber-200 flex items-center justify-between">
                      <span className="text-sm text-gray-800">{sol.title}</span>
                      <div className="flex gap-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          sol.effort === '低' ? 'bg-green-100 text-green-700' : sol.effort === '中' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          工数:{sol.effort}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">効果:{sol.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {activeTab === 'compare' && (
        <>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">競合店との比較</h3>
            <div className="space-y-2">
              {comparison.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-600">{item.category}</span>
                  <span className={`font-medium ${
                    item.status === 'win' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.diff}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-50 rounded-xl p-3 text-center border border-green-200">
              <p className="text-2xl font-bold text-green-600">3</p>
              <p className="text-xs text-gray-500">勝ち</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center border border-red-200">
              <p className="text-2xl font-bold text-red-500">2</p>
              <p className="text-xs text-gray-500">負け</p>
            </div>
          </div>
        </>
      )}

      <AdBanner position="bottom" />
    </div>
  );
};

// アカウント画面
const ProfileScreen = ({ onLogout }) => (
  <div className="space-y-4">
    <AdBanner position="top" />

    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
          <span className="text-white font-bold">さ</span>
        </div>
        <div>
          <h2 className="font-bold text-gray-800">居酒屋 さくら</h2>
          <p className="text-sm text-gray-500">梅田駅周辺</p>
        </div>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between py-2 border-b"><span className="text-gray-500">オーナー</span><span className="font-medium">山田 太郎</span></div>
        <div className="flex justify-between py-2 border-b"><span className="text-gray-500">メール</span><span className="font-medium">yamada@example.com</span></div>
        <div className="flex justify-between py-2 border-b"><span className="text-gray-500">電話</span><span className="font-medium">06-1234-5678</span></div>
        <div className="flex justify-between py-2 border-b"><span className="text-gray-500">業態</span><span className="font-medium">居酒屋</span></div>
      </div>
      <button onClick={onLogout} className="w-full mt-6 py-3 border border-red-300 text-red-500 rounded-lg font-medium">
        ログアウト
      </button>
    </div>

    <AdBanner position="bottom" />
  </div>
);

// ========== メインアプリ ==========
const App = () => {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [activeTab, setActiveTab] = useState('home');

  if (currentScreen === 'login') {
    return (
      <LoginScreen
        onLogin={() => setCurrentScreen('main')}
        onRegister={() => setCurrentScreen('register')}
      />
    );
  }

  if (currentScreen === 'register') {
    return (
      <RegisterScreen
        onRegister={() => setCurrentScreen('main')}
        onBack={() => setCurrentScreen('login')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-4 max-w-lg mx-auto">
        {activeTab === 'home' && <Dashboard />}
        {activeTab === 'ranking' && <RankingScreen />}
        {activeTab === 'analysis' && <AnalysisScreen />}
        {activeTab === 'profile' && <ProfileScreen onLogout={() => setCurrentScreen('login')} />}
      </div>

      {/* ボトムナビ */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="flex justify-around max-w-lg mx-auto">
          {[
            { id: 'home', icon: <Icons.Home />, label: 'ホーム' },
            { id: 'ranking', icon: <Icons.Trophy />, label: 'ランキング' },
            { id: 'analysis', icon: <Icons.LightBulb />, label: '課題分析' },
            { id: 'profile', icon: <Icons.User />, label: 'アカウント' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-3 px-4 ${
                activeTab === tab.id ? 'text-orange-500' : 'text-gray-400'
              }`}
            >
              {tab.icon}
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// レンダリング
ReactDOM.createRoot(document.getElementById('app')).render(<App />);
