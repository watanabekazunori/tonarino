import { NextRequest, NextResponse } from "next/server";
import { logInquiry } from "@/lib/google-sheets";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, storeName, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    const result = await logInquiry({
      name,
      email,
      storeName: storeName || "",
      message,
    });

    if (!result) {
      return NextResponse.json(
        { error: "送信に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Inquiry] Error:", error);
    return NextResponse.json(
      { error: "送信に失敗しました" },
      { status: 500 }
    );
  }
}
