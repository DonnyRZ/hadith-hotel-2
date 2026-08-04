import Image, { type ImageProps } from "next/image";
import { asset } from "@/lib/asset";

/**
 * Local public images are served directly with a content-hash query.
 * Next's /_next/image optimizer rejects ?v= inside `url` (400) and custom
 * loaders disable the optimizer endpoint (404), so unoptimized + asset() is
 * the reliable cache-bust path for /images and /videos.
 */
export default function SiteImage({ src, ...props }: ImageProps) {
  const isLocalString =
    typeof src === "string" &&
    (src.startsWith("/images/") || src.startsWith("/videos/"));
  const resolved = isLocalString ? asset(src) : src;

  return <Image src={resolved} unoptimized={isLocalString} {...props} />;
}
