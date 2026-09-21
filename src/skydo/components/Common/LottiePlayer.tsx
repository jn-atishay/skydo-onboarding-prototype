//Jul 2024
import { Player, PlayerEvent } from "@lottiefiles/react-lottie-player";
import { useEffect, useRef } from "react";

interface Props {
  width?: string | number;
  height?: string | number;
  animation?: boolean;
  loop?: boolean;
  onComplete?: () => void;
  src: string;
}

const LottiePlayer = (props: Props) => {
  const { width, height, animation, loop = animation, onComplete, src } = props;
  const playerRef = useRef<Player>(null);

  useEffect(() => {
    if (animation) {
      playerRef.current?.play();
      return;
    }
    playerRef.current?.pause();
  }, [animation]);

  return (
    <Player
      ref={playerRef}
      autoplay={animation}
      loop={loop}
      onEvent={(event) => {
        if (event === PlayerEvent.Complete) onComplete?.();
      }}
      src={src}
      style={{ height, width }}
    />
  );
};

LottiePlayer.defaultProps = {
  width: "32px",
  height: "32px",
  animation: true,
};

export default LottiePlayer;
