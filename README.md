# TONARINO（トナリノ）

飲食店オーナー向け競合分析・人気度把握Webアプリ

> 隣のお店、気になりませんか？

## 🚀 デプロイ方法

### Vercelでデプロイ

1. [Vercel](https://vercel.com) にログイン
2. 「New Project」をクリック
3. このフォルダをアップロード、またはGitHubリポジトリを接続
4. 「Deploy」をクリック

### ローカルで確認

```bash
npx serve .
```

## 📁 ファイル構成

```
tonarino/
├── index.html      # メインHTML
├── app.js          # Reactアプリ本体
├── vercel.json     # Vercel設定
├── package.json    # プロジェクト設定
└── README.md       # このファイル
```

## 🎨 機能

- 📊 様々なランキング（12カテゴリ）
- 🔍 口コミからの課題分析
- 💡 AI対策提案
- 📈 競合比較
- 📱 モバイルファースト設計

## 📺 広告スペース

各画面の上部・下部に広告バナースペースを配置済み
- サイズ: 320×50 / 320×100 対応

## 🛠 技術スタック

- React 18 (CDN)
- Tailwind CSS (CDN)
- 静的HTML/JS（サーバー不要）
