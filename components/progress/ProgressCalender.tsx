import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SPRINGPORT8080, getCurrentToken, getCurrentUserId } from "@/constants/apiConfig";

const ProgressCalender = () => {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // Ensure consistency
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const api_progress = SPRINGPORT8080 + "/api/progresses";
  const [bearerToken, setBearerToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

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

  useEffect(() => {
    const fetchProgressDays = async () => {
      try {
    if (!bearerToken || !userId) return;

        const response = await fetch(`${api_progress}/${userId}/month`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch progress data");
        }

        const progressDays = (await response.json()) as string[]; // API returns array of dates

        let updatedMarkedDates: { [key: string]: any } = {};

        for (let i = 1; i <= 31; i++) {
          let date = new Date(today.getFullYear(), today.getMonth(), i);
          let dateString = date.toISOString().split("T")[0];

          if (progressDays.includes(dateString)) {
            updatedMarkedDates[dateString] = {
              selected: true,
              selectedColor: "#0CA7BD", // Progress days in teal
            };
          } else if (dateString === todayStr) {
            updatedMarkedDates[dateString] = {
              selected: true,
              selectedColor: "rgba(255, 215, 0, 0.3)", // Today's date in gold
            };
          } else if (date > today) {
            updatedMarkedDates[dateString] = { textColor: "black" };
          } else {
            updatedMarkedDates[dateString] = { marked: true };
          }
        }

        setMarkedDates(updatedMarkedDates);
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };

    fetchProgressDays();
  }, []);

  return (
    <View>
      <Calendar
        current={todayStr}
        markedDates={markedDates}
        theme={{
          todayTextColor: "#0CA7BD",
          arrowColor: "#0CA7BD",
          calendarBackground: "transparent",
          dayTextColor: "#333",
          textDisabledColor: "#A9A9A9",
        }}
        style={{
          backgroundColor: "transparent",
          width: wp(90),
          // height: hp(40),
        }}
      />
    </View>
  );
};

export default ProgressCalender;
