import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";

interface PhysioHeaderProps {
  title: string;
  onBackPress: () => void;
  onFilterPress: () => void;
  searchQuery: string;
  onSearchChange: (text: string) => void;
}

const PhysioHeader: React.FC<PhysioHeaderProps> = ({
  title,
  onBackPress,
  onFilterPress,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <ImageBackground
      source={require("../../assets/images/progress-backgroundd.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(12, 167, 189, 0.4)", "rgba(12, 188, 212, 0.4)"]}
        style={styles.gradientOverlay}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
            <MaterialIcons name="keyboard-arrow-left" size={35} color="white" />
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={18}
              color="white"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search clinics..."
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={searchQuery}
              onChangeText={onSearchChange}
            />
          </View>

          <TouchableOpacity onPress={onFilterPress} style={styles.iconButton}>
            <FontAwesome name="sliders" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.headerTitle}>{title}</Text>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    aspectRatio: 2.5,
  },
  gradientOverlay: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  iconButton: {
    padding: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },
});

export default PhysioHeader;
