import PanUploadIcon from "../../Icons/PanUploadIcon";
import Typography from "../Typography";
import Locale from "../../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import classnames from "classnames";

interface Props {
  title?: string;

  icon?: JSX.Element;
  isImage?: boolean;
  containerClass?: string;
  subtitle?: string;
  fileType?: string;
}

const DragFileInput = (props: Props) => {
  const { title, icon, isImage, containerClass, subtitle, fileType } = props;
  return (
    <div
      className={classnames(
        "z-[110] fixed left-0 right-0 bottom-0 top-12 bg-white/90 flex flex-col items-center justify-center",
        containerClass
      )}
    >
      {icon ? icon : <PanUploadIcon />}
      <Typography
        text={title}
        type={TYPOGRAPHY_TYPES.HEADING}
        size={TYPOGRAPHY_SIZES.SMALL}
        textClasses={"mt-4 mb-2"}
      />
      <Typography
        text={fileType ? fileType : isImage ? Locale.imageFileType : Locale.fileTypeUpload}
        textClasses={"mb-1 !text-black-500"}
      />
      <Typography text={subtitle || Locale.sizeLimit} textClasses={"!text-black-500"} />
      <div className={"z-[111] fixed left-0 right-0 bottom-0 top-12 bg-white/0"}></div>
    </div>
  );
};

DragFileInput.defaultProps = {
  title: Locale.dropDirectorPan,
};

export default DragFileInput;
