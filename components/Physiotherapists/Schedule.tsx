import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SvgXml } from "react-native-svg";
import {
  earlyClockIcon,
  lateClockIcon,
} from "@/components/svgIcons/clocks/clocks";
import { WorkingHours, DayOfWeek } from "@/components/expolre/types/types";
import { Feather } from "@expo/vector-icons";

interface ScheduleProps {
  WorkingHours: WorkingHours[];
}

const Schedule = ({ WorkingHours }: ScheduleProps) => {
  const getWorkingHoursForDay = (day: DayOfWeek) => {
    const workingDay = WorkingHours.find(
      (wh: WorkingHours) => wh.dayOfWeek.toUpperCase() === day.toUpperCase()
    );
    return workingDay
      ? `${workingDay.startTime} - ${workingDay.endTime}`
      : "Off";
  };

  return (
    <>
      <View style={styles.scheduleHeader}>
        <Feather name="calendar" size={24} color="#383838" />
        <Text style={styles.scheduleHeaderText}>Schedule</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.scheduleContainer}>
          {Object.values(DayOfWeek).map((day) => {
            const workingHours = getWorkingHoursForDay(day);
            return (
              <View
                key={day}
                style={[
                  styles.scheduleDay,
                  workingHours === "Off" && styles.offDay,
                ]}
              >
                <Text style={styles.scheduleDayText}>{day}</Text>

                {workingHours !== "Off" && (
                  <View style={styles.workingHoursContainer}>
                    <View style={styles.clockIconContainer}>
                      <SvgXml
                        xml={earlyClockIcon}
                        width={12}
                        height={12}
                        style={styles.clockIcon}
                      />
                      <Text style={styles.scheduleHoursText}>
                        {workingHours.split(" - ")[0]}
                      </Text>
                    </View>

                    <View style={styles.clockIconContainer}>
                      <SvgXml
                        xml={lateClockIcon}
                        width={12}
                        height={12}
                        style={styles.clockIcon}
                      />
                      <Text style={styles.scheduleHoursText}>
                        {workingHours.split(" - ")[1]}
                      </Text>
                    </View>
                  </View>
                )}
                {workingHours === "Off" && (
                  <Text
                    style={[
                      styles.scheduleHoursText,
                      { marginTop: 20, fontSize: 15 },
                    ]}
                  >
                    OFF
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scheduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  scheduleHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#383838",
    marginLeft: 8,
  },
  scheduleContainer: {
    flexDirection: "row",
    marginTop: 10,
    paddingBottom: 10,
  },
  scheduleDay: {
    width: 110,
    height: 100,
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "rgba(12, 167, 189, 0.16)",
    alignItems: "center",
  },
  offDay: {
    backgroundColor: "#fff",
  },
  scheduleDayText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0CA7BD",
  },
  workingHoursContainer: {
    alignItems: "center",
    marginTop: 5,
  },
  clockIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  clockIcon: {
    marginRight: 4,
  },
  scheduleHoursText: {
    fontSize: 12,
    color: "#333",
  },
});

export default Schedule;
