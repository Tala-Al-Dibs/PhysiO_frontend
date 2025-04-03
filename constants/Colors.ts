/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

const anteriorPelvicTilt = "#0CA7BD"; // Main blue
const bowKnees = "#FFAC33"; // Original orange
const forwardHeadPosture = "#0A8697"; // Darker blue
const hyperextensionOfTheKnee = "#FFD55A"; // Light yellow
const knockKnees = "#00B4CC"; // Brighter cyan-blue
const kyphosis = "#FF9500"; // Deeper orange
const lordosis = "#006D7D"; // Deep teal
const posteriorPelvicTilt = "#FFC107"; // Golden yellow
const roundedShoulders = "#4DC9E0"; // Light blue
const scoliosis = "#FF8A00"; // Vibrant orange
const flatBack = "#0D5C69"; // Muted teal
const swayBack = "#FFE082"; // Pale yellow
const tightHamstrings = "#00A3B5"; // Medium blue
const unevenHips = "#FFB74D"; // Peach orange
const unevenShoulders = "#024A57"; // Dark teal
const wingedScapula = "#FFEE58"; // Bright yellow

export default {
  anteriorPelvicTilt,
  bowKnees,
  forwardHeadPosture,
  hyperextensionOfTheKnee,
  knockKnees,
  kyphosis,
  lordosis,
  posteriorPelvicTilt,
  roundedShoulders,
  scoliosis,
  flatBack,
  swayBack,
  tightHamstrings,
  unevenHips,
  unevenShoulders,
  wingedScapula,
};

export const ProblemColors: { [key: string]: string } = {
  "Anterior Pelvic Tilt": anteriorPelvicTilt,
  "Bow Knees": bowKnees,
  "Forward Head Posture": forwardHeadPosture,
  "Hyperextension of the Knee": hyperextensionOfTheKnee,
  "Knock Knees": knockKnees,
  Kyphosis: kyphosis,
  Lordosis: lordosis,
  "Posterior Pelvic Tilt": posteriorPelvicTilt,
  "Rounded Shoulders": roundedShoulders,
  Scoliosis: scoliosis,
  "Flat Back (Straight Back)": flatBack,
  "Sway Back": swayBack,
  "Tight Hamstrings": tightHamstrings,
  "Uneven Hips": unevenHips,
  "Uneven Shoulders": unevenShoulders,
  "Winged Scapula": wingedScapula,
};

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};
