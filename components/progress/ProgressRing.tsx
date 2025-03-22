import { View, Text, useWindowDimensions, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { ProgressChart } from "react-native-chart-kit";
import { SPRINGPORT8080, TOKEN, USERID } from "@/constants/apiConfig";
import LottieView from "lottie-react-native";
import Progress from "../annimations/Progress";

const token = TOKEN;
const userID = USERID;
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

const ProgressRing = () => {
  const { width: screenWidth } = useWindowDimensions();
  const today = new Date();
  const [chartData, setChartData] = useState<{
    labels: string[];
    data: number[];
    colors: string[];
  }>({
    labels: [],
    data: [],
    colors: [],
  });

  useEffect(() => {
    const fetchUserProblemsAndProgress = async () => {
      try {
        const problemsResponse = await fetch(
          `${api_problem}/${userID}/problems`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!problemsResponse.ok) throw new Error("Failed to fetch problems");

        const problems = (await problemsResponse.json()) as Problem[];

        const problemNames = problems.map((problem) => problem.name);
        const problemIDs = problems.map((problem) => problem.problemID);

        const progressResponse = await fetch(
          `${api_progress}/${userID}/daily`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!progressResponse.ok) throw new Error("Failed to fetch progress");

        const progressData = (await progressResponse.json()) as ProgressEntry[];

        const progressMap: Record<number, number> = {};
        progressData.forEach((entry) => {
          progressMap[entry.problem.problemID] = entry.percentag / 5; // Normalize percentage
        });

        const progressValues = problemIDs.map((id) => progressMap[id] || 0);

        setChartData({
          labels: problemNames as string[],
          data: progressValues as number[],
          colors: [
            "#FFD55A",
            "#0A8697",
            "#FFAC33",
            "#0CA7BD",
            "#FFD55A",
            "#0A8697",
            "#FFAC33",
            "#0CA7BD",
            "#FFD55A",
            "#0A8697",
            "#FFAC33",
            "#0CA7BD",
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserProblemsAndProgress();
  }, [userID, token]);

  return (
    <View style={styles.container}>
      {/* {chartData.labels.length === 0 ? ( */}
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Scan your posture to start your progress
        </Text>
        <Progress size={10} />
      </View>
      {/* Chart Container */}
      {/* Custom Legend */}
      {/* ) : (
        <>
          **
          <View style={styles.chartContainer}>
            <ProgressChart
              data={chartData}
              width={screenWidth * 0.6} // Use 60% of the screen width for the chart
              height={220}
              strokeWidth={16}
              radius={24}
              chartConfig={{
                backgroundColor: "#f2f2f2",
                backgroundGradientFrom: "#f2f2f2",
                backgroundGradientTo: "#f2f2f2",
                color: (opacity) => `rgba(255, 255, 255, ${opacity})`,
                propsForLabels: {
                  fill: "transparent",
                },
              }}
              hideLegend={true}
              withCustomBarColorFromData
            />
          </View>

          **
          <View
            style={[
              styles.legendContainer,
              { gap: 50, justifyContent: "center" },
            ]}
          >
            <Text
              style={{ color: "#064D57", fontSize: 18, fontWeight: "bold" }}
            >
              {today.toDateString()}
            </Text>
            <View style={styles.legendContainer}>
              {chartData.labels.map((label, index) => (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      {
                        backgroundColor: [
                          "#FFD55A",
                          "#0A8697",
                          "#FFAC33",
                          "#0CA7BD",
                        ][index % 4],
                      },
                    ]}
                  />
                  <Text style={styles.legendText}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      )} */}
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
    height: 220,
  },
  emptyText: {
    fontSize: 16,
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
