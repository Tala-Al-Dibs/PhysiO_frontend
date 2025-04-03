import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { OutsidePrize } from "../svgIcons/prize/PrizeIcons";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const GoToPrize = () => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push("../(prize)/prizes")}
      style={styles.container}
    >
      <View style={styles.titleContainer}>
        <View style={styles.iconShadow}>
          <OutsidePrize />
        </View>
        <Text style={styles.prizeText}>See your Prizes</Text>
      </View>
      <MaterialIcons name="keyboard-arrow-right" size={30} color="#FFAC33" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    height: 66,
    backgroundColor: "rgba(12, 167, 189, 0.2)",
    padding: 20,
    marginVertical: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Ensure vertical alignment
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  prizeText: {
    color: "#FFAC33",
    fontSize: 18,
    fontWeight: "bold",
  },
  iconShadow: {
    shadowColor: "#FFAC33", // Match your text color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5, // For Android
    // Add padding if needed to prevent shadow clipping
    padding: 5,
  },
});

export default GoToPrize;
