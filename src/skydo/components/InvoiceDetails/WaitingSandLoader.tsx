import dynamic from "next/dynamic";

const LottiePlayer = dynamic(() => import("../Common/LottiePlayer"), { ssr: false });
interface Props {
  width?: string;
  height?: string;
  animation?: boolean;
}
export const WaitingSandLoader = (props: Props) => {
  const { width, height, animation } = props;
  return <LottiePlayer src="/waiting_sand.json" width={width} height={height} animation={animation} />;
};

WaitingSandLoader.defaultProps = {
  width: "32px",
  height: "32px",
  animation: true,
};

export default WaitingSandLoader;
