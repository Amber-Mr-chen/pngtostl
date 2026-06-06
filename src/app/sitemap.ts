import type { MetadataRoute } from "next";
import { helperPages, tools } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://pngtostl.net";
  return [
    { url: base, lastModified: new Date() },
    ...tools
      .filter((tool) => tool.slug)
      .map((tool) => ({ url: `${base}/${tool.slug}`, lastModified: new Date() })),
    ...helperPages.map((page) => ({ url: `${base}/${page.slug}`, lastModified: new Date() })),
    { url: `${base}/faq`, lastModified: new Date() },
  ];
}
