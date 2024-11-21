import React, { useContext, useEffect, useState } from "react";
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
import { LanguageContext } from "../../../configs/LanguageConfig";

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
  const language = useContext(LanguageContext).language;
  const sunday = getSunday(today);
  const daysOfWeek: Array<any> = [];
  //state

  const days = [
    language.SUNDAY_1,
    language.MONDAY_1,
    language.TUESDAY_1,
    language.WEDNESDAY_1,
    language.THURSDAY_1,
    language.FRIDAY_1,
    language.SATURDAY_1,
  ]

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
          dayOfWeek={days[currentDay.getDay()]}
        />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.month}>{language.MONTH} {today.getMonth() + 1}</Text>
      </View>
      <View style={styles.control}>
        <TouchableOpacity
          onPress={() => {
            setCurrentWeek(currentWeek - 1);
          }}
          style={styles.lastweekBox}
        >
          <Ionicons name="chevron-back" size={20} color="white" />
          <Text style={styles.lastWeek}> {language.LAST_WEEK} </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setCurrentWeek(currentWeek + 1);
          }}
          style={styles.nextWeekBox}
        >
          <Text style={styles.nextWeek}>  {language.NEXT_WEEK} </Text>
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
    borderRadius: 15,
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
