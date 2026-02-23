// ジャンル分類・チェーン判定・関連度スコアリング

export interface GenreInfo {
  mainGenre: string;
  subGenre: string | null;
  searchKeywords: string[];
  googleType: string;
  label: string;
  isChain: boolean;
  chainName: string | null;
}

// ========== ラーメンサブジャンル ==========
const RAMEN_SUB_GENRES: {
  pattern: RegExp;
  subGenre: string;
  keywords: string[];
}[] = [
  {
    pattern: /家系|横浜家系/,
    subGenre: "家系",
    keywords: ["家系ラーメン", "家系"],
  },
  {
    pattern: /二郎|ジロウ|じろう|インスパイア/,
    subGenre: "二郎系",
    keywords: ["二郎系ラーメン", "二郎"],
  },
  {
    pattern: /つけ麺|つけめん|つけそば/,
    subGenre: "つけ麺",
    keywords: ["つけ麺"],
  },
  {
    pattern: /豚骨|とんこつ|博多|長浜/,
    subGenre: "豚骨",
    keywords: ["豚骨ラーメン", "豚骨"],
  },
  {
    pattern: /味噌|みそ/,
    subGenre: "味噌",
    keywords: ["味噌ラーメン"],
  },
  {
    pattern: /担々|担担|タンタン/,
    subGenre: "担々麺",
    keywords: ["担々麺"],
  },
  {
    pattern: /油そば|まぜそば|汁なし|油組/,
    subGenre: "油そば・まぜそば",
    keywords: ["油そば", "まぜそば"],
  },
  {
    pattern: /中華そば|支那そば/,
    subGenre: "中華そば",
    keywords: ["中華そば", "ラーメン"],
  },
  {
    pattern: /煮干|にぼし/,
    subGenre: "煮干し",
    keywords: ["煮干しラーメン", "ラーメン"],
  },
  {
    pattern: /鶏白湯|鳥白湯|とりぱいたん|鶏パイタン/,
    subGenre: "鶏白湯",
    keywords: ["鶏白湯ラーメン", "ラーメン"],
  },
  {
    pattern: /塩ラーメン|しおらーめん/,
    subGenre: "塩",
    keywords: ["塩ラーメン", "ラーメン"],
  },
];

// ========== メインジャンルパターン ==========
const MAIN_GENRES: {
  pattern: RegExp;
  mainGenre: string;
  keyword: string;
  type: string;
  label: string;
}[] = [
  {
    pattern: /ラーメン|らーめん|拉麺|家系|二郎|つけ麺|つけめん|中華そば|油そば|まぜそば|油組/,
    mainGenre: "ラーメン",
    keyword: "ラーメン",
    type: "restaurant",
    label: "ラーメン店",
  },
  {
    pattern: /そば|蕎麦|うどん/,
    mainGenre: "そば・うどん",
    keyword: "そば うどん",
    type: "restaurant",
    label: "そば・うどん店",
  },
  {
    pattern: /寿司|鮨|すし/,
    mainGenre: "寿司",
    keyword: "寿司",
    type: "restaurant",
    label: "寿司店",
  },
  {
    pattern: /焼肉|焼き肉|ホルモン|牛タン/,
    mainGenre: "焼肉",
    keyword: "焼肉",
    type: "restaurant",
    label: "焼肉店",
  },
  {
    pattern: /カフェ|cafe|珈琲|コーヒー|喫茶/i,
    mainGenre: "カフェ",
    keyword: "カフェ",
    type: "cafe",
    label: "カフェ",
  },
  {
    pattern: /バー|bar|BAR|スナック/,
    mainGenre: "バー",
    keyword: "バー",
    type: "bar",
    label: "バー",
  },
  {
    pattern: /居酒屋|酒場|酒処/,
    mainGenre: "居酒屋",
    keyword: "居酒屋",
    type: "restaurant",
    label: "居酒屋",
  },
  {
    pattern: /カレー|curry/i,
    mainGenre: "カレー",
    keyword: "カレー",
    type: "restaurant",
    label: "カレー店",
  },
  {
    pattern: /パン|ベーカリー|bakery/i,
    mainGenre: "ベーカリー",
    keyword: "パン ベーカリー",
    type: "bakery",
    label: "ベーカリー",
  },
  {
    pattern: /イタリアン|パスタ|ピザ|ピッツァ/,
    mainGenre: "イタリアン",
    keyword: "イタリアン",
    type: "restaurant",
    label: "イタリアン",
  },
  {
    pattern: /中華|中国料理/,
    mainGenre: "中華",
    keyword: "中華料理",
    type: "restaurant",
    label: "中華料理店",
  },
  {
    pattern: /フレンチ|フランス料理|ビストロ/,
    mainGenre: "フレンチ",
    keyword: "フレンチ",
    type: "restaurant",
    label: "フレンチ",
  },
  {
    pattern: /天ぷら|天麩羅/,
    mainGenre: "天ぷら",
    keyword: "天ぷら",
    type: "restaurant",
    label: "天ぷら店",
  },
  {
    pattern: /とんかつ|トンカツ|豚カツ|カツ/,
    mainGenre: "とんかつ",
    keyword: "とんかつ",
    type: "restaurant",
    label: "とんかつ店",
  },
  {
    pattern: /焼き鳥|焼鳥|やきとり/,
    mainGenre: "焼き鳥",
    keyword: "焼き鳥",
    type: "restaurant",
    label: "焼き鳥店",
  },
  {
    pattern: /ハンバーガー|バーガー/,
    mainGenre: "ハンバーガー",
    keyword: "ハンバーガー",
    type: "restaurant",
    label: "ハンバーガー店",
  },
  {
    pattern: /タイ料理|タイ/,
    mainGenre: "タイ料理",
    keyword: "タイ料理",
    type: "restaurant",
    label: "タイ料理店",
  },
  {
    pattern: /インド|ナン/,
    mainGenre: "インド料理",
    keyword: "インド料理",
    type: "restaurant",
    label: "インド料理店",
  },
  {
    pattern: /韓国|キムチ|サムギョプサル/,
    mainGenre: "韓国料理",
    keyword: "韓国料理",
    type: "restaurant",
    label: "韓国料理店",
  },
];

// ========== チェーン店リスト ==========
const KNOWN_CHAINS: { pattern: RegExp; chainName: string }[] = [
  // ラーメンチェーン
  { pattern: /一蘭/, chainName: "一蘭" },
  { pattern: /一風堂/, chainName: "一風堂" },
  { pattern: /天下一品/, chainName: "天下一品" },
  { pattern: /日高屋/, chainName: "日高屋" },
  { pattern: /幸楽苑/, chainName: "幸楽苑" },
  { pattern: /来来亭/, chainName: "来来亭" },
  { pattern: /丸源/, chainName: "丸源ラーメン" },
  { pattern: /スガキヤ|sugakiya/i, chainName: "スガキヤ" },
  { pattern: /魁力屋/, chainName: "魁力屋" },
  { pattern: /山岡家/, chainName: "山岡家" },
  { pattern: /町田商店/, chainName: "町田商店" },
  { pattern: /横浜家系ラーメン壱角家/, chainName: "壱角家" },
  { pattern: /壱角家/, chainName: "壱角家" },
  { pattern: /らあめん花月嵐|花月嵐/, chainName: "花月嵐" },
  { pattern: /餃子の王将/, chainName: "餃子の王将" },
  { pattern: /大阪王将/, chainName: "大阪王将" },
  { pattern: /リンガーハット/, chainName: "リンガーハット" },
  { pattern: /バーミヤン/, chainName: "バーミヤン" },
  // カフェチェーン
  { pattern: /スターバックス|starbucks/i, chainName: "スターバックス" },
  { pattern: /ドトール/, chainName: "ドトール" },
  { pattern: /コメダ/, chainName: "コメダ珈琲" },
  { pattern: /タリーズ|tully/i, chainName: "タリーズ" },
  { pattern: /サンマルク/, chainName: "サンマルクカフェ" },
  { pattern: /ベローチェ/, chainName: "ベローチェ" },
  // ファストフード
  { pattern: /マクドナルド|mcdonald/i, chainName: "マクドナルド" },
  { pattern: /モスバーガー/, chainName: "モスバーガー" },
  { pattern: /ケンタッキー|KFC/i, chainName: "ケンタッキー" },
  // 牛丼・定食チェーン
  { pattern: /吉野家/, chainName: "吉野家" },
  { pattern: /松屋/, chainName: "松屋" },
  { pattern: /すき家/, chainName: "すき家" },
  { pattern: /やよい軒/, chainName: "やよい軒" },
  { pattern: /大戸屋/, chainName: "大戸屋" },
  // 回転寿司チェーン
  { pattern: /スシロー|sushiro/i, chainName: "スシロー" },
  { pattern: /くら寿司/, chainName: "くら寿司" },
  { pattern: /はま寿司/, chainName: "はま寿司" },
  { pattern: /かっぱ寿司/, chainName: "かっぱ寿司" },
  // 焼肉チェーン
  { pattern: /牛角/, chainName: "牛角" },
  { pattern: /焼肉きんぐ/, chainName: "焼肉きんぐ" },
  { pattern: /安楽亭/, chainName: "安楽亭" },
  // 居酒屋チェーン
  { pattern: /鳥貴族/, chainName: "鳥貴族" },
  { pattern: /磯丸水産/, chainName: "磯丸水産" },
  { pattern: /串カツ田中/, chainName: "串カツ田中" },
  { pattern: /塚田農場/, chainName: "塚田農場" },
  { pattern: /和民|ワタミ/, chainName: "ワタミ" },
  { pattern: /白木屋/, chainName: "白木屋" },
  { pattern: /笑笑/, chainName: "笑笑" },
  // カレーチェーン
  { pattern: /CoCo壱番屋|ココイチ|coco壱/i, chainName: "CoCo壱番屋" },
  // うどんチェーン
  { pattern: /丸亀製麺/, chainName: "丸亀製麺" },
  { pattern: /はなまるうどん/, chainName: "はなまるうどん" },
];

// チェーン店の構造パターン
const CHAIN_STRUCTURAL_PATTERNS = [
  /\s+.{2,8}店$/, // 「〇〇 △△店」パターン
  /\d+号店/, // 「N号店」パターン
];

// ========== 分類関数 ==========

export function classifyStore(
  name: string,
  types?: string[]
): GenreInfo {
  const chain = detectChain(name);

  // 1. メインジャンル判定
  let mainGenre = "飲食店";
  let keyword = "";
  let googleType = "restaurant";
  let label = "飲食店";
  let subGenre: string | null = null;
  let searchKeywords: string[] = [];

  for (const g of MAIN_GENRES) {
    if (g.pattern.test(name)) {
      mainGenre = g.mainGenre;
      keyword = g.keyword;
      googleType = g.type;
      label = g.label;
      searchKeywords = [g.keyword];
      break;
    }
  }

  // 2. types配列からのフォールバック
  if (mainGenre === "飲食店" && types && types.length > 0) {
    if (types.includes("cafe")) {
      mainGenre = "カフェ";
      keyword = "カフェ";
      googleType = "cafe";
      label = "カフェ";
      searchKeywords = ["カフェ"];
    } else if (types.includes("bar")) {
      mainGenre = "バー";
      keyword = "バー";
      googleType = "bar";
      label = "バー";
      searchKeywords = ["バー"];
    } else if (types.includes("bakery")) {
      mainGenre = "ベーカリー";
      keyword = "パン ベーカリー";
      googleType = "bakery";
      label = "ベーカリー";
      searchKeywords = ["パン ベーカリー"];
    }
  }

  // 3. ラーメンの場合、サブジャンル判定
  if (mainGenre === "ラーメン") {
    for (const sub of RAMEN_SUB_GENRES) {
      if (sub.pattern.test(name)) {
        subGenre = sub.subGenre;
        searchKeywords = sub.keywords;
        label = `${sub.subGenre}ラーメン店`;
        break;
      }
    }
    // サブジャンルが特定できない場合はメインキーワードのみ
    if (!subGenre) {
      searchKeywords = ["ラーメン"];
    }
  }

  return {
    mainGenre,
    subGenre,
    searchKeywords: searchKeywords.length > 0 ? searchKeywords : [keyword || "飲食店"],
    googleType,
    label,
    isChain: chain.isChain,
    chainName: chain.chainName,
  };
}

function detectChain(name: string): {
  isChain: boolean;
  chainName: string | null;
} {
  // 1. 既知チェーン店リストから判定
  for (const c of KNOWN_CHAINS) {
    if (c.pattern.test(name)) {
      return { isChain: true, chainName: c.chainName };
    }
  }

  // 2. 構造パターンから判定（信頼度低め）
  for (const p of CHAIN_STRUCTURAL_PATTERNS) {
    if (p.test(name)) {
      return { isChain: false, chainName: null }; // パターンだけでは確定しない
    }
  }

  return { isChain: false, chainName: null };
}

// ========== 距離計算（Haversine） ==========
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // 地球の半径（メートル）
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ========== 関連度スコア計算 ==========
export function calculateRelevanceScore(
  myStore: GenreInfo,
  competitor: {
    name: string;
    types: string[];
    rating: number;
    user_ratings_total: number;
    distance: number;
  }
): number {
  let score = 0;
  const compGenre = classifyStore(competitor.name, competitor.types);

  // 同メインジャンル: +40点
  if (compGenre.mainGenre === myStore.mainGenre) {
    score += 40;
  }

  // サブジャンル判定
  if (myStore.subGenre && compGenre.subGenre === myStore.subGenre) {
    // 同サブジャンル: +30点
    score += 30;
  } else if (compGenre.mainGenre === myStore.mainGenre && myStore.subGenre) {
    // 同ジャンル異サブ: +15点
    score += 15;
  }

  // チェーン/個人店の一致: +10点
  if (myStore.isChain === compGenre.isChain) {
    score += 10;
  }

  // 距離ボーナス（近い順）
  if (competitor.distance <= 500) {
    score += 10;
  } else if (competitor.distance <= 1000) {
    score += 7;
  } else if (competitor.distance <= 1500) {
    score += 4;
  } else {
    score += 2;
  }

  // レビュー充実度ボーナス
  if (competitor.user_ratings_total >= 20) {
    score += 5;
  } else if (competitor.user_ratings_total >= 5) {
    score += 3;
  }

  return Math.min(score, 100);
}
