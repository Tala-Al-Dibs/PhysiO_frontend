import * as React from "react";
import Svg, { G, Path, Defs, LinearGradient, Stop } from "react-native-svg";

const WeightIcon = ({ color="#00838f", size = 20 }) => {
  return (
    <Svg
    width={16}
    height={16}
    viewBox="0 -1 15 24"
        fill="none"
        {...({ xmlns:"http://www.w3.org/2000/svg" } as any)}
      >
        <Path
      d="M20.5 2H3.5C3.10218 2 2.72064 2.15804 2.43934 2.43934C2.15804 2.72064 2 3.10218 2 3.5V20.5C2 20.8978 2.15804 21.2794 2.43934 21.5607C2.72064 21.842 3.10218 22 3.5 22H20.5C20.8978 22 21.2794 21.842 21.5607 21.5607C21.842 21.2794 22 20.8978 22 20.5V3.5C22 3.10218 21.842 2.72064 21.5607 2.43934C21.2794 2.15804 20.8978 2 20.5 2Z"
      stroke="#0CA7BD"
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <Path
      d="M6 9.52686C7.66233 7.52686 9.66233 6.52686 12 6.52686C14.3373 6.52686 16.3373 7.52686 18 9.52686"
      stroke="#0CA7BD"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M12 15.5C12.3978 15.5 12.7794 15.342 13.0607 15.0607C13.342 14.7794 13.5 14.3978 13.5 14C13.5 13.6022 13.342 13.2206 13.0607 12.9393C12.7794 12.658 12.3978 12.5 12 12.5C11.6022 12.5 11.2206 12.658 10.9393 12.9393C10.658 13.2206 10.5 13.6022 10.5 14C10.5 14.3978 10.658 14.7794 10.9393 15.0607C11.2206 15.342 11.6022 15.5 12 15.5Z"
      fill="#0CA7BD"
    />
    <Path
      d="M9.5 10.5L12.004 14"
      stroke="#0CA7BD"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);
}

export default WeightIcon