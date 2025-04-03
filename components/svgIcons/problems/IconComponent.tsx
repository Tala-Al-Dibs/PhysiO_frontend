import React from "react";
import {
  UnevenShouldersRightHigher,
  UnevenShouldersLeftHigher,
  UnevenHipsRightHigher,
  UnevenHipsLeftHigher,
  Scoliosis,
  BowKnees,
  KnockKnees,
  ForwardHead,
  RoundedShoulders,
  Kyphosis,
  Lordosis,
} from "./problemsIcons"; // Ensure the correct import path

// Mapping the problems to their corresponding icons
const iconMapping: Record<string, React.FC> = {
  Scoliosis: Scoliosis,
  "Uneven Hips: Right Hip Higher": UnevenHipsRightHigher,
  "Uneven Hips: Left Hip Higher": UnevenHipsLeftHigher,
  Kyphosis: Kyphosis,
  Lordosis: Lordosis,
  "Uneven Shoulders: Right Shoulder Higher": UnevenShouldersRightHigher,
  "Uneven Shoulders: Left Shoulder Higher": UnevenShouldersLeftHigher,
  "Bow Knees": BowKnees,
  "Knock Knees": KnockKnees,
  "Forward Head": ForwardHead,
  "Rounded Shoulders": RoundedShoulders,
  "Uneven Shoulders": UnevenShouldersRightHigher,
  "Uneven Hips": UnevenHipsRightHigher,
};

interface IconComponentProps {
  problem: string;
}

const IconComponent: React.FC<IconComponentProps> = ({ problem }) => {
  // Get the corresponding icon from the mapping, defaulting to null if not found
  const Icon = iconMapping[problem] || null;

  // If no icon is found for the problem, return a fallback icon or null
  if (!Icon) {
    return <></>;
  }

  return <Icon />;
};

export default IconComponent;
