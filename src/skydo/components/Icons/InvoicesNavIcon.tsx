interface Props {
  selectedColor?: string;
  width?: number;
  height?: number;
  className?: string;
}

const InvoicesNavIcon = ({ selectedColor = "#0A2540", width = 24, height = 24, className }: Props) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M20 21V2.86486C20 2.54917 19.6165 2.39308 19.396 2.61905L17.9344 4.11723C17.7875 4.26785 17.5421 4.25675 17.4093 4.09347L15.9804 2.33594C15.8396 2.16268 15.5751 2.16268 15.4342 2.33594L14.0292 4.06406C13.8884 4.23732 13.6238 4.23732 13.483 4.06406L12.078 2.33594C11.9371 2.16268 11.6726 2.16268 11.5318 2.33594L10.1268 4.06406C9.98592 4.23732 9.7214 4.23732 9.58053 4.06406L8.20722 2.37488C8.05661 2.18963 7.76919 2.20487 7.63902 2.40501L6.58131 4.03124C6.45834 4.22031 6.19177 4.24657 6.03427 4.08513L4.60396 2.61905C4.3835 2.39308 4 2.54917 4 2.86486V21C4 21.5523 4.44772 22 5 22H19C19.5523 22 20 21.5523 20 21Z"
        stroke={selectedColor}
        strokeWidth="1.5"
      />
      <path d="M7 18H15" stroke={selectedColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 15H10" stroke={selectedColor} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export default InvoicesNavIcon;
