import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "JacksonTheDev — Practical AI Systems",
  description:
    "Jackson Harris III helps owner-led businesses turn repeated work, calls, leads, documents, and judgment into practical AI systems.",
  metadataBase: new URL("https://jacksonthedev.com"),
  openGraph: {
    title: "JacksonTheDev — Practical AI Systems",
    description: "Turn the work you repeat into a system that keeps moving.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JacksonTheDev — Practical AI Systems",
    description: "Turn the work you repeat into a system that keeps moving.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={geistSans.variable + " " + geistMono.variable}>
        {children}
      </body>
    </html>
  );
}
