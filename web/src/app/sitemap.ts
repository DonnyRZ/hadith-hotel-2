import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { INDEXABLE_PATHS, canonicalUrl, languageAlternates } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_PATHS.map((path) => ({
    url: canonicalUrl(routing.defaultLocale, path),
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
    alternates: {
      languages: languageAlternates(path),
    },
  }));
}
