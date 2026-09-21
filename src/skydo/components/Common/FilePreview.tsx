import { isFileTypeNotPdf } from "../../util/functions";
import Image from "next/image";
import React from "react";
import classNames from "classnames";

const FilePreview = ({
  fileLink = "",
  iframeClass,
  isPdf,
}: {
  fileLink: string;
  iframeClass?: string;
  isPdf?: boolean;
}) => {
  if (isPdf)
    return (
      <iframe
        width="100%"
        height="100%"
        allow={"fullscreen"}
        src={fileLink}
        className={classNames("border-0 object-contain", iframeClass)}
      ></iframe>
    );

  return isFileTypeNotPdf(fileLink) ? (
    <Image src={fileLink} layout={"fill"} objectFit={"contain"} alt={""} />
  ) : (
    <iframe
      width="100%"
      height="100%"
      allow={"fullscreen"}
      src={fileLink}
      className={classNames("border-0 object-contain", iframeClass)}
    ></iframe>
  );
};

export default FilePreview;
