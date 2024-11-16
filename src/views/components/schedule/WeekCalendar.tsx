import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { BackgroundColor, TextColor } from "../../../configs/ColorConfig";
import DayBox from "./DayBox";
import { Day } from "../../screens/PersonalSchedule";
import Ionicons from "@expo/vector-icons/Ionicons";

export enum EdayOfWeek {
  "sun" = 0,
  "mon" = 1,
  "tue" = 2,
  "wes" = 3,
  "thi" = 4,
  "fri" = 5,
  "sat" = 6,
}
//order function
//get Sunday
const getSunday = (currentDate: Date) => {
  const sunday = currentDate;
  sunday.setDate(sunday.getDate() - sunday.getDay());
  return sunday;
};

/************************
 * return view component
 ************************/
const WeekCalendar = ({
  today,
  activeDate,
  currentDate,
  currentWeek,
  setActiveDate: setActiveDate,
  setCurrentWeek: setCurrentWeek,
  setSelectedDate
}: Day) => {
  //prop, context
  const sunday = getSunday(today);
  const daysOfWeek: Array<any> = [];
  //state

  //handler
  const handleOnClickDay = (
    onNext: (currentDate: Date) => void,
    clickedDate: Date
  ) => {
    setSelectedDate(clickedDate)
    // console.log(clickedDate);
    // AClass.getAllClasses(()=>{});
    onNext(clickedDate);
  };
  //effect
  useEffect(() => {}, []);

  for (let index = 0; index < 7; index++) {
    const currentDay = new Date(sunday); // Tạo bản sao của monday để tránh thay đổi trực tiếp
    currentDay.setDate(sunday.getDate() + index);

    // Kiểm tra xem currentDay có phải là hôm nay không
    const isToday =
      currentDay.getDate() === new Date().getDate() &&
      currentDay.getMonth() === new Date().getMonth() &&
      currentDay.getFullYear() === new Date().getFullYear();

    daysOfWeek.push(
      <TouchableOpacity
        onPress={() => handleOnClickDay(setActiveDate, currentDay)}
        key={index}
      >
        <DayBox
          isActive={index === activeDate}
          isToday={isToday}
          day={currentDay.getDate()}
          dayOfWeek={EdayOfWeek[currentDay.getDay()]}
        />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.month}>Tháng {today.getMonth() + 1}</Text>
      </View>
      <View style={styles.control}>
        <TouchableOpacity
          onPress={() => {
            setCurrentWeek(currentWeek - 1);
          }}
          style={styles.lastweekBox}
        >
          <Ionicons name="chevron-back" size={20} color="white" />
          <Text style={styles.lastWeek}> Last Week </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setCurrentWeek(currentWeek + 1);
          }}
          style={styles.nextWeekBox}
        >
          <Text style={styles.nextWeek}> Next Week </Text>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.weekCalendar}>{daysOfWeek}</View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    // width: '100%',
    height: 180,
    backgroundColor: BackgroundColor.primary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 30,
    paddingHorizontal: 10,
    elevation: 4,
    marginHorizontal: 20,
  },
  weekCalendar: {
    height: 120,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  control: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  lastweekBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingStart: 0,
  },
  lastWeek: {
    color: TextColor.white,
    fontSize: 14,
    fontWeight: "semibold",
    textAlign: "left",
  },
  nextWeekBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingEnd: 0,
  },
  nextWeek: {
    color: TextColor.white,
    fontSize: 14,
    fontWeight: "semibold",
    textAlign: "right",
  },
  month: {
    marginTop: 5,
    color: TextColor.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default WeekCalendar;
