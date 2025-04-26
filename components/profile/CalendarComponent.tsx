import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <View>
      {showCalendar && (
        <View
          style={{
            position: "absolute",
            zIndex: 1000,
            backgroundColor: "white",
            borderRadius: 10,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            padding: 10,
          }}
        >
          <CalendarPicker
            onDateChange={(date) => {
              const momentDate = moment(date);
              setSelectedDate(momentDate);
              setShowCalendar(false);
            }}
            width={300}
            height={300}
            selectedDayStyle={{
              backgroundColor: "#3498db",
              borderRadius: 20,
            }}
            selectedDayTextStyle={{ color: "white", fontSize: 16 }}
            todayBackgroundColor="#f2f2f2"
            textStyle={{
              fontFamily: "Your-Font-Regular",
              color: "#333",
            }}
            selectedRangeStartStyle={{
              backgroundColor: "#3498db",
              borderRadius: 20,
            }}
            selectedRangeEndStyle={{
              backgroundColor: "#3498db",
              borderRadius: 20,
            }}
          />
        </View>
      )}

      <TouchableOpacity
        onPress={() => setShowCalendar(!showCalendar)}
        style={{
          padding: 15,
          backgroundColor: "#f0f0f0",
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        <Text>{selectedDate.format("MMMM Do, YYYY")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CalendarComponent;
