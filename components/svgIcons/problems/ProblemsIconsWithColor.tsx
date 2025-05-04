import React from "react";
// import { ProblemColors } from "./colors"; // Ensure correct path
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
  SwayBack,
  FlatBack,
  WingedScapula,
  AnteriorPelvicTilt,
  KneesHyperExtrntion,
  PosteriorPelvicTilt,
  TightHamestring,
} from "./ProblemIconComponent"; // Ensure correct import path
import { ProblemColors } from "@/constants/Colors";

const iconMapping: Record<
  string,
  React.FC<{ color: string; backgroundColor: string }>
> = {
  Scoliosis,
  "Uneven Hips: Right Hip Higher": UnevenHipsRightHigher,
  "Uneven Hips: Left Hip Higher": UnevenHipsLeftHigher,
  Kyphosis,
  Lordosis,
  "Uneven Shoulders: Right Shoulder Higher": UnevenShouldersRightHigher,
  "Uneven Shoulders: Left Shoulder Higher": UnevenShouldersLeftHigher,
  "Bow Knees": BowKnees,
  "Knock Knees": KnockKnees,
  "Forward Head Posture": ForwardHead,
  "Rounded Shoulders": RoundedShoulders,
  "Uneven Shoulders": UnevenShouldersRightHigher, // Default to right if general
  "Uneven Hips": UnevenHipsRightHigher, // Default to right if general
  "Sway Back": SwayBack,
  "Flat Back": FlatBack,
  "Winged Scapula": WingedScapula,
  "Anterior Pelvic Tilt": AnteriorPelvicTilt,
  "Hyperextension of the Knee": KneesHyperExtrntion,
  "Posterior Pelvic Tilt": PosteriorPelvicTilt,
  "Tight Hamstrings": TightHamestring,
};

interface IconComponentProps {
  problem: string;
}

const IconComponent: React.FC<IconComponentProps> = ({ problem }) => {
  const Icon = iconMapping[problem] || null;
  const color = ProblemColors[problem] || "#000"; // Default to black
  const backgroundColor = color.replace(")", ", 0.5)").replace("rgb", "rgba"); // Convert to rgba for opacity

  if (!Icon) return null;

  return <Icon color={color} backgroundColor={backgroundColor} />;
};

export default IconComponent;
