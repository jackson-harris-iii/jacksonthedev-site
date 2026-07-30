import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JacksonTheDev Design Lab — Three Directions",
  description:
    "Compare three visual directions for JacksonTheDev: Selfrow Editorial, Peacock Signal, and California Circuit.",
  openGraph: {
    title: "JacksonTheDev Design Lab — Three Directions",
    description:
      "Compare Selfrow Editorial, Peacock Signal, and California Circuit.",
    images: [{ url: "/og.png", width: 1731, height: 909 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JacksonTheDev Design Lab — Three Directions",
    description:
      "Compare Selfrow Editorial, Peacock Signal, and California Circuit.",
    images: ["/og.png"],
  },
};

export default function ConceptsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
