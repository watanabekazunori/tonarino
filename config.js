// =============================================
// TONARINO 設定ファイル
// =============================================

// ⚠️ 本番環境では環境変数を使用してください
// Vercelの場合: Settings > Environment Variables で設定

const CONFIG = {
  // Supabase
  SUPABASE_URL: 'YOUR_SUPABASE_URL',
  SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY',

  // Google Maps Platform
  GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY',

  // Gemini API (AI分析用) - 未設定の場合はデモモードで動作
  GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY',

  // アプリ設定
  APP_NAME: 'TONARINO',
  DEFAULT_RADIUS_KM: 2, // 競合検索の半径（km）
  DEFAULT_AREA_TYPE: 'radius', // 'station' or 'radius'
};

// グローバルに公開
window.CONFIG = CONFIG;
