import dynamic from "next/dynamic";

const LottiePlayer = dynamic(() => import("../Common/LottiePlayer"), { ssr: false });

interface Props {
  width?: string | number;
  height?: string | number;
  animation?: boolean;
}
export const USdImageLoader = (props: Props) => {
  const { width, height, animation } = props;
  return <LottiePlayer src="/dollar-animation.json" width={width} height={height} animation={animation} />;
};

USdImageLoader.defaultProps = {
  width: "24px",
  height: "24px",
  animation: false,
};

export default USdImageLoader;
