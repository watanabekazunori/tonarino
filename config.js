// =============================================
// TONARINO 設定ファイル
// =============================================

// ⚠️ セキュリティ対策:
// - Google APIキー: Google Cloud ConsoleでHTTPリファラー制限を設定
// - Supabase anon key: RLSで保護（公開前提のキー）

const CONFIG = {
  // Supabase
  SUPABASE_URL: 'https://ixqewkutfeagndlgndmw.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cWV3a3V0ZmVhZ25kbGduZG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMDM1MjUsImV4cCI6MjA4NDU3OTUyNX0.exhUlm_sEL_hBSWv4TkpTe-EwzKVLvrOTKWcgxmN07M',

  // Google Maps Platform（※ Google Cloud ConsoleでHTTPリファラー制限を設定すること）
  GOOGLE_MAPS_API_KEY: 'AIzaSyAugDizlHfCowPpO1Wddm_lP715QO8u4xs',

  // Gemini API (AI分析用)
  GEMINI_API_KEY: 'AIzaSyDfiR06o5R2dXmDcMtjCc7pJscv6Z5xBxQ',

  // アプリ設定
  APP_NAME: 'TONARINO',
  DEFAULT_RADIUS_KM: 2, // 競合検索の半径（km）
  DEFAULT_AREA_TYPE: 'radius', // 'station' or 'radius'
};

// グローバルに公開
window.CONFIG = CONFIG;
