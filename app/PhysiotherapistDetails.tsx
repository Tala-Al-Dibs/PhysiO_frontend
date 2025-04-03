import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import Schedule from "@/components/Physiotherapists/Schedule";
import DetailsContainer from "@/components/Physiotherapists/DetailsContainer";
import { Physiotherapist } from "@/.expo/types/types";
import { LinearGradient } from "expo-linear-gradient";

const API_URL = "http://192.168.108.180:8080/api";
const BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJub3VyMiIsImlhdCI6MTc0MzY3MDk3NiwiZXhwIjoxNzQzNzU3Mzc2fQ.zoEWR_Mq6nPVDr7Bbjf0fFfz8i3H5IJRf4pMTqDw8fY";

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
