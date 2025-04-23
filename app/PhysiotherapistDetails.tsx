import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import Schedule from "@/components/Physiotherapists/Schedule";
import DetailsContainer from "@/components/Physiotherapists/DetailsContainer";
import { Physiotherapist } from "@/components/expolre/types/types";
import { LinearGradient } from "expo-linear-gradient";
import { SPRINGPORT8080, TOKEN } from "@/constants/apiConfig";

const API_URL = SPRINGPORT8080 + "/api";
const BEARER_TOKEN = TOKEN;

export default function PhysiotherapistDetails() {
  const { physiotherapistID } = useLocalSearchParams<{
    physiotherapistID: string;
  }>();
  const navigation = useNavigation();
  const [physiotherapist, setPhysiotherapist] =
    useState<Physiotherapist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    const fetchPhysiotherapistDetails = async () => {
      try {
        const response = await fetch(
          `${API_URL}/physiotherapists/${physiotherapistID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();

        const workingHoursResponse = await fetch(
          `${API_URL}/physiotherapists/${physiotherapistID}/working-hours`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        );

        if (!workingHoursResponse.ok)
          throw new Error(`HTTP error! Status: ${workingHoursResponse.status}`);

        const workingHoursData = await workingHoursResponse.json();
        setPhysiotherapist({ ...data, workingHours: workingHoursData });
      } catch (error) {
        console.error("Error fetching physiotherapist details:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPhysiotherapistDetails();
  }, [physiotherapistID]);

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
        <Feather name="alert-circle" size={40} color="#FF8B33" />
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setLoading(true)}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!physiotherapist || !physiotherapist.workingHours) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="user-x" size={40} color="#FF8B33" />
        <Text style={styles.errorText}>No data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section with Image */}
      <View style={styles.headerContainer}>
        {physiotherapist.image && (
          <ImageBackground
            source={{ uri: physiotherapist.image.url }}
            style={styles.headerBackground}
            resizeMode="cover"
          >
            <LinearGradient
              colors={["rgba(6, 77, 87, 0.7)", "rgba(6, 77, 87, 0.3)", "white"]}
              style={styles.gradientOverlay}
            />

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Feather name="chevron-left" size={28} color="white" />
            </TouchableOpacity>
          </ImageBackground>
        )}
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          {physiotherapist.image ? (
            <Image
              source={{ uri: physiotherapist.image.url }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Feather name="user" size={60} color="#0CA7BD" />
            </View>
          )}
        </View>

        <Text style={styles.clinicName}>
          {physiotherapist.clinicName || "N/A"}
        </Text>
        <Text style={styles.locationText}>
          <Feather name="map-pin" size={16} color="#064D57" />
          {` ${physiotherapist.location || "Location not specified"}`}
        </Text>
      </View>

      {/* Details Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Clinic Information</Text>
        <DetailsContainer physiotherapist={physiotherapist} />
      </View>

      {/* Schedule Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Schedule</Text>
        <Schedule WorkingHours={physiotherapist.workingHours} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#383838",
    marginTop: 20,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#0CA7BD",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  headerContainer: {
    height: 250,
    width: "100%",
    overflow: "hidden",
  },
  headerBackground: {
    flex: 1,
    justifyContent: "flex-start",
  },
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 8,
  },
  profileSection: {
    alignItems: "center",
    marginTop: -75,
    marginBottom: 20,
  },
  profileImageContainer: {
    shadowColor: "#064D57",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: "white",
  },
  profilePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: "white",
    backgroundColor: "#e1f7fa",
    justifyContent: "center",
    alignItems: "center",
  },
  clinicName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#064D57",
    marginTop: 15,
    textAlign: "center",
  },
  locationText: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#064D57",
    marginBottom: 15,
    paddingLeft: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#FF8B33",
  },
  bookButton: {
    backgroundColor: "#0CA7BD",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 30,
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: "#064D57",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  bookButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
