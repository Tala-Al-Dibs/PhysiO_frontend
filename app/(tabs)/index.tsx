
import {
  Image,
  StyleSheet,

  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import ProgressRing from "@/components/progress/ProgressRing";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SPRINGPORT8080, TOKEN, USERID } from "@/constants/apiConfig";
import SideList from "@/components/home/sideList";
import IndividualProblemProgress from "@/components/progress/IndividualProblemProgress";

interface User {
  userID: number;
  username: string;
  password: string;
}


export default function HomeScreen() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const today = new Date();
  const route = useRouter();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch(`${SPRINGPORT8080}/api/users/${USERID}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: User = await response.json();
        setUsername(data.username);
      } catch (error) {
        console.error("Error fetching username:", error);
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
        // Fallback to a default username if API fails
        setUsername("User");
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return { message: "Good morning", icon: "sunny" as const };
    } else if (hour >= 12 && hour < 18) {
      return { message: "Good afternoon", icon: "partly-sunny" as const };
    } else {
      return { message: "Good evening", icon: "moon" as const };
    }
  };

  const { message, icon } = getGreeting();


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

    <ScrollView>
      <View
        style={{
          paddingTop: hp(8),
          paddingHorizontal: wp(5),
          backgroundColor: "white",
        }}
        className="flex-1 gap-1"
      >
        <View style={styles.header}>
          <View style={styles.topContainer}>
            <View style={styles.greetingContainer}>
              <Text
                style={{ fontSize: 20, fontWeight: "light", color: "#6C6C6C" }}
              >
                {message}!
              </Text>
              <Ionicons name={icon} size={20} color="#FFA500" />
            </View>
            <Text style={{ fontSize: 40, fontWeight: "600", color: "#042A30" }}>
              {username}
            </Text>
          </View>
          <SideList />
        </View>

        <View style={styles.container}>
          <View style={{ left: 15 }}>
            <Text style={styles.contentText}>
              Today is {today.toDateString()}
            </Text>
            <ProgressRing type={"home"} />
          </View>
        </View>
        <IndividualProblemProgress />
        <TouchableOpacity
          style={styles.PhysiotherapContainer}
          onPress={() => route.push("./(physiotherapist)/physiotherapistsN")}
        >
          <Image
            source={require("../../assets/images/FindPhysioth.png")}
            resizeMode="contain"
            style={{ height: hp(40), aspectRatio: 1 }}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",

    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  errorText: {
    fontSize: 16,
    color: "#ff4757",
    textAlign: "center",
  },
  greetingContainer: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  topContainer: {
    flexDirection: "column",
    gap: 10,
  },
  container: {
    alignItems: "center",
    marginTop: 30,
  },
  contentText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "transparent",
  },
  PhysiotherapContainer: {
    alignItems: "center",
    marginTop: -60,
  },
});
