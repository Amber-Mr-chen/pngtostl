import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pngtostl.net"),
  title: {
    default: "Image to STL Converter | PNGtoSTL",
    template: "%s | PNGtoSTL",
  },
  description:
    "Upload PNG, JPG, WebP, GIF, or BMP and choose a printable STL workflow: relief, logo, lithophane, or heightmap.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://pngtostl.net",
    siteName: "PNGtoSTL",
    title: "Image to STL Converter | PNGtoSTL",
    description: "Upload common image formats and choose a printable STL workflow for reliefs, logos, lithophanes, and heightmaps.",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PNGtoSTL",
  url: "https://pngtostl.net",
  description: "Browser-based image-to-STL tools for reliefs, logo badges, lithophanes, and heightmap surfaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </body>
    </html>
  );
}
