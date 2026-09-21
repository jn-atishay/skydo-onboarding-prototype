interface Props {
  onClick?: () => void;
  className?: string;
  fill?: string;
  width?: number;
  height?: number;
}
const DeleteIcon = (props: Props) => {
  const { onClick, className, fill = "#8898AA", width = 16, height = 16 } = props;
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" onClick={onClick} className={className}>
      <path
        d="M2.75 5.66667H13.25V13.25C13.25 14.2165 12.4665 15 11.5 15H4.5C3.5335 15 2.75 14.2165 2.75 13.25V5.66667ZM6.25 12.0833V8H5.08333V12.0833H6.25ZM8.58333 12.0833V8H7.41667V12.0833H8.58333ZM10.9167 12.0833V8H9.75V12.0833H10.9167ZM14.4167 3.33333C14.7388 3.33333 15 3.5945 15 3.91667C15 4.23883 14.7388 4.5 14.4167 4.5H1.58333C1.26117 4.5 1 4.23883 1 3.91667C1 3.5945 1.26117 3.33333 1.58333 3.33333H5.08333V1.58333C5.08333 1.26117 5.3445 1 5.66667 1H10.3333C10.6555 1 10.9167 1.26117 10.9167 1.58333V3.33333H14.4167ZM6.25 2.16667V3.33333H9.75V2.16667H6.25Z"
        fill={fill}
      />
    </svg>
  );
};

export default DeleteIcon;
