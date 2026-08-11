import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "We Know Sac — What Sacramento Is Becoming",
  description:
    "A weekly, source-backed intelligence desk for the local creators who explain what is opening, changing, and coming to Sacramento.",
  openGraph: {
    title: "We Know Sac — What Sacramento Is Becoming",
    description:
      "Four current Sacramento signals, turned into creator-ready stories.",
    type: "website",
    images: [
      {
        url: "/we-know-sac-og.png",
        width: 1600,
        height: 900,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "We Know Sac — What Sacramento Is Becoming",
    description:
      "Four current Sacramento signals, turned into creator-ready stories.",
    images: ["/we-know-sac-og.png"],
  },
};

export default function WeKnowSacLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
