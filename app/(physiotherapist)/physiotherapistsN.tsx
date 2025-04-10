import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Linking,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { SPRINGPORT8080, TOKEN, USERID } from "@/constants/apiConfig";
import PhysioHeader from "@/components/Physiotherapists/physiotherapistsHeader";
import FilterModal from "@/components/Physiotherapists/FilterModal";


interface Physiotherapist {
  physiotherapistID: number;
  clinicName: string;
  phonenumber: number;
  price: number;
  address: string;
  addressLink: string;
  location: string;
  image: {
    id: number;
    type: string;
    name: string;
    url: string;
  };
}

export default function PhysiotherapistsN() {
  const navigation = useNavigation();
  const router = useRouter();
  const [physiotherapists, setPhysiotherapists] = useState<Physiotherapist[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    sortBy: "default",
    maxPrice: 500,
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const fetchPhysiotherapists = async () => {
      try {
        const response = await fetch(
          `${SPRINGPORT8080}/api/physiotherapists/user/${USERID}/location`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              Accept: "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPhysiotherapists(data);
      } catch (error) {
        console.error("Error fetching physiotherapists:", error);
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPhysiotherapists();
  }, []);

  const applyFilters = () => {
    let filtered = [...physiotherapists];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.clinicName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price filter
    filtered = filtered.filter((p) => p.price <= filters.maxPrice);

    // Apply sorting
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.clinicName.localeCompare(b.clinicName));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredPhysiotherapists = applyFilters();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0CA7BD" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <PhysioHeader
        title="Physiotherapists Near Me"
        onBackPress={() => router.back()}
        onFilterPress={() => setFilterModalVisible(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onFilterChange={setFilters}
      />

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredPhysiotherapists.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={48} color="#0CA7BD" />
            <Text style={styles.emptyText}>No clinics found</Text>
            <Text style={styles.emptySubText}>Try adjusting your filters</Text>
          </View>
        ) : (
          filteredPhysiotherapists.map((physio) => (
            // Update the card component in your render function
            <View key={physio.physiotherapistID} style={styles.physioCard}>
              <View style={styles.cardHeader}>
                <Image
                  source={{ uri: physio.image.url }}
                  style={styles.physioImage}
                  resizeMode="cover"
                />
                <View style={styles.cardHeaderText}>
                  <Text style={styles.clinicName}>{physio.clinicName}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>${physio.price}</Text>
                    <Text style={styles.sessionText}>/session</Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.detailRow}>
                  <MaterialIcons name="location-on" size={16} color="#0CA7BD" />
                  <Text style={styles.detailText} numberOfLines={1}>
                    {physio.address}
                  </Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.callButton]}
                    onPress={() => Linking.openURL(`tel:${physio.phonenumber}`)}
                  >
                    <Ionicons name="call" size={16} color="white" />
                    <Text style={styles.actionButtonText}>Call</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.directionsButton]}
                    onPress={() => Linking.openURL(physio.addressLink)}
                  >
                    <MaterialIcons name="directions" size={16} color="white" />
                    <Text style={styles.actionButtonText}>Directions</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff4757",
    textAlign: "center",
  },
  scrollContainer: {
    // padding: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#064D57",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  // Update your physioCard styles in the Stylesheet:
  physioCard: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    marginHorizontal: 20,
    shadowColor: "#064D57", // Using your darker main color for shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(6, 77, 87, 0.1)", // Subtle border using your darker color
  },
  cardHeader: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "rgba(12, 167, 189, 0.05)", // Very light tint of your main color
    borderBottomWidth: 1,
    borderBottomColor: "rgba(6, 77, 87, 0.05)",
  },
  physioImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(6, 77, 87, 0.1)",
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  clinicName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#064D57", // Using your darker main color
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0CA7BD", // Your main color
  },
  sessionText: {
    fontSize: 12,
    color: "rgba(6, 77, 87, 0.6)", // Muted version of your darker color
    marginLeft: 4,
  },
  cardBody: {
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: "rgba(6, 77, 87, 0.8)", // Muted version of your darker color
    marginLeft: 8,
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  callButton: {
    backgroundColor: "#0CA7BD", // Using your main color instead of green
    marginRight: 12,
  },
  directionsButton: {
    backgroundColor: "#F48634", // Using your secondary orange color
  },
  actionButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 14,
  },
});
