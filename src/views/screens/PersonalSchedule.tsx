import { View, StyleSheet, Text, ScrollView, Image } from "react-native";
import WeekCalendar from "../components/WeekCalendar";
import TimeLine from "../components/TimeLine";
import { BackgroundColor, BorderColor, TextColor } from "../../configs/ColorConfig";
import { useEffect, useState } from "react";
import ASchedule from "../../apis/ASchedule";
import Lesson from "../../models/Lesson";
// import RatingScreen from "./Rating";

export type Day = {
  today: Date,
  currentDate: number,
  haveLearnerClass?: boolean,
  haveTutorClass?: boolean,
  onNext: (currentDate: Date) => void
}

export default function PersonalScheduleScreen() { //{ days }: DaysOfWeek props

  //day
  //schedule
  const today: Date = new Date()
  //state
  const [lessons, setLessons] = useState<Array<Lesson>>([])
  const [currentDate, setCurrentDate] = useState(today.getDay())

  //state
  const handlerSetCurrentDate = (currentDate: Date) => {
    // console.log(currentDate);
    setCurrentDate(currentDate.getDay());
  }

  //Effect
  useEffect(()=> {
    ASchedule.getWholeWeekLessons((lessons) => { 
      setLessons(lessons);
    })
  }, []);

    const day: Day = {
      today : today,
      currentDate: currentDate,
      haveLearnerClass: false,
      haveTutorClass: false,
      onNext : handlerSetCurrentDate
    }


  return (
      <View style={styles.container}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}> Lang Gom Schedule </Text>
          <Image style={styles.avatar} source={require('../../../assets/images/img_avatar_user.png')} />
        </View>
        <View style={styles.mainview}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <WeekCalendar today={day.today} currentDate={day.currentDate} haveLearnerClass ={day.haveLearnerClass} haveTutorClass = {day.haveLearnerClass} onNext={handlerSetCurrentDate}/>
            <TimeLine lessons={lessons}/>
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
  },
  infoBox:{
    flexDirection: 'row',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoText:{
    flex: 1,
    fontSize: 26,
    justifyContent: 'center',
    textAlignVertical: 'center',
    fontWeight: 'semibold',
    color: TextColor.sub_primary,
  },
  avatar:{
    width: 50,
    height: 50,
    borderRadius: 30,
    alignItems: 'flex-end',
    justifyContent: 'center',
  }
});
