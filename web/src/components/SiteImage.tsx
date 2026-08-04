import Image, { type ImageProps } from "next/image";

/** Drop-in next/image wrapper (cache bust via next.config images.loaderFile). */
export default function SiteImage(props: ImageProps) {
  return <Image {...props} />;
}
