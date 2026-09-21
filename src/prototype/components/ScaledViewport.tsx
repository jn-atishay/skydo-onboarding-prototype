// Shows a product page the way a Figma frame does: laid out at a real desktop
// window size, then scaled to fit the prototype's frame.
//
// The product's pages are designed for a full browser window. The sign-up page, for
// example, splits the window in half and gives the referral column up to 650px. Beside
// the prototype's rail the frame is narrower than a window, so rendering the page
// straight into it squeezes that column against the edge. Laying it out at the width
// the reference captures were taken at, and scaling down, keeps every margin and
// padding in proportion.
import React, { useLayoutEffect, useRef, useState } from "react";

/** The CSS width of the browser window the reference captures were taken in. */
export const DESIGN_WIDTH = 1512;

export function ScaledViewport({ className, children }: { className?: string; children: React.ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ scale: number; height: number } | null>(null);

  useLayoutEffect(() => {
    const el = outer.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const scale = Math.min(1, width / DESIGN_WIDTH);
      setBox({ scale, height: height / scale });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outer} className="proto-viewport-outer">
      {box && (
        <div
          className={`proto-viewport ${className ?? ""}`}
          data-scale={box.scale}
          style={{
            width: box.scale < 1 ? DESIGN_WIDTH : "100%",
            height: box.height,
            transform: box.scale < 1 ? `scale(${box.scale})` : undefined,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/** How much the page on show is scaled down, for code that measures inside it. */
export function viewportScale(el: Element | null): number {
  const vp = el?.closest(".proto-viewport") as HTMLElement | null;
  return Number(vp?.dataset.scale) || 1;
}
