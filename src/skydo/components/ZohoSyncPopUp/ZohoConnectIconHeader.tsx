import React from "react";
import SkydoIcon from "../Icons/SkydoIcon";
import LinkIcon from "../Icons/LinkIcon";
import ZohoSquareIcon from "../Icons/ZohoSquareIcon";

interface ZohoConnectIconHeaderProps {
  variant?: "default" | "success" | "error";
}

// Tune ARC_RADIUS to change how wide/curved the arc looks. Smaller = narrower + more curved, larger = wider + flatter.
const ARC_RADIUS = 170;
const ARC_WIDTH = 236.56;

const ZohoConnectIconHeader = ({ variant = "default" }: ZohoConnectIconHeaderProps) => {
  const svgHeight = ARC_RADIUS * 2;
  const linkStroke = variant === "error" ? "#E11900" : variant === "success" ? "#1AA06B" : "#283C8B";

  return (
    <div className={"relative h-[96px] w-full overflow-hidden mb-4"}>
      <div className={"absolute left-1/2 top-[7px] -translate-x-1/2 w-[236.56px] h-[82.37px]"}>
        <svg
          className={"absolute left-0 top-[32px] pointer-events-none"}
          width={ARC_WIDTH}
          height={svgHeight}
          viewBox={`0 0 ${ARC_WIDTH} ${svgHeight}`}
          fill="none"
        >
          <defs>
            <linearGradient id="zohoArcGradient" x1="0" y1="0" x2={ARC_WIDTH} y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#D4E2FC" stopOpacity="0" />
              <stop offset="0.06" stopColor="#D4E2FC" stopOpacity="0.75" />
              <stop offset="0.94" stopColor="#D4E2FC" stopOpacity="0.75" />
              <stop offset="1" stopColor="#D4E2FC" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle
            cx="118.28"
            cy={ARC_RADIUS}
            r={ARC_RADIUS}
            stroke="url(#zohoArcGradient)"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
        <div className={"absolute left-[19.83px] top-[30.01px] w-[34px] h-[34px]"}>
          <div className={"absolute inset-0 rounded-full bg-white/40"} />
          <div className={"absolute inset-[1px] rounded-full bg-white flex items-center justify-center shadow-[0_1px_4px_rgba(10,37,64,0.08)]"}>
            <SkydoIcon width={16} height={16} />
          </div>
        </div>
        <div className={"absolute left-[85.05px] top-0 w-[66.47px] h-[66.47px]"}>
          <div className={"absolute inset-0 rounded-full bg-white/30"} />
          <div className={"absolute inset-[4.55px] rounded-full bg-white/60"} />
          <div className={"absolute inset-[10.84px] rounded-full bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(40,60,139,0.1)]"}>
            <LinkIcon width={20} height={20} stroke={linkStroke} />
          </div>
        </div>
        <div className={"absolute left-[182.73px] top-[30.01px] w-[34px] h-[34px]"}>
          <div className={"absolute inset-0 rounded-full bg-white/40"} />
          <div className={"absolute inset-[1px] rounded-full bg-white flex items-center justify-center shadow-[0_1px_4px_rgba(10,37,64,0.08)]"}>
            <ZohoSquareIcon size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZohoConnectIconHeader;
