import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { WorkingHours, DayOfWeek } from "@/components/expolre/types/types";

interface ScheduleProps {
  WorkingHours: WorkingHours[];
}

const Schedule = ({ WorkingHours }: ScheduleProps) => {
  const getWorkingHoursForDay = (day: DayOfWeek) => {
    return WorkingHours.find(
      (wh) => wh.dayOfWeek.toUpperCase() === day.toUpperCase()
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="clock" size={20} color="#0CA7BD" />
        <Text style={styles.headerText}>Weekly Schedule</Text>
      </View>

      <View style={styles.timelineContainer}>
        {Object.values(DayOfWeek).map((day, index) => {
          const workingDay = getWorkingHoursForDay(day);
          const isClosed = !workingDay;
          const isLast = index === Object.values(DayOfWeek).length - 1;

          return (
            <View key={day} style={styles.dayRow}>
              {/* Timeline element */}
              <View style={styles.timeline}>
                <View
                  style={[styles.timelineDot, isClosed && styles.closedDot]}
                />
                {!isLast && (
                  <View
                    style={[styles.timelineLine, isClosed && styles.closedLine]}
                  />
                )}
              </View>

              {/* Day content */}
              <View
                style={[styles.dayContent, isClosed && styles.closedContent]}
              >
                <Text
                  style={[styles.dayText, isClosed && styles.closedDayText]}
                >
                  {day.substring(0, 3).toUpperCase()}
                </Text>

                {workingDay ? (
                  <View style={styles.hoursContainer}>
                    <View style={styles.timeSlot}>
                      <Feather name="sunrise" size={14} color="#FFAC33" />
                      <Text style={styles.timeText}>
                        {workingDay.startTime}
                      </Text>
                    </View>
                    <View style={styles.timeSlot}>
                      <Feather name="sunset" size={14} color="#FF8B33" />
                      <Text style={styles.timeText}>{workingDay.endTime}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.closedSlot}>
                    <Feather name="x" size={14} color="#999" />
                    <Text style={styles.closedText}>Closed</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#064D57",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#064D57",
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  timelineContainer: {
    marginLeft: 8,
  },
  dayRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  timeline: {
    width: 24,
    alignItems: "center",
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#0CA7BD",
    borderWidth: 2,
    borderColor: "white",
  },
  closedDot: {
    backgroundColor: "#f0f0f0",
    borderColor: "#e0e0e0",
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#0CA7BD",
    marginVertical: 2,
  },
  closedLine: {
    backgroundColor: "#f0f0f0",
  },
  dayContent: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(12, 167, 189, 0.08)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "space-between",
  },
  closedContent: {
    backgroundColor: "#f9f9f9",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#064D57",
    width: 36,
  },
  closedDayText: {
    color: "#999",
  },
  hoursContainer: {
    flexDirection: "row",
  },
  timeSlot: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  timeText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#383838",
    marginLeft: 6,
  },
  closedSlot: {
    flexDirection: "row",
    alignItems: "center",
  },
  closedText: {
    fontSize: 12,
    color: "#999",
    marginLeft: 6,
  },
});

export default Schedule;
