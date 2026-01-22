-- =============================================
-- TONARINO データベース設計
-- Supabaseで実行するSQL
-- =============================================

-- 1. ユーザー（店舗オーナー）テーブル
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- Supabase Authを使う場合は不要
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 店舗情報テーブル
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

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

-- 3. 口コミスナップショット（定期取得データ）
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

-- 4. ランキングデータ
CREATE TABLE rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,

  -- ランキングカテゴリ
  category VARCHAR(50) NOT NULL, -- '総合評価', '口コミ数', 'コスパ' 等

  -- 順位
  rank INTEGER NOT NULL,
  total_shops INTEGER NOT NULL, -- エリア内の総店舗数

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

-- 5. 課題・強み分析
CREATE TABLE analysis_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,

  -- 課題/強み
  issue_type VARCHAR(20) NOT NULL, -- 'positive', 'negative'
  category VARCHAR(50) NOT NULL, -- '待ち時間', '価格', '料理の味' 等

  -- 詳細
  summary TEXT,
  mention_count INTEGER, -- 言及件数

  -- 対策案（JSON配列）
  solutions JSONB,

  -- 分析日時
  analysis_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 競合店データ
CREATE TABLE competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE, -- 自店舗

  -- 競合店情報
  competitor_name VARCHAR(255) NOT NULL,
  competitor_place_id VARCHAR(255),
  competitor_rating DECIMAL(2, 1),
  competitor_review_count INTEGER,

  -- 距離
  distance_meters INTEGER,

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

-- =============================================
-- Row Level Security (RLS) - Supabase用
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のデータのみアクセス可能
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own shops" ON shops
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own reviews" ON review_snapshots
  FOR SELECT USING (
    shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can view own rankings" ON rankings
  FOR SELECT USING (
    shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can view own analysis" ON analysis_issues
  FOR SELECT USING (
    shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can view own competitors" ON competitors
  FOR SELECT USING (
    shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid())
  );
