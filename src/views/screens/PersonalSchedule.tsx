import { View, StyleSheet, Text, ScrollView } from "react-native";
import WeekCalendar from "../components/WeekCalendar";
import TimeLine from "../components/TimeLine";
import { BackgroundColor } from "../../configs/ColorConfig";

export type Day = {
  dayOfMonth: number,
  dayOfWeek: number,
  haveLearnerClass?: boolean,
  haveTutorClass?: boolean,
}
export type DaysOfWeek = {
  days: Array<Day>
}

export default function PersonalScheduleScreen() { //{ days }: DaysOfWeek props

  //day
  //schedule
  const today: Date = new Date()
  const daysOfWeek: Array<Day> = []

  for (let index = 0; index < 7; index++) {
    const currentDay: Date = new Date()
    currentDay.setDate(today.getDate() + index)

    const day: Day = {
      dayOfMonth: (currentDay.getDate()),
      dayOfWeek: (currentDay.getDay()),
      haveLearnerClass: false,
      haveTutorClass: false,
    }
    daysOfWeek.push(day);
  }


  return (
      <View style={styles.container}>
        <View style={styles.mainview}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <WeekCalendar days={daysOfWeek} />
            <TimeLine />
          </ScrollView>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: BackgroundColor.white,
  },
  mainview: {
  }
});
