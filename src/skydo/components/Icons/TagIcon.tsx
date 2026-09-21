import { CommonIconProps } from "./types";


const TagIcon = ({width = 33, height = 33}: CommonIconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 33 33" fill="none">
      <path
        d="M27.9532 18.4487L18.3932 28.0087C18.1455 28.2566 17.8514 28.4533 17.5277 28.5875C17.204 28.7217 16.8569 28.7908 16.5065 28.7908C16.1561 28.7908 15.8091 28.7217 15.4853 28.5875C15.1616 28.4533 14.8675 28.2566 14.6198 28.0087L3.1665 16.5687V3.23535H16.4998L27.9532 14.6887C28.4498 15.1883 28.7286 15.8642 28.7286 16.5687C28.7286 17.2732 28.4498 17.9491 27.9532 18.4487V18.4487Z"
        stroke="#0A2540"
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.8335 9.90137H9.84683"
        stroke="#0A2540"
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TagIcon;
