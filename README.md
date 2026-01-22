# TONARINO（トナリノ）

飲食店オーナー向け競合分析・人気度把握Webアプリ

> 隣のお店、気になりませんか？

## 🚀 セットアップ手順

### 1. APIキーの設定

`config.js` を開いて、各APIキーを設定してください：

```javascript
const CONFIG = {
  // Supabase（認証・データベース）
  SUPABASE_URL: 'https://xxxxx.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',

  // Google Maps Platform（店舗検索・競合分析）
  GOOGLE_MAPS_API_KEY: 'AIzaSy...',

  // OpenAI（AI課題分析）
  OPENAI_API_KEY: 'sk-...',
};
```

### 2. Supabaseセットアップ

1. [Supabase](https://supabase.com) でプロジェクトを作成
2. Settings > API から URL と anon key をコピー
3. SQL Editor で `supabase-setup.sql` を実行
4. Authentication > Email を有効化

### 3. Google Maps API セットアップ

1. [Google Cloud Console](https://console.cloud.google.com) でプロジェクト作成
2. 以下のAPIを有効化：
   - Places API
   - Maps JavaScript API
   - Geocoding API
3. APIキーを作成し、config.js に設定

### 4. OpenAI API セットアップ（任意）

1. [OpenAI Platform](https://platform.openai.com) でAPIキーを作成
2. config.js に設定

※ OpenAI APIが未設定でもデモデータで動作します

## 📁 ファイル構成

```
tonarino/
├── index.html        # メインHTML
├── app.js            # Reactアプリ本体
├── config.js         # 設定ファイル（APIキー）
├── db.js             # Supabaseデータベース連携
├── maps.js           # Google Maps API連携
├── ai.js             # OpenAI API連携（AI分析）
├── supabase-setup.sql# データベーススキーマ
├── vercel.json       # Vercel設定
├── package.json      # プロジェクト設定
└── README.md         # このファイル
```

## 🎨 機能

### 実装済み
- ✅ ユーザー認証（ログイン/新規登録/ログアウト）
- ✅ 店舗登録（Google Places検索対応）
- ✅ ダッシュボード（評価・口コミ数・ランキング表示）
- ✅ 競合店自動検出（2km圏内）
- ✅ エリア平均との比較
- ✅ 12カテゴリのランキング
- ✅ AI課題分析・対策提案
- ✅ 口コミ感情分析
- ✅ デモモード（API未設定時）
- ✅ 広告スペース

### ランキングカテゴリ
1. 総合評価
2. 口コミ数
3. コスパ
4. 客単価（安い）
5. 客単価（高い）
6. 評価上昇率
7. 料理の味
8. 接客
9. 雰囲気
10. 清潔感
11. 新着口コミ
12. リピート

## 🚀 デプロイ方法

### Vercelでデプロイ

1. [Vercel](https://vercel.com) にログイン
2. 「New Project」をクリック
3. GitHubリポジトリを接続、またはフォルダをアップロード
4. 「Deploy」をクリック

### ローカルで確認

```bash
npx serve .
```

## 📺 広告スペース

各画面の上部・下部に広告バナースペースを配置済み
- サイズ: 320×50 / 320×100 対応

## 🛠 技術スタック

- React 18 (CDN)
- Tailwind CSS (CDN)
- Supabase (認証・PostgreSQL)
- Google Maps Platform API
- OpenAI API (GPT-3.5)
- 静的HTML/JS（サーバー不要）

## 📱 対応デバイス

- モバイルファースト設計
- iOS Safari対応（セーフエリア対応）
- Android Chrome対応
- PC ブラウザ対応

## ⚠️ 注意事項

- Google Maps Platform APIは従量課金制です
- OpenAI APIも従量課金制です
- 本番環境ではAPIキーを環境変数で管理することを推奨

## 📄 ライセンス

© 2025 TONARINO
