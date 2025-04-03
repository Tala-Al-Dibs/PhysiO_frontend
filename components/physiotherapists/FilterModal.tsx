import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: {
    sortBy: string;
    maxPrice: number;
  };
  onFilterChange: (newFilters: { sortBy: string; maxPrice: number }) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onFilterChange,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Filter Options</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#064D57" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Sort By</Text>
          <View style={styles.filterOptions}>
            <TouchableOpacity
              style={[
                styles.filterOption,
                filters.sortBy === "default" && styles.activeFilter,
              ]}
              onPress={() => onFilterChange({ ...filters, sortBy: "default" })}
            >
              <Text
                style={
                  filters.sortBy === "default"
                    ? styles.activeFilterText
                    : styles.filterOptionText
                }
              >
                Default
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterOption,
                filters.sortBy === "name" && styles.activeFilter,
              ]}
              onPress={() => onFilterChange({ ...filters, sortBy: "name" })}
            >
              <Text
                style={
                  filters.sortBy === "name"
                    ? styles.activeFilterText
                    : styles.filterOptionText
                }
              >
                Name (A-Z)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterOption,
                filters.sortBy === "price-low" && styles.activeFilter,
              ]}
              onPress={() =>
                onFilterChange({ ...filters, sortBy: "price-low" })
              }
            >
              <Text
                style={
                  filters.sortBy === "price-low"
                    ? styles.activeFilterText
                    : styles.filterOptionText
                }
              >
                Price (Low-High)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterOption,
                filters.sortBy === "price-high" && styles.activeFilter,
              ]}
              onPress={() =>
                onFilterChange({ ...filters, sortBy: "price-high" })
              }
            >
              <Text
                style={
                  filters.sortBy === "price-high"
                    ? styles.activeFilterText
                    : styles.filterOptionText
                }
              >
                Price (High-Low)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>
            Max Price: ${filters.maxPrice.toFixed(0)}
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={500}
            step={10}
            value={filters.maxPrice}
            onValueChange={(value) =>
              onFilterChange({ ...filters, maxPrice: value })
            }
            minimumTrackTintColor="#0CA7BD"
            maximumTrackTintColor="#e0e0e0"
            thumbTintColor="#0CA7BD"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>$0</Text>
            <Text style={styles.sliderLabel}>$500</Text>
          </View>
        </View>

        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              onFilterChange({
                sortBy: "default",
                maxPrice: 500,
              });
            }}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={onClose}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#064D57",
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  activeFilter: {
    backgroundColor: "#0CA7BD",
  },
  filterOptionText: {
    color: "#333",
    fontSize: 14,
  },
  activeFilterText: {
    color: "white",
    fontSize: 14,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -10,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#666",
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  resetButton: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  resetButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  applyButton: {
    backgroundColor: "#0CA7BD",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  applyButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default FilterModal;
