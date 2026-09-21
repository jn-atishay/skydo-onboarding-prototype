import { CommonIconProps } from "./types";

const WalletIcon = ({ isSelected = false, width = 20, height = 20, className }: CommonIconProps) => {
  const stroke = isSelected ? "#283C8B" : "#0A2540";
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" className={className}>
      {/* Figma draws the wallet body with an inside stroke, which SVG has no native
          equivalent for — the mask clips a double-width stroke to the rect's interior. */}
      <mask id="navWalletBodyInsideStroke" fill="white">
        <rect x="2" y="6.099" width="16.0676" height="11.9009" rx="1" />
      </mask>
      <rect
        x="2"
        y="6.099"
        width="16.0676"
        height="11.9009"
        rx="1"
        stroke={stroke}
        strokeWidth="3"
        mask="url(#navWalletBodyInsideStroke)"
      />
      <path
        d="M4.59266 5.86607L3.95688 6.26314L4.76858 7.52551L5.40437 7.12844L4.99852 6.49725L4.59266 5.86607ZM12.1662 2.02072L12.5721 2.65191V2.65191L12.1662 2.02072ZM13.5469 2.32023L12.918 2.7278L12.918 2.7278L13.5469 2.32023ZM16.2437 6.30595L16.8663 5.88918L16.8663 5.88918L16.2437 6.30595ZM15.6443 6.75662L16.07 7.37498L17.3154 6.54144L16.8897 5.92308L16.267 6.33985L15.6443 6.75662ZM4.99852 6.49725L5.40437 7.12844L12.5721 2.65191L12.1662 2.02072L11.7604 1.38953L4.59266 5.86607L4.99852 6.49725ZM13.5469 2.32023L12.918 2.7278C14.3755 4.91347 14.4997 5.09399 15.621 6.72272L16.2437 6.30595L16.8663 5.88918C15.7496 4.26707 15.6296 4.09272 14.1758 1.91265L13.5469 2.32023ZM16.2437 6.30595L15.621 6.72271L15.6443 6.75662L16.267 6.33985L16.8897 5.92308L16.8663 5.88918L16.2437 6.30595ZM12.1662 2.02072L12.5721 2.65191C12.6865 2.58047 12.8413 2.61285 12.918 2.7278L13.5469 2.32023L14.1758 1.91266C13.6463 1.11869 12.5714 0.883026 11.7604 1.38953L12.1662 2.02072Z"
        fill={stroke}
      />
      <ellipse cx="15.0135" cy="12.0498" rx="0.796738" ry="0.784674" fill={stroke} />
      <path d="M14 4.00012L9.46673 6.80003" stroke={stroke} strokeWidth="1.38667" strokeLinecap="round" />
      <path
        d="M15 9.75H17.25V14.25H15C13.7574 14.25 12.75 13.2426 12.75 12C12.75 10.7574 13.7574 9.75 15 9.75Z"
        stroke={stroke}
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default WalletIcon;
