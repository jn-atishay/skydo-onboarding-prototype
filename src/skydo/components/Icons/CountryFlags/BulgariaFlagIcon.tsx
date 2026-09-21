const BulgariaFlagIcon = ({ is24X24, width, height }: { is24X24?: boolean; width?: number; height?: number }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0.29303 3.00439 15.2304 9.99291"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_8242_9735)">
                <path d="M15.5235 3.00439H0.29303V6.33692H15.5235V3.00439Z" fill="white"/>
                <path d="M15.5235 6.33276H0.29303V9.66526H15.5235V6.33276Z" fill="#009067"/>
                <path d="M15.5235 9.66479H0.29303V12.9973H15.5235V9.66479Z" fill="#F90A0A"/>
            </g>
            <defs>
                <clipPath id="clip0_8242_9735">
                    <rect width="15.2304" height="15.2304" fill="white" transform="translate(0.29303 0.385742)"/>
                </clipPath>
            </defs>
        </svg>

    );
};

BulgariaFlagIcon.defaultProps = {
    width: 32,
    height: 32,
};

export default BulgariaFlagIcon;
