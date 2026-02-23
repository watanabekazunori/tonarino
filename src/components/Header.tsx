"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import Logo from "@/components/Logo";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm shadow-stone-200/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo size="sm" />
        </Link>
        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/mypage"
                className="text-[13px] font-medium text-stone-600 hover:text-primary-500 transition-colors px-4 py-2 rounded-lg hover:bg-primary-50"
              >
                マイページ
              </Link>
              <button
                onClick={handleLogout}
                className="text-[13px] text-stone-400 hover:text-stone-600 transition-colors px-3 py-2"
              >
                ログアウト
              </button>
            </>
          ) : (
            <Link
              href="/register"
              className="text-[13px] font-semibold bg-stone-900 text-white px-5 py-2.5 rounded-lg hover:bg-stone-800 transition-all duration-200 shadow-sm"
            >
              無料で始める
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
