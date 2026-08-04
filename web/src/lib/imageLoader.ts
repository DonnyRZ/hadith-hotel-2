import { ASSET_REV } from "@/generated/asset-rev";

/**
 * Built-in optimizer URL with a separate cache-bust param.
 * Do NOT put ?v= inside `url` — Next.js /_next/image returns 400 for that.
 */
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const path = src.split("?")[0] ?? src;
  const params = new URLSearchParams({
    url: path,
    w: String(width),
    q: String(quality ?? 75),
  });
  if (ASSET_REV) params.set("v", ASSET_REV);
  return `/_next/image?${params.toString()}`;
}
