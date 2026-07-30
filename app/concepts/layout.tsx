import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JacksonTheDev Design Lab — Three Directions",
  description:
    "Compare three visual directions for JacksonTheDev: Selfrow Editorial, Peacock Atelier, and California Circuit.",
  openGraph: {
    title: "JacksonTheDev Design Lab — Three Directions",
    description:
      "Compare Selfrow Editorial, Peacock Atelier, and California Circuit.",
    images: [
      {
        url: "/brand/jacksonthedev-x-banner.png",
        width: 1500,
        height: 500,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JacksonTheDev Design Lab — Three Directions",
    description:
      "Compare Selfrow Editorial, Peacock Atelier, and California Circuit.",
    images: ["/brand/jacksonthedev-x-banner.png"],
  },
};

export default function ConceptsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
