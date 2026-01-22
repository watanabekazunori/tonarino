// =============================================
// TONARINO - Supabase データベース連携
// =============================================

// Supabaseクライアントの初期化
// ※ 実際の値はSupabaseダッシュボードから取得
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Supabaseクライアント（CDNから読み込み想定）
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
let supabase = null;

function initSupabase() {
  if (typeof window !== 'undefined' && window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabase;
}

// =============================================
// 認証機能
// =============================================

const Auth = {
  // 新規登録
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // ログイン
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // ログアウト
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // 現在のユーザー取得
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
};

// =============================================
// 店舗管理
// =============================================

const ShopService = {
  // 店舗登録
  async createShop(shopData) {
    const user = await Auth.getCurrentUser();
    const { data, error } = await supabase
      .from('shops')
      .insert({
        user_id: user.id,
        shop_name: shopData.shopName,
        owner_name: shopData.ownerName,
        email: shopData.email,
        phone: shopData.phone,
        address: shopData.address,
        station: shopData.station,
        category: shopData.category,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 自店舗取得
  async getMyShop() {
    const user = await Auth.getCurrentUser();
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // 店舗情報更新
  async updateShop(shopId, updates) {
    const { data, error } = await supabase
      .from('shops')
      .update(updates)
      .eq('id', shopId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// =============================================
// 口コミ・評価データ
// =============================================

const ReviewService = {
  // 最新の口コミスナップショット取得
  async getLatestSnapshot(shopId) {
    const { data, error } = await supabase
      .from('review_snapshots')
      .select('*')
      .eq('shop_id', shopId)
      .order('snapshot_date', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // 口コミ推移取得（過去30日）
  async getReviewHistory(shopId, days = 30) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const { data, error } = await supabase
      .from('review_snapshots')
      .select('*')
      .eq('shop_id', shopId)
      .gte('snapshot_date', fromDate.toISOString().split('T')[0])
      .order('snapshot_date', { ascending: true });

    if (error) throw error;
    return data;
  },
};

// =============================================
// ランキング
// =============================================

const RankingService = {
  // カテゴリ別ランキング取得
  async getRankingByCategory(shopId, category) {
    const { data, error } = await supabase
      .from('rankings')
      .select('*')
      .eq('shop_id', shopId)
      .eq('category', category)
      .order('ranking_date', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // 全カテゴリのランキング取得
  async getAllRankings(shopId) {
    const categories = [
      '総合評価', '口コミ数', 'コスパ', '客単価安い', '客単価高い',
      '評価上昇率', '料理', '接客', '雰囲気', '清潔感', '新着口コミ', 'リピート'
    ];

    const rankings = {};
    for (const category of categories) {
      rankings[category] = await this.getRankingByCategory(shopId, category);
    }
    return rankings;
  },

  // エリア内の全店舗ランキング取得
  async getAreaRanking(areaName, category) {
    const { data, error } = await supabase
      .from('rankings')
      .select(`
        *,
        shops (shop_name, category)
      `)
      .eq('area_name', areaName)
      .eq('category', category)
      .order('rank', { ascending: true });

    if (error) throw error;
    return data;
  },
};

// =============================================
// 課題分析
// =============================================

const AnalysisService = {
  // 最新の課題・強み取得
  async getLatestIssues(shopId) {
    const { data, error } = await supabase
      .from('analysis_issues')
      .select('*')
      .eq('shop_id', shopId)
      .order('analysis_date', { ascending: false })
      .order('mention_count', { ascending: false });

    if (error) throw error;
    return data;
  },

  // 課題タイプ別取得
  async getIssuesByType(shopId, issueType) {
    const { data, error } = await supabase
      .from('analysis_issues')
      .select('*')
      .eq('shop_id', shopId)
      .eq('issue_type', issueType)
      .order('mention_count', { ascending: false });

    if (error) throw error;
    return data;
  },
};

// =============================================
// 競合店
// =============================================

const CompetitorService = {
  // 競合店一覧取得
  async getCompetitors(shopId) {
    const { data, error } = await supabase
      .from('competitors')
      .select('*')
      .eq('shop_id', shopId)
      .order('distance_meters', { ascending: true });

    if (error) throw error;
    return data;
  },
};

// =============================================
// エクスポート（グローバル変数として）
// =============================================

window.TonarinoDB = {
  init: initSupabase,
  Auth,
  ShopService,
  ReviewService,
  RankingService,
  AnalysisService,
  CompetitorService,
};
