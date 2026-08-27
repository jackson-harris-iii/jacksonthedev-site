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
  title: "JacksonTheDev — Human in the Loop",
  description:
    "Jackson Harris III turns calls, leads, documents, workflows, and hard-earned judgment into useful AI systems without losing the human touch.",
  metadataBase: new URL("https://jacksonthedev.jacksonthedev.chatgpt.site"),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "JacksonTheDev — Human in the Loop",
    description: "Your expertise should create momentum—not a bottleneck.",
    type: "website",
    images: [
      {
        url: "/og-peacock-atelier.png",
        width: 1600,
        height: 900,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JacksonTheDev — Human in the Loop",
    description: "Your expertise should create momentum—not a bottleneck.",
    images: ["/og-peacock-atelier.png"],
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
