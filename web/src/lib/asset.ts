/**
 * Cache-bust public static URLs. NEXT_PUBLIC_ASSET_REV is a content hash of
 * `public/` written at build time — browsers refetch only after assets change.
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

  const rev = process.env.NEXT_PUBLIC_ASSET_REV;
  if (!rev) return path;

  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}v=${rev}`;
}
