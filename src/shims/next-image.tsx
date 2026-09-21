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

  // The website field looks up the site's icon from Google's favicon service. The
  // prototype sends nothing off the page, so skip that request and report it as
  // failed; the product then shows its own globe icon, as it does for any site
  // without an icon.
  const isOutsideLookup = typeof resolved === "string" && /^https?:\/\/www\.google\.com\/s2\/favicons/.test(resolved);
  const onError = rest.onError;
  React.useEffect(() => {
    if (isOutsideLookup && typeof onError === "function") onError(new Event("error"));
  }, [isOutsideLookup]);
  if (isOutsideLookup) return null;
  // next/image has two ways of saying the same thing: the modern `fill` prop and the
  // older layout="fill". Both mean "cover the positioned parent".
  const isFill = Boolean(fill) || layout === "fill";
  const fillStyle: React.CSSProperties = isFill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%" }
    : {};
  const fitStyle: React.CSSProperties = objectFit
    ? { objectFit: objectFit as any }
    : isFill
    ? { objectFit: "cover" }
    : {};

  return (
    <img
      ref={ref}
      src={resolved}
      alt={alt}
      width={isFill ? undefined : (width as any)}
      height={isFill ? undefined : (height as any)}
      style={{ ...fillStyle, ...fitStyle, ...(objectPosition ? { objectPosition } : {}), ...style }}
      {...rest}
    />
  );
});

export default NextImage;
