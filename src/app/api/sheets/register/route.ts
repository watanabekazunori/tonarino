import { NextRequest, NextResponse } from "next/server";
import { logUserRegistration } from "@/lib/google-sheets";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userName,
      email,
      position,
      businessType,
      challenge,
      challengeOther,
      phone,
      storeName,
      placeId,
    } = body;

    // fire-and-forget: エラーでもOKを返す
    logUserRegistration({
      userName: userName || "",
      email: email || "",
      position: position || "",
      businessType: businessType || "",
      challenge: challenge || "",
      challengeOther,
      phone: phone || "",
      storeName: storeName || "",
      placeId: placeId || "",
    }).catch((err) => {
      console.error("[Sheets/Register] Error:", err);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Sheets/Register] Error:", error);
    return NextResponse.json({ success: true }); // エラーでも200返す
  }
}
