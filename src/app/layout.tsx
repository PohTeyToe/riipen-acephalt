import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/lib/roleContext";
import { TopBar } from "@/components/TopBar";
import { AuditRibbon } from "@/components/AuditRibbon";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Acephalt Diligence Workspace: Project Cedar",
  description:
    "Scoped diligence prototype showing role-based access outcomes, field-level redaction, and sample audit telemetry across three reviewer lenses.",
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
    >
      <body className="min-h-full flex flex-col">
        <RoleProvider>
          <TopBar />
          <AuditRibbon />
          <main className="flex-1">{children}</main>
          <Footer />
        </RoleProvider>
      </body>
    </html>
  );
}
