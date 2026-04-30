import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import MobileBottomNav from "@/components/MobileBottomNav";
import PageLoader from "@/components/PageLoader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "sayed soliman",
  description: "Portfolio of Mr. Elsayed Soliman",
  icons: {
    icon: "/image/sayed.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <PageLoader />
          <Navbar />
          <ScrollProgress />
          {children}
          <MobileBottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
