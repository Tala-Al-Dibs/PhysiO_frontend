import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface TabsProps {
  activeTab: "problems" | "physiotherapists";
  onTabChange: (tab: "problems" | "physiotherapists") => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "problems" && styles.activeTab]}
        onPress={() => onTabChange("problems")}
      >
        <Text style={styles.tabText}>Problems</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === "physiotherapists" && styles.activeTab,
        ]}
        onPress={() => onTabChange("physiotherapists")}
      >
        <Text style={styles.tabText}>Physiotherapists</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#007bff",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default Tabs;
