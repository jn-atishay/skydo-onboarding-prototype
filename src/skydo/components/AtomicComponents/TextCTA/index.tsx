/*
create a Link component in next js that takes in a href and a text prop
 */
import Link from "next/link";
import Typography from "../Typography";

interface Props {
  text: string;
  href?: string;
  typographyType?: string;
  typographySize?: string;
  typographyStyle: string;
  onClick?: () => void;
}

const TextCTA = (props: Props) => {
  const { text, href, typographyType, typographySize, typographyStyle, onClick } = props;

  if (!href) {
    return (
      <Typography
        text={text}
        type={typographyType}
        textClasses={typographyStyle}
        size={typographySize}
        onTextClick={onClick}
      />
    );
  }

  return (
    <Link href={href} passHref>
      <Typography
        text={text}
        type={typographyType}
        textClasses={typographyStyle}
        size={typographySize}
        onTextClick={onClick}
      />
    </Link>
  );
};

TextCTA.defaultProps = {
  typographyStyle: "cursor-pointer !text-blue-400",
};

export default TextCTA;
