import classNames from "classnames";
import { ArrowDirection, ArrowIconSmallRotated } from "../Icons/ArrowIconSmall";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES } from "../../constants/atomicConstants";
import { useContext } from "react";
import AppContext from "../../context/AppContext";
import { useRouter } from "next/router";

interface Props {
  isLeftDisabled: boolean;
  onLeftClick?: () => void;
  paginationText: string;
  isRightDisabled: boolean;
  onRightClick?: () => void;
  page?: number;
  size?: number;
}

const PaginationCTAs = (props: Props) => {
  const { isLeftDisabled, onLeftClick, paginationText, onRightClick, isRightDisabled, page = 1, size = 10 } = props;
  const router = useRouter();
  const onLeftIconClick = () => {
    if (onLeftClick) onLeftClick();
    else if (isLeftDisabled) return;
    else {
      void router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            page: Number(page) - 1,
            size: Number(size),
          },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const onRightIconClick = () => {
    if (onRightClick) onRightClick();
    else if (isRightDisabled) return;
    else {
      void router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            page: Number(page) + 1,
            size: Number(size),
          },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const { theme } = useContext(AppContext);
  return (
    <div className={"flex_row_item_center justify-center mt-6"}>
      <div
        className={classNames("bg-white p-2 rounded-full flex items-center justify-center hover:shadow-common", {
          "cursor-pointer": !isLeftDisabled,
          "cursor-not-allowed": isLeftDisabled,
        })}
        onClick={onLeftIconClick}
      >
        <ArrowIconSmallRotated
          stroke={isLeftDisabled ? theme.hexColors.black[400] : undefined}
          direction={ArrowDirection.LEFT}
        />
      </div>
      <Typography text={paginationText} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-black-500 px-4"} />
      <div
        className={classNames("bg-white p-2 rounded-full flex items-center justify-center hover:shadow-common", {
          "cursor-pointer": !isRightDisabled,
          "cursor-not-allowed": isRightDisabled,
        })}
        onClick={onRightIconClick}
      >
        <ArrowIconSmallRotated
          stroke={isRightDisabled ? theme.hexColors.black[400] : undefined}
          direction={ArrowDirection.RIGHT}
        />
      </div>
    </div>
  );
};

export default PaginationCTAs;
