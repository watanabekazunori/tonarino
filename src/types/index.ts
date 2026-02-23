export interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
  business_status?: string;
  opening_hours?: {
    open_now?: boolean;
  };
  photos?: Array<{
    photo_reference: string;
  }>;
}

export interface Competitor {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  lat: number;
  lng: number;
  address: string;
  types: string[];
  distance?: number;
  genre?: string;
  subGenre?: string | null;
  isChain?: boolean;
  chainName?: string | null;
  relevanceScore?: number;
  genreLabel?: string;
}

export interface StoreGenreInfo {
  mainGenre: string;
  subGenre: string | null;
  label: string;
  isChain: boolean;
  chainName: string | null;
}

export interface SearchLog {
  id?: string;
  searched_at?: string;
  query: string;
  place_id: string;
  place_name: string;
  lat: number;
  lng: number;
  area: string;
  ip?: string;
  user_agent?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  auth_provider: string;
  store_name: string;
  place_id: string;
  business_type: string;
  challenge: string;
  challenge_other?: string;
  phone: string;
  created_at: string;
}

export interface ReviewCategory {
  category: string;
  score: "good" | "average" | "poor";
  summary: string;
}

export interface Report {
  id: string;
  user_id: string;
  place_id: string;
  competitors_json: Competitor[];
  review_summary: {
    my_store: ReviewCategory[];
    competitors: Array<{
      name: string;
      place_id: string;
      categories: ReviewCategory[];
    }>;
  };
  comparison_text: string;
  suggestions: string[];
  created_at: string;
}

// ========== Report V2 Types ==========

export interface AxisScore {
  axis: "price" | "taste" | "service" | "comfort";
  label: string;
  score: number;
  summary: string;
}

export interface AxisComparison {
  axis: string;
  label: string;
  commentary: string;
}

export interface ReviewExcerpt {
  text: string;
  rating: number;
}

export interface StoreAnalysis {
  name: string;
  place_id: string;
  reviewCount: number;
  rating: number;
  scores: AxisScore[];
}

export interface ReportV2Data {
  version: 2;
  my_store: StoreAnalysis;
  competitors: StoreAnalysis[];
  axis_comparisons: AxisComparison[];
  good_reviews: ReviewExcerpt[];
  bad_reviews: ReviewExcerpt[];
}

export const BUSINESS_TYPES = [
  "居酒屋",
  "カフェ",
  "バー",
  "ラーメン",
  "その他",
] as const;

export const CHALLENGES = [
  "集客・新規客が足りない",
  "リピーターが定着しない",
  "人手不足",
  "SNS・販促のやり方がわからない",
  "原価・コスト管理",
  "口コミ対策ができてない",
  "その他",
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number];
export type Challenge = (typeof CHALLENGES)[number];
