import { View, Text, ImageBackground, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SPRINGPORT8080, getCurrentToken, getCurrentUserId } from "@/constants/apiConfig";

type IconName = keyof typeof Ionicons.glyphMap;

const motivationalQuotes: { text: string; icon: IconName; color: string }[] = [
  {
    text: "Consistency is the key to progress!",
    icon: "repeat", // ✅ Valid
    color: "#0CA7BD",
  },
  {
    text: "Great posture starts with awareness",
    icon: "eye", // ✅ Valid
    color: "#FFAC33",
  },
  {
    text: "Every correction brings you closer to perfect posture",
    icon: "trending-up", // ✅ Valid
    color: "#FFD55A",
  },
  {
    text: "Your dedication is shaping a healthier you",
    icon: "heart", // ✅ Valid
    color: "#0A8697",
  },
];

const ProgressHeader = ({ style }: { style?: object }) => {
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const [streak, setStreak] = useState(0);
  const [currentDayProgress, setCurrentDayProgress] = useState(false);
  const [bearerToken, setBearerToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

    // Initialize auth
    useEffect(() => {
      const initializeAuth = async () => {
        try {
          const token = await getCurrentToken();
          const id = await getCurrentUserId();
          setBearerToken(token);
          setUserId(Number(id));
        } catch (error) {
          console.error("Error initializing auth:", error);
        }
      };
      initializeAuth();
    }, []);

  // Fetch streak data
  useEffect(() => {
    const fetchStreakData = async () => {
      try {
        if (!bearerToken || !userId) return;

         // Check if user has progress today
        const todayResponse = await fetch(
          `${SPRINGPORT8080}/api/progresses/${userId}/daily`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );

        if (!todayResponse.ok) {
          throw new Error("Failed to fetch today's progress");
        }

        const todayData = await todayResponse.json();
        setCurrentDayProgress(todayData.length > 0);

         // Get all progress dates this month
        const monthResponse = await fetch(
          `${SPRINGPORT8080}/api/progresses/${userId}/month`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        
        if (!monthResponse.ok) {
          throw new Error("Failed to fetch monthly progress");
        }

        const progressDates = await monthResponse.json();

        // Calculate current streak
        let currentStreak = 0;
        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        if (progressDates.includes(today)) {
          currentStreak = 1;
          let checkDate = yesterday;

          while (
            progressDates.includes(checkDate.toISOString().split("T")[0])
          ) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          }
        }

        setStreak(currentStreak);
      } catch (error) {
        console.error("Error fetching streak data:", error);
      }
    };

    fetchStreakData();

    // Rotate quotes every 8 seconds
    const quoteInterval = setInterval(() => {
      const currentIndex = motivationalQuotes.findIndex(
        (q) => q.text === currentQuote.text
      );
      const nextIndex = (currentIndex + 1) % motivationalQuotes.length;
      setCurrentQuote(motivationalQuotes[nextIndex]);
    }, 60000);

    return () => clearInterval(quoteInterval);
  }, [bearerToken, userId]); // Only run when these change

  return (
    <ImageBackground
      source={require("../../assets/images/progress-backgroundd.png")}
      style={[styles.backgroundImage, style]}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.headerText}>Your Progress Journey</Text>

        <View style={styles.streakContainer}>
          <Text style={styles.streakNumber}>{streak}</Text>
          <Text style={styles.streakLabel}>
            {currentDayProgress ? "🔥 Active streak" : "day streak"}
          </Text>
        </View>

        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>{currentQuote.text}</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    // height: 250,
    aspectRatio: 1.4,
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: "rgba(6, 62, 70, 0.5)",
    padding: 20,
    paddingTop: 0,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  streakContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  streakNumber: {
    color: "#FFD55A",
    fontSize: 42,
    fontWeight: "bold",
  },
  streakLabel: {
    color: "white",
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  quoteContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "rgba(255, 255, 255, 0.15)",
    // padding: 12,
    borderRadius: 8,
    // marginTop: 15,
  },
  quoteIcon: {
    marginRight: 10,
  },
  quoteText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    // flex: 1,
  },
});

export default ProgressHeader;
