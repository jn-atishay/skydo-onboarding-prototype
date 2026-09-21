import Image from "next/image";
import React, { useEffect, useState } from "react";
import ROWFlagIcon from "./ROWFlagIcon";

// Every country in the BE country master has a flag here, keyed by lowercase ISO alpha-2.
const FLAG_BASE_URL = "https://skydo-public-documents.s3.ap-south-1.amazonaws.com/flags";

interface Props {
  code2Alpha: string;
  width?: number;
  height?: number;
}

/**
 * Flag for any country in the country master, served from S3 rather than a per-country SVG
 * component. Falls back to the globe so a missing file never renders as broken.
 */
const CountryFlagImage = ({ code2Alpha, width = 20, height = 15 }: Props) => {
  const [hasFailed, setHasFailed] = useState(false);
  const code = (code2Alpha ?? "").toLowerCase();

  // A reused instance must not stay pinned to the globe because a previous country's flag 404'd.
  useEffect(() => setHasFailed(false), [code]);

  if (!code || hasFailed) {
    return <ROWFlagIcon width={width} height={height} />;
  }

  return (
    <Image
      src={`${FLAG_BASE_URL}/${code}.svg`}
      alt={code2Alpha}
      width={width}
      height={height}
      onError={() => setHasFailed(true)}
    />
  );
};

export default CountryFlagImage;
