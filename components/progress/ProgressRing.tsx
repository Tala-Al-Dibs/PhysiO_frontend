import {
  View,
  Text,
  useWindowDimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ProgressChart } from "react-native-chart-kit";
import { SPRINGPORT8080, getCurrentToken, getCurrentUserId } from "@/constants/apiConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ProblemColors } from "@/constants/Colors";
import { useRouter } from "expo-router";

const api_problem = SPRINGPORT8080 + "/api/problems";
const api_progress = SPRINGPORT8080 + "/api/progresses";

interface Problem {
  problemID: number;
  name: string;
}

interface ProgressEntry {
  problem: { problemID: number };
  percentag: number; // There's a typo here; ensure it's `percentage` in your API.
}

const ProgressRing = ({ type }: any) => {
  const { width: screenWidth } = useWindowDimensions();
  const today = new Date();
  const router = useRouter();
  const problemColors = ProblemColors;
  const [chartData, setChartData] = useState<{
    labels: string[];
    data: number[];
    colors: string[];
  }>({
    labels: [],
    data: [],
    colors: [],
  });

  const [bearerToken, setBearerToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // Initialize authentication
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

  // Function to convert hex color to RGBA with opacity
  const hexToRgba = (hex: string, opacity: number) => {
    // Remove the '#' if it's there
    hex = hex.replace("#", "");
    // Convert hex to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    // Return RGBA color
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };


  useEffect(() => {
    const fetchUserProblemsAndProgress = async () => {
      try {
        if (!bearerToken || !userId) return;

        // Fetch user problems
        const problemsResponse = await fetch(
          `${SPRINGPORT8080}/api/problems/user/${userId}/problems`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!problemsResponse.ok) {
          throw new Error(`Failed to fetch problems: ${problemsResponse.status}`);
        }

        const problems = (await problemsResponse.json()) as Problem[];
        const problemNames = problems.map((problem) => problem.name);
        const problemIDs = problems.map((problem) => problem.problemID);

        // Fetch daily progress
        const progressResponse = await fetch(
          `${SPRINGPORT8080}/api/progresses/${userId}/daily`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!progressResponse.ok) {
          throw new Error(`Failed to fetch progress: ${progressResponse.status}`);
        }

        const progressData = (await progressResponse.json()) as ProgressEntry[];

        const progressMap: Record<number, number> = {};
        progressData.forEach((entry) => {
          progressMap[entry.problem.problemID] = entry.percentag / 5; // Normalize percentage
        });

        const progressValues = problemIDs.map((id) => progressMap[id] || 0);

        const problemColorsArray = problemNames.map(
          (name) => problemColors[name] || "#000000" // Default to black if not found
        );

        setChartData({
          labels: problemNames as string[],
          data: progressValues as number[],
          colors: problemColorsArray,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserProblemsAndProgress();
  }, [bearerToken, userId]); // Run when token or userId changes

  return (
    <View style={styles.container}>
      {/* chartData.labels.length === 0 */}
      {chartData.labels.length === 0 ? (
        <View style={[styles.emptyContainer, { left: 15 }]}>
          <Text style={styles.emptyText}>
            Scan your posture to start your progress
          </Text>
          <Image
            source={require("../../assets/images/Progress-Photoroom.png")}
            style={{ height: 200, aspectRatio: 1 }}
            resizeMode="contain"
          />
        </View>
      ) : (
        <>
          {/* Chart Container */}
          <View style={styles.chartContainer}>
            <ProgressChart
              data={chartData}
              width={screenWidth * 0.6} // Use 60% of the screen width for the chart
              height={220}
              strokeWidth={16}
              radius={24}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                color: (opacity, index = 0) => {
                  // Use the index to get the corresponding color from the colors array
                  const color =
                    chartData.colors[index % chartData.colors.length];
                  // Convert the hex color to RGBA with the given opacity
                  return hexToRgba(color, opacity);
                },
                propsForLabels: {
                  fill: "transparent",
                },
              }}
              hideLegend={true}
              withCustomBarColorFromData
            />
          </View>

          {/* Custom Legend */}
          <View
            style={[
              styles.legendContainer,
              { gap: 20, justifyContent: "center" },
            ]}
          >
            {type === "progress" ? (
              <View style={{ height: 36 }}>
                <Text
                  style={{ color: "#064D57", fontSize: 18, fontWeight: "bold" }}
                >
                  {today.toDateString()}
                </Text>
              </View>
            ) : (
              <ImageBackground
                source={require("../../assets/images/progressButtonBackgroundGradient.png")}
                style={styles.backgroundImage}
                resizeMode="cover" // Adjust the resizeMode as needed
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 9,
                    paddingHorizontal: 8,
                    width: 152,
                    height: 36,
                    borderRadius: 10,
                  }}
                  onPress={() => router.push("./progress")}
                >
                  <MaterialCommunityIcons
                    name="chart-donut-variant"
                    size={18}
                    color="white"
                  />
                  <Text style={{ color: "white" }}>Detailed Insight</Text>
                </TouchableOpacity>
              </ImageBackground>
            )}
            <View style={styles.legendContainer}>
              {chartData.labels.map((label, index) => (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      {
                        backgroundColor: chartData.colors[index] || "#000000",
                      },
                    ]}
                  />
                  <Text style={styles.legendText}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    borderRadius: 10, // Match the borderRadius of the button
    overflow: "hidden", // Ensure the borderRadius is applied to the background
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#064D57",
    textAlign: "center",
  },
  chartContainer: {
    width: "60%",
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  legendContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "bold",
    flexShrink: 1,
  },
});

export default ProgressRing;
