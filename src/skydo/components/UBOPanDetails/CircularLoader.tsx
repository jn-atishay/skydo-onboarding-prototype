import styles from "./index.module.css";

interface Props {
  isGray?: boolean;
  isWhite?: boolean;
}

const CircularLoader = (props: Props) => {
  const { isGray, isWhite } = props;
  return (
    <div
      className={`${styles["lds-spinner"]} ${isGray ? styles["gray-loader"] : ""} ${
        isWhite ? styles["white-loader"] : ""
      }`}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default CircularLoader;
