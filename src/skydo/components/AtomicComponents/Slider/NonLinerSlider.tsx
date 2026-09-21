import * as React from "react";
import { FC, useContext } from "react";
import Slider, { SliderProps } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import AppContext from "../../../context/AppContext";

type NonLinerSliderProps = {
  defaultValue?: number;
  /**
   * The callback function for when the value of the slider changes
   */
  onChange: (value: number) => void;
  /**
   * tailwind friendly class to set the max width of the slider
   * IMPORTANT: Recommended to put only put width, max-width related classes here
   */
  widthClasses?: string;
  onFocus?: () => void;
  parentValue?: number;
  thumbColor?: string;
  darkColor?: string;
  trackColor?: string;
  lightColor?: string;
  dotColor?: string;
  activeDotColor?: string;
  railColor?: string;

  dotTextColor?: string;
  fontSize?: string;
  sliderHeight?: number;
  dotHeight?: number;
  thumbHeight?: number;
  labelTop?: string;
};
// Formats the value into human-readable units
function valueLabelFormat(value: number) {
  return `${value}`;
}

// Maps slider value to actual storage value
function calculateValue(value: number) {
  if (value <= 19) {
    // 500 to 10K (steps of 500)
    return 500 + value * 500;
  } else if (value <= 28) {
    // 10K to 100K (steps of 10K)
    return 10000 + (value - 19) * 10000;
  } else {
    // 100K to 1M (steps of 100K)
    return 100000 + (value - 28) * 100000;
  }
}

// Maps actual storage value back to slider value
function reverseValue(storageValue: number) {
  if (storageValue <= 10000) {
    return (storageValue - 500) / 500;
  } else if (storageValue <= 100000) {
    return 19 + (storageValue - 10000) / 10000;
  } else {
    return 28 + (storageValue - 100000) / 100000;
  }
}

interface CustomSliderProps extends SliderProps {
  thumbColor?: string;
  trackColor?: string;
  railColor?: string;
  dotColor?: string;
  activeDotColor?: string;
  dotTextColor?: string;
  fontSize?: string;
  sliderHeight?: number;
  dotHeight?: number;

  thumbHeight?: number;
  labelTop?: string;
}

const CustomSlider = styled(Slider)<CustomSliderProps>(
  ({
    theme,
    trackColor,
    thumbColor,
    railColor,
    dotColor,
    activeDotColor,
    dotTextColor,
    fontSize,
    sliderHeight,
    dotHeight,
    thumbHeight,
    labelTop
  }) => ({
    color: trackColor || theme.palette.primary.main, // Default to primary color if not provided
    height: 10,
    "& .MuiSlider-thumb": {
      height: thumbHeight || 32,
      width: thumbHeight || 32,
      backgroundColor: thumbColor || "#fff", // Default thumb color
      backgroundSize: "contain", // Ensure the SVG scales appropriately
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      border: `solid ${trackColor || theme.palette.primary.main}`,
      "&:hover": {
        boxShadow: "none", // Hover with transparency
      },
    },
    "& .MuiSlider-rail": {
      height: sliderHeight || 10,
      backgroundColor: railColor || theme.palette.grey[400], // Default rail color
    },
    "& .MuiSlider-track": {
      height: sliderHeight || 18,
      backgroundColor: trackColor || theme.palette.primary.main,
    },
    "& .MuiSlider-mark": {
      width: dotHeight || 10,
      height: dotHeight || 10,
      borderRadius: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: dotColor || theme.palette.grey[200], // Default dot color
    },
    "& .MuiSlider-markActive": {
      backgroundColor: activeDotColor || trackColor || theme.palette.primary.main, // Default active dot color
    },
    '& .MuiSlider-mark[data-index="0"]': {
      transform: "translate(50%, -50%)", // Align the first dot to the right side of the slider
    },
    '& .MuiSlider-mark[data-index="3"]': {
      transform: "translate(-150%, -50%)", // Align the last dot to the left side of the slider
    },
    "& .MuiSlider-markLabel": {
      fontSize: fontSize || "1rem",
      top: labelTop || "120%", // Adjust the text position to align with the dot
      transform: "translateX(-50%)", // Center the text horizontally under the dot
      color: dotTextColor || theme.palette.text.primary,
    },
    '& .MuiSlider-markLabel[data-index="0"]': {
      transform: "translateX(0%)", // Align the first text to the right
      left: "0%", // Ensure the text aligns with the first mark
    },
    '& .MuiSlider-markLabel[data-index="3"]': {
      transform: "translateX(-100%)", // Align the last text to the left
      left: "100%", // Ensure the text aligns with the last mark
    },
  })
);

const NonLinearSlider: FC<NonLinerSliderProps> = ({
  defaultValue = 7000,
  onChange,
  widthClasses = "flex-1",
  onFocus = () => {},
  parentValue,
  thumbColor,
  darkColor,
  trackColor,
  lightColor,
  dotColor,
  activeDotColor,
  railColor,
  dotTextColor,
  fontSize,
  sliderHeight,
  dotHeight,
  thumbHeight,
  labelTop,
}) => {
  const [value, setValue] = React.useState<number>(reverseValue(defaultValue)); // Convert defaultValue to slider scale
  const { theme } = useContext(AppContext);

  React.useEffect(() => {
    if (parentValue !== undefined) {
      setValue(reverseValue(parentValue)); // Update state if parentValue changes
    }
  }, [parentValue]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setValue(newValue);
      onChange(calculateValue(newValue));
    }
  };

  const marks = [
    { value: 0, label: "500" },
    { value: 19, label: "10K" },
    { value: 28, label: "100K" },
    { value: 37, label: "1M" },
  ];

  return (
    <div className={`flex flex-col ${widthClasses}`} onFocus={onFocus}>
      <CustomSlider
        value={value}
        min={0}
        max={37}
        step={1}
        scale={(sliderValue) => calculateValue(sliderValue)}
        valueLabelFormat={(value) => valueLabelFormat(calculateValue(value))}
        getAriaValueText={(value) => valueLabelFormat(calculateValue(value))}
        onChange={handleChange}
        valueLabelDisplay="off"
        aria-labelledby="non-linear-slider"
        marks={marks}
        fontSize={fontSize}
        thumbColor={thumbColor} // Thumb color
        trackColor={trackColor} // Track color
        railColor={railColor} // Rail color
        dotColor={dotColor} // Inactive dot color
        activeDotColor={activeDotColor} // Active dot color
        dotTextColor={dotTextColor} // Dot text color
        sliderHeight={sliderHeight} // Slider height
        dotHeight={dotHeight} // Dot height
        thumbHeight={thumbHeight} // Thumb height
        labelTop={labelTop} // Label top
      />
    </div>
  );
};

export default NonLinearSlider;
