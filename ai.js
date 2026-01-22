// =============================================
// TONARINO - AI分析サービス（Gemini API連携）
// =============================================

const AIService = {
  isInitialized: false,
  apiKey: null,

  // 初期化
  init() {
    if (!window.CONFIG || !window.CONFIG.GEMINI_API_KEY ||
        window.CONFIG.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
      console.warn('Gemini API Key未設定 - デモモードで動作');
      return false;
    }
    this.apiKey = window.CONFIG.GEMINI_API_KEY;
    this.isInitialized = true;
    console.log('AI Service initialized (Gemini)');
    return true;
  },

  // =============================================
  // Gemini API呼び出し共通関数
  // =============================================
  async callGemini(prompt) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('Empty response from Gemini');
    }

    // JSONを抽出
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('No JSON found in response');
  },

  // =============================================
  // 口コミ分析
  // =============================================

  async analyzeReviews(reviews, shopInfo = {}) {
    if (!this.isInitialized) {
      return this.getDemoAnalysis();
    }

    const reviewTexts = reviews.length > 0
      ? reviews.map(r => `[評価${r.rating}] ${r.text}`).join('\n')
      : '（口コミデータなし - サンプル分析を行います）';

    const prompt = `
あなたは飲食店コンサルタントです。以下の口コミを分析して、店舗の課題と強みを抽出してください。

【店舗情報】
店名: ${shopInfo.name || '不明'}
業態: ${shopInfo.category || '飲食店'}

【口コミ一覧】
${reviewTexts}

以下のJSON形式で回答してください（JSONのみ出力）：
{
  "issues": [
    {
      "category": "カテゴリ名（料理/接客/価格/待ち時間/雰囲気/清潔感/その他）",
      "type": "negative",
      "summary": "課題の要約（20文字以内）",
      "mentionCount": 言及数,
      "details": "詳細説明（50文字以内）",
      "solutions": [
        { "title": "対策案1", "effort": "低/中/高", "impact": "低/中/高" }
      ]
    }
  ],
  "strengths": [
    {
      "category": "カテゴリ名",
      "type": "positive",
      "summary": "強みの要約（20文字以内）",
      "mentionCount": 言及数,
      "details": "詳細説明（50文字以内）",
      "recommendations": [
        { "title": "活かし方", "description": "説明" }
      ]
    }
  ],
  "sentiment": {
    "positive": ポジティブな口コミの割合（0-100）,
    "negative": ネガティブな口コミの割合（0-100）,
    "neutral": 中立的な口コミの割合（0-100）
  },
  "summary": "全体的な分析サマリー（100文字以内）"
}
`;

    try {
      return await this.callGemini(prompt);
    } catch (err) {
      console.error('AI analysis error:', err);
      return this.getDemoAnalysis();
    }
  },

  // =============================================
  // 競合比較分析
  // =============================================

  async analyzeCompetitors(myShop, competitors) {
    if (!this.isInitialized) {
      return this.getDemoCompetitorAnalysis();
    }

    const competitorInfo = competitors.slice(0, 5).map(c =>
      `- ${c.name}: 評価${c.rating}, 口コミ${c.reviewCount}件, 距離${c.distanceMeters}m`
    ).join('\n');

    const prompt = `
以下の自店舗と競合店の情報を分析し、競争優位性と改善点を提案してください。

【自店舗】
店名: ${myShop.name}
評価: ${myShop.rating}
口コミ数: ${myShop.reviewCount}件

【競合店】
${competitorInfo}

以下のJSON形式で回答してください（JSONのみ出力）：
{
  "competitiveAdvantages": [
    { "aspect": "優位な点", "description": "説明" }
  ],
  "improvementAreas": [
    { "aspect": "改善点", "description": "説明", "priority": "高/中/低" }
  ],
  "marketPosition": "市場での位置づけ（50文字以内）",
  "recommendations": [
    { "title": "施策提案", "description": "説明", "expectedImpact": "期待効果" }
  ]
}
`;

    try {
      return await this.callGemini(prompt);
    } catch (err) {
      console.error('Competitor analysis error:', err);
      return this.getDemoCompetitorAnalysis();
    }
  },

  // =============================================
  // 対策提案生成
  // =============================================

  async generateSolutions(issue) {
    if (!this.isInitialized) {
      return this.getDemoSolutions(issue);
    }

    const prompt = `
飲食店の以下の課題に対する具体的な対策を3つ提案してください。

【課題】
カテゴリ: ${issue.category}
内容: ${issue.summary}
詳細: ${issue.details}

以下のJSON形式で回答してください（JSONのみ出力）：
{
  "solutions": [
    {
      "title": "対策タイトル（15文字以内）",
      "description": "具体的な実施内容（50文字以内）",
      "effort": "低/中/高",
      "impact": "低/中/高",
      "cost": "無料/低コスト/中コスト/高コスト",
      "timeToImplement": "即日/1週間/1ヶ月/3ヶ月以上"
    }
  ]
}
`;

    try {
      return await this.callGemini(prompt);
    } catch (err) {
      console.error('Solution generation error:', err);
      return this.getDemoSolutions(issue);
    }
  },

  // =============================================
  // デモデータ（API未設定時用）
  // =============================================

  getDemoAnalysis() {
    return {
      issues: [
        {
          category: "待ち時間",
          type: "negative",
          summary: "「待ち時間が長い」という声が増加",
          mentionCount: 12,
          details: "特にピーク時間帯（19-21時）に待ち時間への不満が集中",
          solutions: [
            { title: "予約システム導入", effort: "中", impact: "高" },
            { title: "ピーク時間帯の増員", effort: "高", impact: "高" },
            { title: "待ち時間の案内改善", effort: "低", impact: "中" },
          ]
        },
        {
          category: "価格・コスパ",
          type: "negative",
          summary: "「価格が高め」という意見",
          mentionCount: 8,
          details: "周辺店舗と比較して割高感があるとの指摘",
          solutions: [
            { title: "ハッピーアワー導入", effort: "低", impact: "高" },
            { title: "お得なセット作成", effort: "低", impact: "中" },
          ]
        },
      ],
      strengths: [
        {
          category: "料理の味",
          type: "positive",
          summary: "「料理が美味しい」と高評価！",
          mentionCount: 45,
          details: "特に看板メニューへの評価が非常に高い",
          recommendations: [
            { title: "SNSで人気メニュー発信", description: "写真映えするメニューをInstagramで紹介" },
          ]
        },
        {
          category: "接客",
          type: "positive",
          summary: "「スタッフが親切」と好評",
          mentionCount: 28,
          details: "丁寧な接客に対する感謝のコメントが多数",
          recommendations: [
            { title: "接客品質の維持", description: "定期的なスタッフ研修を継続" },
          ]
        },
      ],
      sentiment: {
        positive: 78,
        negative: 12,
        neutral: 10,
      },
      summary: "料理の味と接客は高評価ですが、待ち時間とコスパに改善の余地があります。ピーク時の対策が急務です。"
    };
  },

  getDemoCompetitorAnalysis() {
    return {
      competitiveAdvantages: [
        { aspect: "料理の品質", description: "競合平均より0.3ポイント高い評価" },
        { aspect: "接客サービス", description: "「親切」「丁寧」の言及が競合の1.5倍" },
      ],
      improvementAreas: [
        { aspect: "価格競争力", description: "周辺店舗より10-15%高い価格設定", priority: "高" },
        { aspect: "口コミ数", description: "競合トップの半分以下の口コミ数", priority: "中" },
      ],
      marketPosition: "品質重視の中価格帯ポジション。差別化は進んでいるが認知度向上が課題",
      recommendations: [
        { title: "口コミ促進キャンペーン", description: "会計時にGoogleレビューを依頼", expectedImpact: "口コミ数20%増" },
        { title: "コスパ訴求メニュー追加", description: "低価格帯の入門メニューを開発", expectedImpact: "新規顧客15%増" },
      ]
    };
  },

  getDemoSolutions(issue) {
    const solutionsByCategory = {
      "待ち時間": {
        solutions: [
          { title: "LINE予約導入", description: "LINEでの予約受付で待ち時間を可視化", effort: "中", impact: "高", cost: "低コスト", timeToImplement: "1週間" },
          { title: "スタッフ配置見直し", description: "ピーク時に1名増員して回転率向上", effort: "中", impact: "高", cost: "中コスト", timeToImplement: "即日" },
          { title: "待ち時間ドリンク提供", description: "15分以上待ちのお客様にドリンクサービス", effort: "低", impact: "中", cost: "低コスト", timeToImplement: "即日" },
        ]
      },
      "価格・コスパ": {
        solutions: [
          { title: "ランチセット拡充", description: "1000円以下のお得なランチセットを追加", effort: "低", impact: "高", cost: "無料", timeToImplement: "1週間" },
          { title: "ハッピーアワー", description: "17-19時限定で飲み物20%OFF", effort: "低", impact: "高", cost: "低コスト", timeToImplement: "即日" },
          { title: "ポイントカード導入", description: "リピーター向けに10回で1000円引き", effort: "中", impact: "中", cost: "低コスト", timeToImplement: "1週間" },
        ]
      },
      "default": {
        solutions: [
          { title: "現状把握調査", description: "詳細なお客様アンケートを実施", effort: "低", impact: "中", cost: "無料", timeToImplement: "1週間" },
          { title: "スタッフミーティング", description: "課題について全員で話し合い対策検討", effort: "低", impact: "中", cost: "無料", timeToImplement: "即日" },
          { title: "競合視察", description: "周辺の人気店を視察して改善点を発見", effort: "中", impact: "高", cost: "低コスト", timeToImplement: "1週間" },
        ]
      }
    };

    return solutionsByCategory[issue?.category] || solutionsByCategory["default"];
  },
};

// グローバルに公開
window.AIService = AIService;

// 自動初期化
document.addEventListener('DOMContentLoaded', () => {
  AIService.init();
});
