import { ASSET_REV } from "@/generated/asset-rev";

/**
 * Cache-bust public static URLs. ASSET_REV is a content hash of `public/`
 * written at build time — browsers refetch after assets change.
 */
export function asset(path: string): string {
  if (
    !path ||
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  if (!ASSET_REV) return path;

  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}v=${ASSET_REV}`;
}
