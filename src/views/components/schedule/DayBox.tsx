import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import {
  BackgroundColor,
  BorderColor,
  TextColor,
} from "../../../configs/ColorConfig";
//define props need to use
type DayProps = {
  day: number;
  dayOfWeek: string;
  isActive?: boolean;
  isToday?: boolean;
};

const classToday: Array<any> = [];

const DayBox = ({
  day,
  dayOfWeek,
  isActive = false,
  isToday = false,
}: DayProps) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.dayBoxMain,
          isActive
            ? styles.dayBox_active
            : isToday
            ? styles.dayBox_today
            : styles.daybox,
        ]}
      >
        <Text
          style={[styles.dayMain, 
            isActive
              ? styles.day_active
              : isToday
              ? styles.day_today
              : styles.day
            ]
          }
        >
          {day}
        </Text>
        <Text
          style={[styles.dayOfWeekMain,
            isActive
              ? styles.dayOfWeek_active
              : isToday
              ? styles.dayOfWeek_today
              : styles.dayOfWeek,
          ]}
        >
          {" "}
          {dayOfWeek}{" "}
        </Text>
      </View>

      {isToday ? (
        <View style={styles.todayPointActive}></View>
      ) : (
        <View style={styles.todayPoint}></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  dayBoxMain: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 3,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 5,
  },

  daybox: {
    borderColor: BorderColor.white,
  },
  dayBox_active: {
    backgroundColor: BackgroundColor.white,
    borderColor: BorderColor.white,
  },
  dayBox_today: {
    borderColor: BorderColor.white,
  },

  dayMain: {
    marginBottom: 8,
    fontWeight: "bold",
    fontSize: 16,
  },

  day: {
    color: TextColor.white,
  },

  day_active: {
    color: TextColor.primary,
  },

  day_today: {
    color: TextColor.white,
  },


  dayOfWeekMain: {
    textAlign: "center",
    marginTop: 5,
    fontWeight: "bold",
    fontSize: 8.5,
    width: 30,
  },

  dayOfWeek: {
    color: TextColor.white,
  },

  dayOfWeek_active: {
    color: TextColor.primary,
  },
  dayOfWeek_today: {
    color: TextColor.white,
  },

  classBox: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
    opacity: 0.5,
  },

  todayPoint: {
    width: 10,
    height: 5,
    borderRadius: 5,
    backgroundColor: BackgroundColor.primary,
  },

  todayPointActive: {
    width: 10,
    height: 5,
    borderRadius: 5,
    backgroundColor: BackgroundColor.white,
  },
});

export default DayBox;
