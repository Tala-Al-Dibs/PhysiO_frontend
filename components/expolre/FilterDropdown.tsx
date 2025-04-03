import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface FilterDropdownProps {
  isDropdownVisible: boolean;
  onToggleDropdown: () => void;
  onShowAll: () => void;
  onFilterByLocation: () => void;
  onSortByPrice: () => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  isDropdownVisible,
  onToggleDropdown,
  onShowAll,
  onFilterByLocation,
  onSortByPrice,
}) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isDropdownVisible ? 1 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [isDropdownVisible]);

  const dropdownTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  const dropdownOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleFilterByLocation = () => {
    onFilterByLocation();
    onToggleDropdown();
  };

  const handleSortByPrice = () => {
    onSortByPrice();
    onToggleDropdown();
  };

  const handleShowAll = () => {
    onShowAll();
    onToggleDropdown();
  };

  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={styles.filterIcon}
        onPress={onToggleDropdown}
        activeOpacity={0.7}
      >
        <Feather name="sliders" size={18} color="#000" />
      </TouchableOpacity>

      {isDropdownVisible && (
        <Animated.View
          style={[
            styles.dropdown,
            {
              opacity: dropdownOpacity,
              transform: [{ translateY: dropdownTranslateY }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.dropdownOption}
            onPress={handleShowAll}
            activeOpacity={0.7}
          >
            <Feather
              name="list"
              size={16}
              color="#333"
              style={styles.optionIcon}
            />
            <Text style={styles.dropdownOptionText}>Show All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dropdownOption}
            onPress={handleFilterByLocation}
            activeOpacity={0.7}
          >
            <Feather
              name="map-pin"
              size={16}
              color="#333"
              style={styles.optionIcon}
            />
            <Text style={styles.dropdownOptionText}>Location</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dropdownOption}
            onPress={handleSortByPrice}
            activeOpacity={0.7}
          >
            <Feather
              name="dollar-sign"
              size={16}
              color="#333"
              style={styles.optionIcon}
            />
            <Text style={styles.dropdownOptionText}>Price (Low to High)</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    marginBottom: 16,
    position: "relative",
  },
  filterIcon: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdown: {
    position: "absolute",
    top: 50,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 1,
    width: 200,
  },
  dropdownOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownOptionText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 12,
  },
  optionIcon: {
    marginRight: 8,
  },
});

export default FilterDropdown;
