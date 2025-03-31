import * as React from "react";
import Svg, { G, Path, Defs, LinearGradient, Stop } from "react-native-svg";

export const ListIcon = () => {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      {...({ xmlns: "http://www.w3.org/2000/svg" } as any)}
    >
      <Path
        d="M0 6C0 4.89375 0.89375 4 2 4H26C27.1063 4 28 4.89375 28 6C28 7.10625 27.1063 8 26 8H2C0.89375 8 0 7.10625 0 6ZM4 16C4 14.8937 4.89375 14 6 14H30C31.1063 14 32 14.8937 32 16C32 17.1063 31.1063 18 30 18H6C4.89375 18 4 17.1063 4 16ZM28 26C28 27.1063 27.1063 28 26 28H2C0.89375 28 0 27.1063 0 26C0 24.8937 0.89375 24 2 24H26C27.1063 24 28 24.8937 28 26Z"
        fill="#383838"
      />
    </Svg>
  );
};
