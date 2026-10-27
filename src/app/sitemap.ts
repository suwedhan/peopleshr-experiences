import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/articles";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = ["", "/cost-calculator", "/plan-finder", "/resources"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  const guides: MetadataRoute.Sitemap = ARTICLES.map((article) => ({
    url: `${siteConfig.url}/resources/${article.slug}`,
    lastModified: article.updated,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...pages, ...guides];
}
