import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const baseUrl = "https://pngtostl.net";

  return [
    { url: baseUrl, lastModified: now },
    { url: `${baseUrl}/zh`, lastModified: now },
    { url: `${baseUrl}/image-to-stl`, lastModified: now },
    { url: `${baseUrl}/how-it-works`, lastModified: now },
    { url: `${baseUrl}/faq`, lastModified: now },
    { url: `${baseUrl}/privacy`, lastModified: now },
    { url: `${baseUrl}/terms`, lastModified: now },
    { url: `${baseUrl}/contact`, lastModified: now },
  ];
}
