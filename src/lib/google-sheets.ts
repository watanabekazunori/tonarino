/**
 * Google Sheets書き込みユーティリティ
 * Google Apps Script (GAS) Web App経由でスプレッドシートに書き込む
 */

const SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

interface SheetRow {
  sheetName: string;
  values: (string | number | boolean | null)[];
}

/**
 * GAS Web AppにPOSTしてシートに行追加
 * fire-and-forget: エラーが発生してもメインフローは止めない
 */
async function appendToSheet(data: SheetRow): Promise<boolean> {
  if (!SHEETS_WEBHOOK_URL) {
    console.warn("[GoogleSheets] GOOGLE_SHEETS_WEBHOOK_URL is not set, skipping");
    return false;
  }

  try {
    const res = await fetch(SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error(`[GoogleSheets] Failed to append: ${res.status} ${res.statusText}`);
      return false;
    }

    console.log(`[GoogleSheets] Successfully appended to "${data.sheetName}"`);
    return true;
  } catch (error) {
    console.error("[GoogleSheets] Error:", error);
    return false;
  }
}

/**
 * ユーザー登録データをスプレッドシートに書き込む
 */
export async function logUserRegistration(params: {
  userName: string;
  email: string;
  position: string;
  businessType: string;
  challenge: string;
  challengeOther?: string | null;
  phone: string;
  storeName: string;
  placeId: string;
}): Promise<boolean> {
  return appendToSheet({
    sheetName: "ユーザー登録",
    values: [
      new Date().toISOString(),
      params.userName,
      params.email,
      params.position,
      params.businessType,
      params.challenge + (params.challengeOther ? `(${params.challengeOther})` : ""),
      params.phone,
      params.storeName,
      params.placeId,
    ],
  });
}

/**
 * 検索データをスプレッドシートに書き込む
 */
export async function logSearch(params: {
  query: string;
  placeName: string;
  placeId: string;
  lat: string | number;
  lng: string | number;
  ip: string;
  userAgent: string;
}): Promise<boolean> {
  return appendToSheet({
    sheetName: "検索一覧",
    values: [
      new Date().toISOString(),
      params.query,
      params.placeName,
      params.placeId,
      String(params.lat),
      String(params.lng),
      params.ip,
      params.userAgent,
    ],
  });
}

/**
 * 問い合わせデータをスプレッドシートに書き込む
 */
export async function logInquiry(params: {
  name: string;
  email: string;
  storeName: string;
  message: string;
}): Promise<boolean> {
  return appendToSheet({
    sheetName: "問い合わせ",
    values: [
      new Date().toISOString(),
      params.name,
      params.email,
      params.storeName,
      params.message,
    ],
  });
}
