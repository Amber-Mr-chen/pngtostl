import type { Metadata } from "next";
import Script from "next/script";
import { FeedbackLauncher } from "@/components/FeedbackLauncher";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pngtostl.net"),
  title: {
    default: "PNGtoSTL - Image to STL, Relief, Lithophane, and AI 3D Workflows",
    template: "%s | PNGtoSTL",
  },
  description:
    "PNGtoSTL turns images into printable STL workflows: image to STL, logo badges, photo relief, lithophane panels, heightmaps, and honest AI 3D task routing.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    url: "https://pngtostl.net",
    siteName: "PNGtoSTL",
    title: "PNGtoSTL - Image to STL, Relief, Lithophane, and AI 3D Workflows",
    description: "PNGtoSTL turns images into printable STL workflows: image to STL, logo badges, photo relief, lithophane panels, heightmaps, and honest AI 3D task routing.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PNGtoSTL image to STL converter preview",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="pe/qASRBRNEqjq6mKdRPEw" async />
        <script async src="https://plausible.shipsolo.io/js/pa-hH9PJovRN2vjpuGZf0nY3.js" />
        <script
          id="pngtostl-translate-icon-alt"
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var translateIconPattern = 'fonts.gstatic.com/s/i/productlogos/translate/';
                function labelTranslateIcons(root){
                  var scope = root && root.querySelectorAll ? root : document;
                  scope.querySelectorAll('img[src*="' + translateIconPattern + '"]').forEach(function(img){
                    if (!img.getAttribute('alt')) img.setAttribute('alt', 'Google Translate icon');
                    if (!img.getAttribute('title')) img.setAttribute('title', 'Google Translate icon');
                  });
                }
                labelTranslateIcons(document);
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', function(){ labelTranslateIcons(document); }, { once: true });
                }
                new MutationObserver(function(mutations){
                  mutations.forEach(function(mutation){
                    mutation.addedNodes.forEach(function(node){
                      if (node.nodeType !== 1) return;
                      if (node.matches && node.matches('img[src*="' + translateIconPattern + '"]')) {
                        if (!node.getAttribute('alt')) node.setAttribute('alt', 'Google Translate icon');
                        if (!node.getAttribute('title')) node.setAttribute('title', 'Google Translate icon');
                      }
                      labelTranslateIcons(node);
                    });
                  });
                }).observe(document.documentElement, { childList: true, subtree: true });
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.plausible = window.plausible || function(){
                (plausible.q = plausible.q || []).push(arguments)
              };
              plausible.init = plausible.init || function(i){
                plausible.o = i || {}
              };
              plausible.init();
            `,
          }}
        />
      </head>
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
