import classNames from "classnames";
import Image from "next/image";

/**
 * Country/region indicator used in the Skydo fees page.
 * A 20×20 white circle with a 0.23px outline, containing a small flag SVG
 * sized per its Figma intrinsic dimensions.
 */
export type FlagKind = "us" | "uk" | "eu" | "globe";

type FlagSpec = { src: string; width: number; height: number };

const FLAG_SPECS: Record<FlagKind, FlagSpec> = {
  us: { src: "/images/skydoFees/flag-us.svg", width: 11, height: 7 },
  uk: { src: "/images/skydoFees/flag-uk.svg", width: 11, height: 7 },
  eu: { src: "/images/skydoFees/flag-eu.svg", width: 11, height: 7 },
  globe: { src: "/images/skydoFees/flag-globe.svg", width: 9, height: 9 },
};

const FlagPill = ({
  flag,
  className = "",
}: {
  flag: FlagKind;
  className?: string;
}) => {
  const spec = FLAG_SPECS[flag];
  return (
    <div
      className={classNames(
        // Per-Figma: each pill carries its own subtle drop shadow at the layer level.
        // Using box-shadow (not the filter `drop-shadow`) so overlapping pills don't
        // accumulate into a single union-silhouette shadow.
        "w-5 h-5 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0 border-[0.23px] border-solid border-black-300 shadow-[0_1.77px_2.2px_rgba(191,192,194,0.25)]",
        className
      )}
    >
      <Image src={spec.src} alt={""} width={spec.width} height={spec.height} />
    </div>
  );
};

export default FlagPill;
