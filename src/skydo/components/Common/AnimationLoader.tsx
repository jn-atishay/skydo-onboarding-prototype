import { Player } from "@lottiefiles/react-lottie-player";

interface Props {
  width?: string;
  height?: string;
  animation?: boolean;
  loop?: number;
  src: string;
  className?: string;
}

export const AnimationLoader = (props: Props) => {
  const { width, height, animation, className = "", src, loop } = props;
  return (
    <Player
      autoplay={animation}
      loop={loop || animation}
      src={src}
      style={{ height: height, width: width }}
      className={className}
    ></Player>
  );
};

AnimationLoader.defaultProps = {
  width: "32px",
  height: "32px",
};

export default AnimationLoader;
