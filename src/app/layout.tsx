import type { Metadata } from "next";
import Script from "next/script";
import { FeedbackLauncher } from "@/components/FeedbackLauncher";
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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    url: "https://pngtostl.net",
    siteName: "PNGtoSTL",
    title: "Image to STL Converter | PNGtoSTL",
    description: "Upload common image formats and choose a printable STL workflow for reliefs, logos, lithophanes, and heightmaps.",
    images: [
      {
        url: "/og-icon.png",
        width: 512,
        height: 512,
        alt: "PNGtoSTL icon",
      },
    ],
  },
};

const GA_MEASUREMENT_ID = "G-ZPV5EZHN4G";

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
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
        <Script id="pngtostl-ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              anonymize_ip: true,
              send_page_view: true
            });
          `}
        </Script>
        {children}
        <FeedbackLauncher />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </body>
    </html>
  );
}
