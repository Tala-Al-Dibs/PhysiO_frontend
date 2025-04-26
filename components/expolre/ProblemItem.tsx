import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Problem } from "@/components/expolre/types/types";
import { ProblemColors } from "@/constants/Colors";
import {
  UnevenShouldersRightHigher,
  UnevenHipsRightHigher,
  Scoliosis,
  BowKnees,
  KnockKnees,
  ForwardHead,
  RoundedShoulders,
  Kyphosis,
  Lordosis,
  AnteriorPelvicTilt,
  PosteriorPelvicTilt,
  FlatBack,
  KneesHyperExtrntion,
  SwayBack,
  TightHamestring,
  WingedScapula,
} from "../svgIcons/problems/ProblemIconComponent";
import { LinearGradient } from "expo-linear-gradient";

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

const iconMapping = {
  "Bow Legs (Genu Varum)": BowKnees,
  "Anterior Pelvic Tilt": AnteriorPelvicTilt, // Adjust as needed
  "Forward Head Posture": ForwardHead,
  "Hyperextension of the Knee": KneesHyperExtrntion, // Adjust as needed
  "Knock Knees": KnockKnees,
  Kyphosis: Kyphosis,
  Lordosis: Lordosis,
  "Posterior Pelvic Tilt": PosteriorPelvicTilt, // Adjust as needed
  "Rounded Shoulders": RoundedShoulders,
  Scoliosis: Scoliosis,
  "Flat Back (Straight Back)": FlatBack, // Adjust as needed
  "Sway Back": SwayBack, // Adjust as needed
  "Tight Hamstrings": TightHamestring, // Adjust as needed
  "Uneven Hips": UnevenHipsRightHigher, // Default to right
  "Uneven Shoulders": UnevenShouldersRightHigher, // Default to right
  "Winged Scapula": WingedScapula, // Adjust as needed
};

const ProblemItem: React.FC<ProblemItemProps> = ({ item, onPress }) => {
  const problemColor = ProblemColors[item.name] || "#0CA7BD"; // Default to main blue
  const backgroundColor = `${problemColor}20`; // Add opacity (20% in hex)
  const problemImage = problemImages[item.name as keyof typeof problemImages];
  const IconComponent = iconMapping[item.name as keyof typeof iconMapping];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.4}
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={[`${problemColor}15`, `${problemColor}05`]}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.imageContainer}>
            <Image source={problemImage} style={styles.image} />
            <View style={styles.iconBadge}>
              {IconComponent && (
                <IconComponent
                  color={problemColor}
                  backgroundColor="transparent"
                  // size={28}
                />
              )}
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.problemName, { color: problemColor }]}>
              {item.name}
            </Text>
            <View
              style={[styles.colorIndicator, { backgroundColor: problemColor }]}
            />
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: "90%",
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 8,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: "transparent",
  },
  gradientBackground: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  iconBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textContainer: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  problemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
  },
  colorIndicator: {
    height: 3,
    width: "40%",
    alignSelf: "center",
    borderRadius: 2,
    marginTop: 4,
  },
});

export default ProblemItem;
