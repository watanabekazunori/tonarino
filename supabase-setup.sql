-- =============================================
-- TONARINO データベース設計
-- Supabaseで実行するSQL
-- =============================================

-- 1. 店舗情報テーブル
-- ※ user_id は Supabase Auth の auth.users.id を参照
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 基本情報
  shop_name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,

  -- 所在地
  address TEXT NOT NULL,
  prefecture VARCHAR(20),
  city VARCHAR(50),
  station VARCHAR(50), -- 最寄り駅
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- 業態
  category VARCHAR(50) NOT NULL, -- 居酒屋, カフェ, ラーメン等

  -- Google Places連携
  google_place_id VARCHAR(255),

  -- メタ情報
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 口コミスナップショット（定期取得データ）
CREATE TABLE review_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,

  -- Google評価データ
  rating DECIMAL(2, 1), -- 4.2 など
  review_count INTEGER,

  -- 分析結果
  positive_ratio DECIMAL(5, 2), -- ポジティブ率 78.5%
  negative_ratio DECIMAL(5, 2), -- ネガティブ率 12.3%
  neutral_ratio DECIMAL(5, 2),  -- 中立率

  -- スナップショット日時
  snapshot_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ランキングデータ
CREATE TABLE rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,

  -- ランキングカテゴリ
  category VARCHAR(50) NOT NULL, -- '総合評価', '口コミ数', 'コスパ' 等

  -- 順位
  rank INTEGER NOT NULL,
  total_shops INTEGER NOT NULL, -- エリア内の総店舗数
  value VARCHAR(50), -- 表示用の値 "4.6", "312件", "¥3,200" など

  -- 前回比較
  previous_rank INTEGER,
  rank_change INTEGER, -- +2, -1 など

  -- 対象エリア
  area_type VARCHAR(20), -- 'station', 'radius'
  area_name VARCHAR(100), -- '梅田駅周辺'

  -- ランキング日時
  ranking_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 課題・強み分析
CREATE TABLE analysis_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,

  -- 課題/強み
  issue_type VARCHAR(20) NOT NULL, -- 'positive', 'negative'
  category VARCHAR(50) NOT NULL, -- '待ち時間', '価格', '料理の味' 等

  -- 詳細
  summary TEXT,
  mention_count INTEGER, -- 言及件数
  details JSONB, -- 詳細分析 ["土日の18-20時に集中", ...]

  -- 対策案（JSON配列）
  solutions JSONB, -- [{"title": "予約システム導入", "effort": "中", "impact": "高", "description": "..."}]

  -- 分析日時
  analysis_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 競合店データ
CREATE TABLE competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE, -- 自店舗

  -- 競合店情報
  competitor_name VARCHAR(255) NOT NULL,
  competitor_place_id VARCHAR(255),
  competitor_rating DECIMAL(2, 1),
  competitor_review_count INTEGER,
  competitor_category VARCHAR(50),

  -- 距離
  distance_meters INTEGER,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 口コミ生データ（AI分析用）
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,

  -- 口コミ内容
  author_name VARCHAR(100),
  rating INTEGER, -- 1-5
  text TEXT,
  review_time TIMESTAMP WITH TIME ZONE,

  -- 感情分析結果
  sentiment VARCHAR(20), -- 'positive', 'negative', 'neutral'
  sentiment_score DECIMAL(3, 2), -- -1.0 ~ 1.0
  categories JSONB, -- ["料理", "接客"] など該当カテゴリ

  -- Google Places
  google_review_id VARCHAR(255),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- インデックス
-- =============================================

CREATE INDEX idx_shops_user_id ON shops(user_id);
CREATE INDEX idx_shops_station ON shops(station);
CREATE INDEX idx_shops_category ON shops(category);
CREATE INDEX idx_review_snapshots_shop_date ON review_snapshots(shop_id, snapshot_date);
CREATE INDEX idx_rankings_shop_category ON rankings(shop_id, category, ranking_date);
CREATE INDEX idx_analysis_issues_shop ON analysis_issues(shop_id, analysis_date);
CREATE INDEX idx_reviews_shop ON reviews(shop_id);
CREATE INDEX idx_reviews_sentiment ON reviews(shop_id, sentiment);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分の店舗データのみアクセス可能
CREATE POLICY "Users can manage own shops" ON shops
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own reviews" ON review_snapshots
  FOR ALL USING (
    shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can view own rankings" ON rankings
  FOR ALL USING (
    shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can view own analysis" ON analysis_issues
  FOR ALL USING (
    shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can view own competitors" ON competitors
  FOR ALL USING (
    shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can view own review data" ON reviews
  FOR ALL USING (
    shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid())
  );
