import Image, { type ImageProps } from "next/image";

const OPTIMIZED_HOSTS = new Set(["images.unsplash.com"]);

function isValidImageUrl(src: string): boolean {
  try {
    const url = new URL(src);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function shouldOptimize(src: string): boolean {
  try {
    return OPTIMIZED_HOSTS.has(new URL(src).hostname);
  } catch {
    return false;
  }
}

type ProductImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string | null | undefined;
  alt: string;
};

export function ProductImage({ src, alt, ...props }: ProductImageProps) {
  if (!src || !isValidImageUrl(src)) {
    return null;
  }

  return (
    <Image
      src={src}
      alt={alt}
      unoptimized={!shouldOptimize(src)}
      {...props}
    />
  );
}
