// Stand-in for next/link: renders an ordinary anchor.
import React from "react";

const Link = ({ href, children, replace, scroll, shallow, prefetch, locale, passHref, legacyBehavior, ...rest }: any) => {
  const target = typeof href === "object" ? href?.pathname ?? "#" : href ?? "#";
  if (React.isValidElement(children) && (children as any).type === "a") {
    return React.cloneElement(children as any, { href: target, ...rest });
  }
  return (
    <a href={target} {...rest}>
      {children}
    </a>
  );
};

export default Link;
