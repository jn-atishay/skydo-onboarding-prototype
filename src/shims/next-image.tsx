// Stand-in for next/image. Renders a plain <img> and drops the Next-only props so
// the real components' markup and Tailwind classes survive unchanged.
import React from "react";

type Props = {
  src?: any;
  alt?: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  loader?: unknown;
  placeholder?: string;
  blurDataURL?: string;
  unoptimized?: boolean;
  objectFit?: string;
  objectPosition?: string;
  layout?: string;
  style?: React.CSSProperties;
  [k: string]: any;
};

const NextImage = React.forwardRef<HTMLImageElement, Props>(function NextImage(props, ref) {
  const {
    src,
    alt = "",
    width,
    height,
    fill,
    priority,
    quality,
    loader,
    placeholder,
    blurDataURL,
    unoptimized,
    objectFit,
    objectPosition,
    layout,
    style,
    ...rest
  } = props;

  const resolved = typeof src === "object" && src !== null ? src.src ?? src.default ?? "" : src;
  const fillStyle: React.CSSProperties = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%" }
    : {};
  const fitStyle: React.CSSProperties = objectFit ? { objectFit: objectFit as any } : {};

  return (
    <img
      ref={ref}
      src={resolved}
      alt={alt}
      width={fill ? undefined : (width as any)}
      height={fill ? undefined : (height as any)}
      style={{ ...fillStyle, ...fitStyle, ...(objectPosition ? { objectPosition } : {}), ...style }}
      {...rest}
    />
  );
});

export default NextImage;
