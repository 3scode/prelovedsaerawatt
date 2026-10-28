import Image from "next/image";
import { cn } from "@/lib/utils";

interface MediaImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  fill?: boolean;
}

export function MediaImage({
  src,
  alt,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  className,
  fill = true,
}: MediaImageProps) {
  const isInline = src.startsWith("data:") || src.startsWith("blob:");
  if (isInline) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element -- data URL demo upload tidak didukung optimizer.
        <img
          src={src}
          alt={alt}
          className={cn("absolute inset-0 h-full w-full object-cover", className)}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      );
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      className={className}
    />
  );
}
