import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import ExploreIcon from "../svgIcons/bottomBar/ExploreIcon";
import homeIcon from "../svgIcons/bottomBar/HomeIcon";
import ProfileIcon from "../svgIcons/bottomBar/ProfileIcon";
import ProgressIcon from "../svgIcons/bottomBar/ProgressIcon";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import IconComponent from "../svgIcons/problems/IconComponent";

// Minimalist explanations for problems without ":"
const explanations: Record<string, string> = {
  Scoliosis: 'An "S" shaped spine.',
  Kyphosis: "Excessive forward rounding of the back.",
  "Bow Knees":
    "Or Genu varum, one or both of the legs curve outward at the knees.",
  "Knock knees":
    "Or genu valgum, the knees tilt inward while the ankles remain spaced apart.",
  "Forward Head":
    "Or Text Neck, A head that is positioned forward of the shoulders.",
  "Rounded Shoulders": "shoulders are out of proper alignment with the spine.",
};

const ProblemsListCards = ({ problemList }: { problemList: string[] }) => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {problemList.map((problem, index) => {
        // const IconComponent = iconMapping[problem] || ProgressIcon;
        const splitProblem = problem.split(":");
        const problemSlug = encodeURIComponent(problem);

        return (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "../(problem)/problem",
                params: {
                  problem: splitProblem[0], // Send only the problem name
                },
              })
            }
          >
            {/* Left Section (Icon + Text) */}
            <View style={styles.leftSection}>
              <IconComponent problem={problem} />
              <View style={styles.textContainer}>
                <Text style={styles.problemText}>{splitProblem[0]}</Text>
                <Text style={styles.subText}>
                  {splitProblem.length > 1
                    ? splitProblem[1].trim()
                    : explanations[problem] || "No description available."}
                </Text>
              </View>
            </View>

            {/* Right Section (Arrow) */}
            <MaterialIcons
              name="keyboard-arrow-right"
              size={30}
              color="rgba(12, 167, 189, 0.59)"
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ProblemsListCards;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center", // Align to the top so text wraps nicely
    backgroundColor: "rgba(56, 56, 56, 0.1)",
    padding: 15,
    marginVertical: 8,
    borderRadius: 15,
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1, // Allows text to expand and wrap
    marginLeft: 10,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Take up remaining space, pushing arrow to the right
  },
  arrowIcon: {
    alignSelf: "center", // Ensures the arrow stays centered vertically
  },
  problemText: {
    fontSize: 16,
    color: "#064D57",
    fontWeight: "bold",
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
    flexShrink: 1, // Ensures text wraps instead of overflowing
    width: 180,
  },
});
