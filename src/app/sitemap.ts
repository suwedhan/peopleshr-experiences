import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

// Guide article URLs get added here once the resources section is built.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/cost-calculator", "/plan-finder", "/resources"];
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
