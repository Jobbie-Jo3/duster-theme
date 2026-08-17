import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { QueryProvider } from "@/components/providers/query-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Tip4ServScript } from "@/components/providers/tip4serv-script";
import { getStoreWhoami } from "@/lib/api-client";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "#SALT Webshop",
  description:
    "Official #SALT NO-WIPE ARK: Survival Ascended webshop for points, VIP, loot boxes and server extras.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Keep Tip4Serv store data exactly as-is
  const initialStore = await getStoreWhoami();

  return (
    <html lang="en">
      <body
        className={`${inter.variable} min-h-screen bg-background text-foreground antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <Tip4ServScript />

          <div className="relative flex min-h-screen flex-col overflow-x-hidden">

            {/* #SALT BACKGROUND GLOW */}
            <div className="pointer-events-none fixed inset-0 -z-10">
              <div className="absolute left-1/2 top-[-260px] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-salt-orange/5 blur-[160px]" />

              <div className="absolute bottom-[-260px] right-[-200px] h-[520px] w-[520px] rounded-full bg-salt-orange/5 blur-[160px]" />
            </div>

            {/* HEADER */}
            <Header initialStore={initialStore} />

            {/* MAIN STORE CONTENT */}
            <main className="relative flex-1">
              {children}
            </main>

            {/* FOOTER */}
            <Footer initialStore={initialStore} />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}