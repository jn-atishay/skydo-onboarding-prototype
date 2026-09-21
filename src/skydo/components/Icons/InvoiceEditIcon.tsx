import { CommonIconProps } from "./types";

const InvoiceEditIcon = ({ isSelected = false, width = 20, height = 20, className }: CommonIconProps) => {
  const stroke = isSelected ? "#283C8B" : "#0A2540";
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M3 2.8V16.5C3 17.0523 3.44772 17.5 4 17.5H9.5H15C15.5523 17.5 16 17.0523 16 16.5V10V2.96569C16 2.60932 15.5691 2.43086 15.3172 2.68284L14.551 3.44903C14.5205 3.47947 14.474 3.48702 14.4355 3.46777L12.5519 2.52595C12.5198 2.5099 12.4816 2.51228 12.4517 2.53219L11.0555 3.46302C11.0219 3.48541 10.9781 3.48541 10.9445 3.46302L9.55547 2.53698C9.52188 2.51459 9.47812 2.51459 9.44453 2.53698L8.05547 3.46302C8.02188 3.48541 7.97812 3.48541 7.94453 3.46302L6.55547 2.53698C6.52188 2.51459 6.47812 2.51459 6.44453 2.53698L5.05887 3.46075C5.02359 3.48427 4.97732 3.48299 4.9434 3.45755L3.64 2.48C3.37631 2.28223 3 2.47038 3 2.8Z"
        stroke={stroke}
        strokeWidth="1.5"
      />
      <path d="M6 6.5H12.5" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M6 9H10" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
      {/* Opaque so the document outline does not read through the pencil overlapping it. */}
      <path
        d="M18.9946 15C18.9946 17.2091 16.2073 18.5 13.9999 18.5C11.7924 18.5 8.49988 18.5 10.4999 16.5C10.4999 14.2909 14.2924 10.5 16.4999 10.5C18.7073 10.5 18.9946 12.7909 18.9946 15Z"
        fill="white"
      />
      <path
        d="M16.0519 10.3342C16.1579 10.2283 16.2837 10.1442 16.4221 10.0869C16.5606 10.0295 16.709 10 16.8588 10C17.0087 10 17.1571 10.0295 17.2955 10.0869C17.434 10.1442 17.5598 10.2283 17.6658 10.3342C17.7717 10.4402 17.8558 10.566 17.9131 10.7045C17.9705 10.8429 18 10.9913 18 11.1412C18 11.291 17.9705 11.4394 17.9131 11.5779C17.8558 11.7163 17.7717 11.8421 17.6658 11.9481L12.219 17.3948L10 18L10.6052 15.781L16.0519 10.3342Z"
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default InvoiceEditIcon;
