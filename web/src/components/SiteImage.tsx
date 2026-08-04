import Image, { type ImageProps } from "next/image";
import { asset } from "@/lib/asset";

/** Drop-in next/image wrapper that versions local `/images` (and similar) URLs. */
export default function SiteImage({ src, ...props }: ImageProps) {
  const resolved = typeof src === "string" ? asset(src) : src;
  return <Image src={resolved} {...props} />;
}
