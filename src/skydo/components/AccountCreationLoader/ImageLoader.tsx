import { Player } from "@lottiefiles/react-lottie-player";

export const ImageLoader = () => {
  return <Player autoplay loop src="/lottie_loader.json" className={"w-[200px} md:w-[800px] h-[200px]"}></Player>;
};

export default ImageLoader;
