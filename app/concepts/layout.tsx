import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JacksonTheDev Design Lab — Three Directions",
  description:
    "Compare three visual directions for JacksonTheDev: Selfrow Editorial, Human Current, and California Circuit.",
  openGraph: {
    title: "JacksonTheDev Design Lab — Three Directions",
    description:
      "Compare Selfrow Editorial, Human Current, and California Circuit.",
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
    title: "JacksonTheDev Design Lab — Three Directions",
    description:
      "Compare Selfrow Editorial, Human Current, and California Circuit.",
    images: ["/og-peacock-atelier.png"],
  },
};

export default function ConceptsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
