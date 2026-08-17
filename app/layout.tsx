import type { Metadata } from "next";
import { Inter, Rajdhani } from "next/font/google";
import "./globals.css";

import { QueryProvider } from "@/components/providers/query-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Tip4ServScript } from "@/components/providers/tip4serv-script";
import { getStoreWhoami } from "@/lib/api-client";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "#SALT Webshop",
  description:
    "Official #SALT NO-WIPE ARK: Survival Ascended webshop for VIP, points, loot boxes and server extras.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialStore = await getStoreWhoami();

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${rajdhani.variable} min-h-screen bg-void text-foreground antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <Tip4ServScript />

          <div className="relative flex min-h-screen flex-col overflow-x-hidden">
            <div className="pointer-events-none fixed inset-0 -z-10">
              <div className="absolute left-[15%] top-0 h-[420px] w-[520px] rounded-full bg-salt-orange/5 blur-[150px]" />
              <div className="absolute right-[8%] top-[15%] h-[360px] w-[480px] rounded-full bg-salt-orange/5 blur-[150px]" />
            </div>

            <Header initialStore={initialStore} />

            <main className="relative flex-1">
              {children}
            </main>

            <Footer initialStore={initialStore} />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}