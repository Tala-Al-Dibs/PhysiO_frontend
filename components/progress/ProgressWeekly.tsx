import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SPRINGPORT8080, TOKEN, USERID } from "@/constants/apiConfig";
import { ProblemColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const ProgressWeekly = () => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const problemColors = ProblemColors;
  const [problems, setProblems] = useState<string[]>([]);
  const [allProgressData, setAllProgressData] = useState<any[]>([]);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [currentWeekData, setCurrentWeekData] = useState<{
    [key: string]: number[];
  }>({});

  // Fetch user problems
  useEffect(() => {
    const fetchUserProblems = async () => {
      try {
        const response = await fetch(
          `${SPRINGPORT8080}/api/problems/user/${USERID}/problems`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch user problems");

        const data = await response.json();
        const problemNames = data.map((problem: any) => problem.name);
        setProblems(problemNames);
      } catch (error) {
        console.error("Error fetching user problems:", error);
      }
    };

    fetchUserProblems();
  }, []);

  // Fetch all progress data
  useEffect(() => {
    const fetchAllProgress = async () => {
      try {
        const response = await fetch(
          `${SPRINGPORT8080}/api/progresses/user/${USERID}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch progress data");

        const data = await response.json();
        setAllProgressData(data);
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };

    if (problems.length > 0) {
      fetchAllProgress();
    }
  }, [problems]);

  // Calculate current week data based on offset
  useEffect(() => {
    if (allProgressData.length === 0 || problems.length === 0) return;

    // Calculate start and end of the target week
    const today = new Date();
    const startOfTargetWeek = new Date(today);
    startOfTargetWeek.setDate(
      today.getDate() - today.getDay() - currentWeekOffset * 7
    );
    startOfTargetWeek.setHours(0, 0, 0, 0);

    const endOfTargetWeek = new Date(startOfTargetWeek);
    endOfTargetWeek.setDate(startOfTargetWeek.getDate() + 6);
    endOfTargetWeek.setHours(23, 59, 59, 999);

    // Initialize empty progress data structure
    const weekData: { [key: string]: number[] } = {};
    daysOfWeek.forEach((day) => {
      weekData[day] = Array(problems.length).fill(0);
    });

    // Filter and process progress entries for the target week
    allProgressData.forEach((progress) => {
      const progressDate = new Date(progress.timestamp);
      if (
        progressDate >= startOfTargetWeek &&
        progressDate <= endOfTargetWeek
      ) {
        const dayOfWeek = daysOfWeek[progressDate.getDay()];
        const problemIndex = problems.indexOf(progress.problem.name);
        if (problemIndex !== -1) {
          // Keep the highest percentage for each problem on each day
          if (progress.percentag > weekData[dayOfWeek][problemIndex]) {
            weekData[dayOfWeek][problemIndex] = progress.percentag;
          }
        }
      }
    });

    setCurrentWeekData(weekData);
  }, [allProgressData, currentWeekOffset, problems]);

  const lengthX = problems.length > 0 ? 50 / problems.length : 0;

  // Get dates for the current week (with offset)
  const getCurrentWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(
      today.getDate() - today.getDay() - currentWeekOffset * 7
    );

    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return {
        date: date.getDate(),
        isToday: currentWeekOffset === 0 && date.getDate() === today.getDate(),
      };
    });
  };

  const weekDates = getCurrentWeekDates();
  const isCurrentWeek = currentWeekOffset === 0;

  return (
    <View style={styles.container}>
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          onPress={() => setCurrentWeekOffset((prev) => prev + 1)}
          style={styles.arrowButton}
        >
          <Ionicons name="chevron-back" size={24} color="#063E46" />
        </TouchableOpacity>

        <View style={styles.weekIndicator}>
          <Text style={styles.weekText}>
            {currentWeekOffset === 0
              ? "This Week"
              : currentWeekOffset === 1
              ? "Last Week"
              : `${currentWeekOffset} weeks ago`}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setCurrentWeekOffset((prev) => Math.max(0, prev - 1))}
          style={styles.arrowButton}
          disabled={isCurrentWeek}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={isCurrentWeek ? "#CCCCCC" : "#063E46"}
          />
        </TouchableOpacity>
      </View>

      {/* Dates and Days */}
      <View style={styles.row}>
        {weekDates.map(({ date, isToday }, index) => (
          <View key={index} style={styles.dateDayContainer}>
            {/* Vertical Bars for Problems */}
            <View style={styles.barsContainer}>
              {problems.map((problem, problemIndex) => (
                <View
                  key={problemIndex}
                  style={[
                    styles.bar,
                    {
                      height:
                        currentWeekData[daysOfWeek[index]]?.[problemIndex] *
                          lengthX || 0,
                      backgroundColor: problemColors[problem] || "#CCCCCC",
                    },
                  ]}
                />
              ))}
            </View>

            {/* Date */}
            <Text
              style={[
                styles.dateText,
                isToday && { fontWeight: "bold", color: "#0CA7BD" },
              ]}
            >
              {date}
            </Text>
            {/* Day */}
            <Text style={styles.dayText}>{daysOfWeek[index]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#f2f2f2",
    // width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // paddingTop: 10,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    marginBottom: 150,
  },
  arrowButton: {
    // padding: 10,
  },
  weekIndicator: {
    flex: 1,
    alignItems: "center",
  },
  weekText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#063E46",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
  },
  dateDayContainer: {
    alignItems: "center",
  },
  barsContainer: {
    flexDirection: "column-reverse",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 8,
    height: 100,
  },
  bar: {
    width: 11,
    marginVertical: 2,
    borderRadius: 10,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#6C6C6C",
  },
  dateText: {
    fontSize: 20,
    color: "#063E46",
    fontWeight: "500",
    marginBottom: 4,
  },
});

export default ProgressWeekly;
