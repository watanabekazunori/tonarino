import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeReviews(
  storeName: string,
  reviews: Array<{ text: string; rating: number }>
) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const reviewTexts = reviews
    .map((r) => `[${r.rating}星] ${r.text}`)
    .join("\n");

  const prompt = `あなたは飲食店の口コミ分析の専門家です。以下は「${storeName}」の口コミです。

口コミ:
${reviewTexts}

以下のカテゴリごとに評価をJSON形式で返してください:
- 接客 (service)
- 価格 (price)
- 雰囲気 (atmosphere)
- 料理 (food)
- 立地 (location)

各カテゴリについて:
- score: "good"(○), "average"(△), "poor"(×) のいずれか
- summary: 20文字以内の要約

以下のJSON形式で返してください（他のテキストは不要）:
[
  {"category": "接客", "score": "good", "summary": "丁寧で好印象"},
  {"category": "価格", "score": "average", "summary": "普通の価格帯"},
  {"category": "雰囲気", "score": "good", "summary": "落ち着いた空間"},
  {"category": "料理", "score": "good", "summary": "味に定評あり"},
  {"category": "立地", "score": "average", "summary": "駅から少し遠い"}
]`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  return [
    { category: "接客", score: "average", summary: "データ不足" },
    { category: "価格", score: "average", summary: "データ不足" },
    { category: "雰囲気", score: "average", summary: "データ不足" },
    { category: "料理", score: "average", summary: "データ不足" },
    { category: "立地", score: "average", summary: "データ不足" },
  ];
}

export async function generateComparison(
  myStore: { name: string; reviews: string },
  competitors: Array<{ name: string; reviews: string }>
) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const competitorTexts = competitors
    .map((c) => `【${c.name}】\n${c.reviews}`)
    .join("\n\n");

  const prompt = `あなたは飲食店コンサルタントです。以下の店舗の口コミを比較分析してください。

【自店: ${myStore.name}】
${myStore.reviews}

【競合店舗】
${competitorTexts}

以下の2つを日本語で簡潔に生成してください:

1. 競合との差分（200文字以内）: 「あなたの店は〜が強い」「A店は〜の評判が良い」のように具体的に
2. 改善提案を3つ（各50文字以内）: 口コミから導出した具体的なアクション

以下のJSON形式で返してください（他のテキストは不要）:
{
  "comparison": "差分テキスト",
  "suggestions": ["提案1", "提案2", "提案3"]
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  return {
    comparison:
      "分析データが不足しています。口コミが増えると、より詳細な分析が可能になります。",
    suggestions: [
      "口コミへの返信を増やしましょう",
      "SNSでの情報発信を強化しましょう",
      "リピーター向けの特典を検討しましょう",
    ],
  };
}
