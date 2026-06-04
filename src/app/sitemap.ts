import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const baseUrl = "https://pngtostl.net";

  const routes = [
    "/",
    "/pricing",
    "/login",
    "/profile",
    "/zh",
    "/image-to-stl",
    "/image-checker",
    "/palette-to-relief",
    "/how-it-works",
    "/faq",
    "/contact",
    "/stl-size-estimator",
    "/print-settings-checker",
    "/image-contrast-guide",
    "/lithophane-size-calculator",
    "/image-threshold-tester",
    "/print-preview-calculator",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({ url: `${baseUrl}${route}`, lastModified: now }));
}
