"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Suspense } from "react";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  useEffect(() => {
    // For implicit flow, Supabase JS SDK automatically picks up
    // the access_token from the URL hash fragment via onAuthStateChange.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_IN") {
          router.replace(next);
        }
      }
    );

    // Also check if already signed in (in case event fired before listener)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace(next);
      }
    });

    // Timeout fallback — if nothing happens in 10s, redirect to error
    const timeout = setTimeout(() => {
      router.replace("/auth/auth-code-error");
    }, 10000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router, next]);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-stone-500 text-sm">ログイン処理中...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
