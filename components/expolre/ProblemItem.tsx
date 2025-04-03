import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Problem } from "@/app/(types)/types";
import { Feather } from "@expo/vector-icons";

interface ProblemItemProps {
  item: Problem;
  onPress: () => void;
  index: number;
}

const problemImages = {
  "Bow Legs (Genu Varum)": require("@/assets/images/Bow-legged.png") as number,
  "Anterior Pelvic Tilt":
    require("@/assets/images/anterior-pelvic-tilt.png") as number,
  "Forward Head Posture": require("@/assets/images/forward-head.png") as number,
  "Hyperextension of the Knee":
    require("@/assets/images/hyper-knee-extension.png") as number,
  "Knock Knees": require("@/assets/images/knock-knees.png") as number,
  Kyphosis: require("@/assets/images/kyphosis.png") as number,
  Lordosis: require("@/assets/images/lordosis.png") as number,
  "Posterior Pelvic Tilt":
    require("@/assets/images/posterior-pelvic-tilt.png") as number,
  "Rounded Shoulders":
    require("@/assets/images/rounded-shoulders.png") as number,
  Scoliosis: require("@/assets/images/scoliosis.png") as number,
  "Flat Back (Straight Back)":
    require("@/assets/images/flat-back.png") as number,
  "Sway Back": require("@/assets/images/sway-back.png") as number,
  "Tight Hamstrings": require("@/assets/images/tight-hamestring.png") as number,
  "Uneven Hips": require("@/assets/images/uneven-hips.png") as number,
  "Uneven Shoulders": require("@/assets/images/uneven-shoulders.png") as number,
  "Winged Scapula": require("@/assets/images/winged-scapula.png") as number,
};

const backgroundColors = [
  "#f0f8ff",
  "#f0fff0",
  "#f0fff8",
  "#f5faff",
  "#fff5f5",
  "#f8f5ff",
  "#f0f8ff",
  "#fffaf0",
  "#f5fff0",
  "#fff9f2",
  "#faf0ff",
  "#fff0f8",
  "#f0f5ff",
  "#fafff0",
  "#f0fffa",
  "#fff8f0",
  "#fafafa",
];

type FeatherIconName =
  | "activity"
  | "alert-circle"
  | "award"
  | "bell"
  | "bookmark";

const problemIcons: Record<string, FeatherIconName> = {
  "Bow Legs (Genu Varum)": "alert-circle",
  "Anterior Pelvic Tilt": "activity",
  "Forward Head Posture": "award",
  "Hyperextension of the Knee": "bell",
  "Knock Knees": "bookmark",
  Kyphosis: "activity",
  Lordosis: "alert-circle",
  "Posterior Pelvic Tilt": "award",
  "Rounded Shoulders": "bell",
  Scoliosis: "bookmark",
  "Flat Back (Straight Back)": "activity",
  "Sway Back": "alert-circle",
  "Tight Hamstrings": "award",
  "Uneven Hips": "bell",
  "Uneven Shoulders": "bookmark",
  "Winged Scapula": "activity",
};

const defaultIcon: FeatherIconName = "activity";

const ProblemItem: React.FC<ProblemItemProps> = ({ item, onPress, index }) => {
  const backgroundColor = backgroundColors[index % backgroundColors.length];
  const problemImage = problemImages[item.name as keyof typeof problemImages];
  const problemIcon = problemIcons[item.name] || defaultIcon;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.problemItem, { backgroundColor }]}
        onPress={onPress}
      >
        <View style={styles.imageContainer}>
          <Image source={problemImage} style={styles.image} />
        </View>
        <View style={styles.problemInfo}>
          <Feather name={problemIcon} size={20} color="#333" />
          <Text style={styles.problemName}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  problemItem: {
    width: "80%",
    height: 300,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: "100%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 90,
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  problemInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  problemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
});

export default ProblemItem;
