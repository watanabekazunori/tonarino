import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Tonarino | あなたの"となり"、見てみませんか？',
  description:
    "飲食店向け競合分析ツール。周辺の競合店舗を地図上で可視化し、口コミ分析・改善提案まで無料で提供します。",
  openGraph: {
    title: "Tonarino | 飲食店向け競合分析ツール",
    description: 'あなたの"となり"、見てみませんか？',
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased bg-warm-50 text-stone-800 min-h-screen">
        {children}
      </body>
    </html>
  );
}
