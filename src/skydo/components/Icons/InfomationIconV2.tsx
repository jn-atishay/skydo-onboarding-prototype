interface Props {
  width?: number;
  height?: number;
}

const InformationIconV2 = ({ width = 24, height = 25 }: Props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 25" fill="none">
            <path d="M12 22.6953C17.5228 22.6953 22 18.2182 22 12.6953C22 7.17246 17.5228 2.69531 12 2.69531C6.47715 2.69531 2 7.17246 2 12.6953C2 18.2182 6.47715 22.6953 12 22.6953Z" stroke="#8898AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 16.6953V12.6953" stroke="#8898AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 8.69531H12.01" stroke="#8898AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default InformationIconV2;