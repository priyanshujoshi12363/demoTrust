import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrustAI - Advanced Fraud Detection & Administrative Control",
  description: "Real-time transaction monitoring and security orchestration for high-stakes financial operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#fcfdfe] text-[#111] selection:bg-[#00b87c]/30">
        {children}
      </body>
    </html>
  );
}
