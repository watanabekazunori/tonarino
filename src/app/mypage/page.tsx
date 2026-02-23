"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Report {
  id: string;
  place_id: string;
  created_at: string;
  comparison_text: string;
}

interface UserProfile {
  store_name: string;
  business_type: string;
  challenge: string;
  email: string;
}

export default function MyPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (!token) {
        router.push("/register");
        return;
      }

      try {
        // Fetch reports
        const res = await fetch("/api/report", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setReports(data.reports || []);

        // Fetch profile
        const { data: profileData } = await supabase
          .from("users")
          .select("*")
          .single();

        if (profileData) {
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="pt-20 pb-12 px-4 max-w-3xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-stone-700 mb-1">マイページ</h1>
          <p className="text-stone-400 text-sm">
            レポート履歴とアカウント情報
          </p>
        </div>

        {/* Profile card */}
        {profile && (
          <div className="bg-white rounded-2xl p-6 border border-primary-100 mb-8 animate-slide-up">
            <h2 className="font-bold text-stone-600 mb-4">アカウント情報</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-stone-400">店舗名</span>
                <p className="font-medium text-stone-700">
                  {profile.store_name || "-"}
                </p>
              </div>
              <div>
                <span className="text-stone-400">業態</span>
                <p className="font-medium text-stone-700">
                  {profile.business_type || "-"}
                </p>
              </div>
              <div>
                <span className="text-stone-400">メール</span>
                <p className="font-medium text-stone-700">
                  {profile.email || "-"}
                </p>
              </div>
              <div>
                <span className="text-stone-400">課題</span>
                <p className="font-medium text-stone-700">
                  {profile.challenge || "-"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* New search */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-primary-500/20"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            新しい競合分析を始める
          </Link>
        </div>

        {/* Reports list */}
        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-lg font-bold text-stone-600 mb-4">
            レポート履歴
          </h2>

          {reports.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-stone-100 text-center">
              <p className="text-stone-400 mb-4">
                まだレポートがありません
              </p>
              <Link
                href="/"
                className="text-primary-500 hover:text-primary-600 text-sm"
              >
                最初の分析を始める
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <Link
                  key={report.id}
                  href={`/report/${report.id}`}
                  className="block bg-white rounded-2xl p-5 border border-stone-100 hover:border-primary-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-stone-700">
                        競合分析レポート
                      </p>
                      <p className="text-xs text-stone-400 mt-1">
                        {new Date(report.created_at).toLocaleDateString(
                          "ja-JP",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-stone-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                  {report.comparison_text && (
                    <p className="text-sm text-stone-400 mt-2 line-clamp-2">
                      {report.comparison_text}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
