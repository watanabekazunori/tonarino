// =============================================
// TONARINO - Supabase データベース連携
// =============================================

let supabase = null;

// Supabaseクライアント初期化
function initSupabase() {
  if (!window.CONFIG || !window.CONFIG.SUPABASE_URL || window.CONFIG.SUPABASE_URL === 'YOUR_SUPABASE_URL') {
    console.warn('Supabase設定が未完了です。config.jsを設定してください。');
    return null;
  }

  if (typeof window.supabase !== 'undefined') {
    supabase = window.supabase.createClient(
      window.CONFIG.SUPABASE_URL,
      window.CONFIG.SUPABASE_ANON_KEY
    );
    console.log('Supabase initialized');
  }
  return supabase;
}

// =============================================
// 認証機能
// =============================================

const Auth = {
  // 新規登録
  async signUp(email, password) {
    if (!supabase) throw new Error('Supabase未初期化');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // ログイン
  async signIn(email, password) {
    if (!supabase) throw new Error('Supabase未初期化');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // ログアウト
  async signOut() {
    if (!supabase) throw new Error('Supabase未初期化');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // 現在のユーザー取得
  async getCurrentUser() {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // セッション監視
  onAuthStateChange(callback) {
    if (!supabase) return null;
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },
};

// =============================================
// 店舗管理
// =============================================

const ShopService = {
  // 店舗登録
  async createShop(shopData) {
    if (!supabase) throw new Error('Supabase未初期化');
    const user = await Auth.getCurrentUser();
    if (!user) throw new Error('ログインが必要です');

    const { data, error } = await supabase
      .from('shops')
      .insert({
        user_id: user.id,
        shop_name: shopData.shopName,
        owner_name: shopData.ownerName,
        email: shopData.email,
        phone: shopData.phone,
        address: shopData.address,
        station: shopData.station || null,
        category: shopData.category,
        latitude: shopData.latitude || null,
        longitude: shopData.longitude || null,
        google_place_id: shopData.googlePlaceId || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 自店舗取得
  async getMyShop() {
    if (!supabase) return null;
    const user = await Auth.getCurrentUser();
    if (!user) return null;

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
    if (!supabase) throw new Error('Supabase未初期化');
    const { data, error } = await supabase
      .from('shops')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
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
    if (!supabase) return null;
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

  // スナップショット保存
  async saveSnapshot(shopId, snapshotData) {
    if (!supabase) throw new Error('Supabase未初期化');
    const { data, error } = await supabase
      .from('review_snapshots')
      .insert({
        shop_id: shopId,
        rating: snapshotData.rating,
        review_count: snapshotData.reviewCount,
        positive_ratio: snapshotData.positiveRatio,
        negative_ratio: snapshotData.negativeRatio,
        neutral_ratio: snapshotData.neutralRatio,
        snapshot_date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 口コミ推移取得（過去N日）
  async getReviewHistory(shopId, days = 30) {
    if (!supabase) return [];
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const { data, error } = await supabase
      .from('review_snapshots')
      .select('*')
      .eq('shop_id', shopId)
      .gte('snapshot_date', fromDate.toISOString().split('T')[0])
      .order('snapshot_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // 口コミ生データ保存
  async saveReviews(shopId, reviews) {
    if (!supabase) throw new Error('Supabase未初期化');
    const reviewsToInsert = reviews.map(r => ({
      shop_id: shopId,
      author_name: r.authorName,
      rating: r.rating,
      text: r.text,
      review_time: r.time,
      google_review_id: r.googleReviewId || null,
    }));

    const { data, error } = await supabase
      .from('reviews')
      .upsert(reviewsToInsert, { onConflict: 'google_review_id' })
      .select();

    if (error) throw error;
    return data;
  },

  // 口コミ取得
  async getReviews(shopId, limit = 50) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('shop_id', shopId)
      .order('review_time', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },
};

// =============================================
// ランキング
// =============================================

const RankingService = {
  // ランキング保存
  async saveRanking(shopId, rankingData) {
    if (!supabase) throw new Error('Supabase未初期化');
    const { data, error } = await supabase
      .from('rankings')
      .insert({
        shop_id: shopId,
        category: rankingData.category,
        rank: rankingData.rank,
        total_shops: rankingData.totalShops,
        value: rankingData.value,
        previous_rank: rankingData.previousRank,
        rank_change: rankingData.rankChange,
        area_type: rankingData.areaType,
        area_name: rankingData.areaName,
        ranking_date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // カテゴリ別最新ランキング取得
  async getLatestRanking(shopId, category) {
    if (!supabase) return null;
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
  async getAllLatestRankings(shopId) {
    if (!supabase) return {};
    const categories = [
      '総合評価', '口コミ数', 'コスパ', '客単価安い', '客単価高い',
      '評価上昇率', '料理', '接客', '雰囲気', '清潔感', '新着口コミ', 'リピート'
    ];

    const rankings = {};
    for (const category of categories) {
      rankings[category] = await this.getLatestRanking(shopId, category);
    }
    return rankings;
  },
};

// =============================================
// 課題分析
// =============================================

const AnalysisService = {
  // 課題保存
  async saveIssue(shopId, issueData) {
    if (!supabase) throw new Error('Supabase未初期化');
    const { data, error } = await supabase
      .from('analysis_issues')
      .insert({
        shop_id: shopId,
        issue_type: issueData.type,
        category: issueData.category,
        summary: issueData.summary,
        mention_count: issueData.mentionCount,
        details: issueData.details,
        solutions: issueData.solutions,
        analysis_date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 最新の課題・強み取得
  async getLatestIssues(shopId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('analysis_issues')
      .select('*')
      .eq('shop_id', shopId)
      .order('analysis_date', { ascending: false })
      .order('mention_count', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};

// =============================================
// 競合店
// =============================================

const CompetitorService = {
  // 競合店保存
  async saveCompetitors(shopId, competitors) {
    if (!supabase) throw new Error('Supabase未初期化');

    // 既存データ削除
    await supabase
      .from('competitors')
      .delete()
      .eq('shop_id', shopId);

    // 新規データ挿入
    const competitorsToInsert = competitors.map(c => ({
      shop_id: shopId,
      competitor_name: c.name,
      competitor_place_id: c.placeId,
      competitor_rating: c.rating,
      competitor_review_count: c.reviewCount,
      competitor_category: c.category,
      distance_meters: c.distanceMeters,
    }));

    const { data, error } = await supabase
      .from('competitors')
      .insert(competitorsToInsert)
      .select();

    if (error) throw error;
    return data;
  },

  // 競合店取得
  async getCompetitors(shopId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('competitors')
      .select('*')
      .eq('shop_id', shopId)
      .order('distance_meters', { ascending: true });

    if (error) throw error;
    return data || [];
  },
};

// =============================================
// エクスポート
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

// 自動初期化
document.addEventListener('DOMContentLoaded', () => {
  initSupabase();
});
