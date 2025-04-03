import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Physiotherapist } from "@/app/types/types";
import { router } from "expo-router";

interface PhysiotherapistItemProps {
  item: Physiotherapist;
  onPress: () => void;
}

const getLocationString = (location: string): string => {
  switch (location) {
    case "BETHLEHEM":
      return "Bethlehem";
    case "RAMALLAH":
      return "Ramallah";
    case "NABLUS":
      return "Nablus";
    case "JENIN":
      return "Jenin";
    case "TULKAREM":
      return "Tulkarem";
    case "QALQILIA":
      return "Qalqilia";
    case "JERICHO":
      return "Jericho";
    case "HEBRON":
      return "Hebron";
    case "GAZA":
      return "Gaza";
    case "JERUSALEM":
      return "Jerusalem";
    default:
      return "Unknown Location";
  }
};

const PhysiotherapistItem: React.FC<PhysiotherapistItemProps> = ({
  item,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.physioItem}
      onPress={() => {
        onPress();
        router.push({
          pathname: "/PhysiotherapistDetails",
          params: { physiotherapistID: item.physiotherapistID.toString() }, // Ensure ID is a string
        });
      }}
    >
      <View style={styles.physioImageContainer}>
        {item.image ? (
          <Image
            source={{ uri: item.image.url }}
            style={styles.physioImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Feather name="user" size={40} color="#666" />
          </View>
        )}
      </View>
      <View style={styles.physioInfoContainer}>
        <Text style={styles.physioName}>{item.clinicName}</Text>
        <Text style={styles.physioLocation}>
          {getLocationString(item.location)}
        </Text>
        <Text style={styles.physioPrice}>Price: ${item.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  physioItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 120,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  physioImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 16,
  },
  physioImage: {
    width: "100%",
    height: "100%",
  },
  physioInfoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  physioName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 6,
  },
  physioLocation: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  physioPrice: {
    fontSize: 14,
    color: "#27ae60",
    fontWeight: "500",
  },
  placeholderContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
    borderRadius: 12,
  },
});

export default PhysiotherapistItem;
