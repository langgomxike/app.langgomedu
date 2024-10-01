import { Text, View, StyleSheet } from "react-native";
import WeekCalendar from "../components/WeekCalendar";
import BackLayout from "../layouts/Back";
import Schedule, {Day} from "./Schedule";
import BackWithDetailLayout from "../layouts/BackWithDetail";
import TimeLine from "../components/TimeLine";

export default function KhangTestScreen() {
  
  const today : Date = new Date()
  const daysOfWeek : Array<Day> = []

  for (let index = 0; index < 7; index++) {
    const currentDay : Date = new Date()
    currentDay.setDate(today.getDate() + index)

    const day : Day = {
      dayOfMonth: (currentDay.getDate()),
      dayOfWeek: (currentDay.getDay()),
      haveLearnerClass: false,
      haveTutorClass: false,
    }
    daysOfWeek.push(day); 
  }
  
  return (
    <View>
      <Schedule days={daysOfWeek}/>
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // }
})
