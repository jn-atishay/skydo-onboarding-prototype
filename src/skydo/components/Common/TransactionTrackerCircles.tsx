import classNames from "classnames";

interface Props {
  isCurrentState?: boolean;
  isPassed?: boolean;
  isBiggerCircle?: boolean;
  isInstantSettlement?: boolean;
}

const TransactionTrackerCircles = (props: Props) => {
  const { isCurrentState, isPassed, isInstantSettlement } = props;
  
  // Use inline styles to ensure colors are applied
  const getCircleColor = () => {
    if (isInstantSettlement && (isCurrentState || isPassed)) return "#276EF1"; // blue-400 from custom theme
    if (!isInstantSettlement && (isCurrentState || isPassed)) return "#1AA06B"; // green-400 from custom theme
    return "#CFD7DF"; // black-400 from custom theme
  };
  
  // Show icon for the last circle (when passed) in instant settlement
  const showIcon = isInstantSettlement && !isPassed && isCurrentState;
  
  // console.log('🎨 TransactionTrackerCircles - isInstantSettlement:', isInstantSettlement, 'isCurrentState:', isCurrentState, 'isPassed:', isPassed, 'circleColor:', getCircleColor());
  
  return (
    <div
      className="z-10 absolute -translate-x-2/4 w-3 h-3 rounded-full flex items-center justify-center"
      style={{ backgroundColor: getCircleColor() }}
    >
      {showIcon && (
        <img 
          src="/images/Symbol.png" 
          alt="Instant settlement" 
          width={12} 
          height={12}
          style={{ objectFit: 'contain' }}
        />
      )}
    </div>
  );
};

export default TransactionTrackerCircles;
