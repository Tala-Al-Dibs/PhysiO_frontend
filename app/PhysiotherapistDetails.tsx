import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import Schedule from "@/components/Physiotherapists/Schedule";
import DetailsContainer from "@/components/Physiotherapists/DetailsContainer";
import { Physiotherapist } from "@/components/expolre/types/types";
import { LinearGradient } from "expo-linear-gradient";
import { SPRINGPORT8080, getCurrentToken } from "@/constants/apiConfig";

const API_URL = SPRINGPORT8080 + "/api";

export default function PhysiotherapistDetails() {
  const { physiotherapistID } = useLocalSearchParams<{
    physiotherapistID: string;
  }>();
  const navigation = useNavigation();
  const [physiotherapist, setPhysiotherapist] =
    useState<Physiotherapist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bearerToken, setBearerToken] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await getCurrentToken();
        setBearerToken(token);
      } catch (error) {
        console.error("Error initializing auth:", error);
        setError("Failed to initialize authentication");
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    const fetchPhysiotherapistDetails = async () => {
      if (!bearerToken || !physiotherapistID) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch physiotherapist details
        const response = await fetch(
          `${SPRINGPORT8080}/api/physiotherapists/${physiotherapistID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch physiotherapist: ${response.status}`
          );
        }

        const data = await response.json();

        // Fetch working hours
        const workingHoursResponse = await fetch(
          `${SPRINGPORT8080}/api/physiotherapists/${physiotherapistID}/working-hours`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );

        if (!workingHoursResponse.ok) {
          throw new Error(
            `Failed to fetch working hours: ${workingHoursResponse.status}`
          );
        }

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
  }, [physiotherapistID, bearerToken, navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#000000"
          style={{ paddingTop: 50 }}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!physiotherapist || !physiotherapist.workingHours) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        {physiotherapist.image && (
          <>
            <Image
              source={{ uri: physiotherapist.image.url }}
              style={styles.backgroundImage}
            />
            <LinearGradient
              colors={["transparent", "rgba(255, 255, 255, 0.7)", "white"]}
              style={styles.gradientOverlay}
            />
          </>
        )}
      </View>

      <TouchableOpacity
        style={styles.backArrow}
        onPress={() => navigation.goBack()}
      >
        <Feather name="chevron-left" size={40} color="#000" />
      </TouchableOpacity>

      <View style={styles.circularImageContainer}>
        {physiotherapist.image ? (
          <Image
            source={{ uri: physiotherapist.image.url }}
            style={styles.image}
          />
        ) : (
          <Feather name="user" size={80} color="#666" />
        )}
      </View>

      <Text style={styles.name}>{physiotherapist.clinicName || "N/A"}</Text>
      <DetailsContainer physiotherapist={physiotherapist} />
      <Schedule WorkingHours={physiotherapist.workingHours} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 5,
    backgroundColor: "#fff",
  },
  gradientOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },

  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "30%",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    overflow: "hidden",
    opacity: 0.4,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  backArrow: {
    position: "absolute",
    top: 60,
    left: 10,
    zIndex: 1,
  },
  circularImageContainer: {
    position: "absolute",
    top: "15%",
    alignSelf: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
    paddingTop: "83%",
  },
  errorText: {
    fontSize: 16,
    color: "#ff0000",
    textAlign: "center",
  },
});
