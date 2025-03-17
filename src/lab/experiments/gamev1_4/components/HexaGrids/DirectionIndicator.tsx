import React from "react";
import { Z_INDEX } from "../../constants/zIndex";
import {DirectionData} from "../../types/DirectionData";

/**
 * Props interface for the DirectionIndicator component
 * @interface Props
 * @property {UnitDirection} direction - The direction to point the indicator towards.
 * Valid values are: 'top-right', 'right', 'bottom-right', 'bottom-left', 'left', 'top-left'
 */
interface Props {
  direction: DirectionData;
}

export const DirectionIndicator: React.FC<Props> = ({ direction }) => {
  const coords = getLineCoordinates(direction);

  return (
    <div style={wrapperStyle}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <line
          {...coords}
          stroke="gray"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

const getLineCoordinates = (direction: DirectionData) => {
  switch (direction) {
    case "top-right":
      return { x1: "55", y1: "10", x2: "89", y2: "27" }; // reference line
    case "right":
      return { x1: "89", y1: "30", x2: "89", y2: "70" }; // adjusted to match style
    case "bottom-right":
      return { x1: "89", y1: "73", x2: "55", y2: "90" }; // mirror of top-right
    case "bottom-left":
      return { x1: "45", y1: "90", x2: "11", y2: "73" }; // mirror of top-right
    case "left":
      return { x1: "11", y1: "70", x2: "11", y2: "30" }; // mirror of right
    case "top-left":
      return { x1: "11", y1: "27", x2: "45", y2: "10" }; // mirror of top-right
  }
};

const wrapperStyle = {
  position: "absolute" as const,
  width: "100%",
  height: "100%",
  pointerEvents: "none" as const,
  zIndex: Z_INDEX.DIRECTION_INDICATOR,
};
