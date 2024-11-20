import { View, StyleSheet, Text, ScrollView, Image } from "react-native";
import WeekCalendar from "../components/schedule/WeekCalendar";
import TimeLine from "../components/schedule/TimeLine";
import { BackgroundColor, BorderColor, TextColor } from "../../configs/ColorConfig";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import ASchedule from "../../apis/ASchedule";
import Lesson from "../../models/Lesson";
import { UserContext } from "../../configs/UserContext";
import { LanguageContext } from "../../configs/LanguageConfig";
import DropdownParent from "../components/dropdown/DropDownParent";
import DropdownChildren from "../components/dropdown/DropDownChildren";
// import RatingScreen from "./Rating";

export type Day = {
  today: Date,
  currentDay: Date,
  currentDate: number,
  activeDate: number,
  currentWeek: number,
  setActiveDate: (currentDate: Date) => void,
  setCurrentWeek: (currentWeek: number) => void,
  setSelectedDate: (date: Date) => void
}

export default function PersonalScheduleScreen() {
  // context
  const language = useContext(LanguageContext).language;
  //day
  //schedule
  const day: Date = useMemo(() => new Date(), []);
  
  const {user, setUser} = useContext(UserContext);
  const user_id = user.ID;
  const student_id = '';
  
  //state
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentDate, setCurrentDate] = useState(day.getDay())
  const [currentDay, setCurrentDay] = useState(new Date());
  const [todayLessons, setTodayLessons] = useState<Lesson[]>([])
  const [activeDate, setActiveDate] = useState(currentDate);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Người được chọn từ dropdown
  const [selectedUserId, setSelectedUserId] = useState("");
  /**
   * 0 = current week
   * -1 = last week , -2,-3,...
   * 1 = next week, 2,3,4,...
   */

  //state
  const handlerSetActiveDate = useCallback((activeDate: Date) => {
    setActiveDate(activeDate.getDay());
    const todayLessons :Lesson[] = [];
      lessons.forEach(item => {
        if(item.day === activeDate.getDay()){
          todayLessons.push(item);
        }
      });
      setTodayLessons(todayLessons);
  }, [lessons]);

  const handlerSetWeek = useCallback((currentWeek: number) => {
    setCurrentWeek(currentWeek);
  }, []);

  //Effect
  useEffect(()=> {
    ASchedule.getWholeWeekLessons(user_id ,student_id ,(lessons) => { 
      setLessons(lessons);
      const todayLessons :Lesson[] = [];
      lessons.forEach(item => {
        if(item.day === currentDate){
          todayLessons.push(item);
        }
      });
      setTodayLessons(todayLessons);
      // console.log("todayLesson", JSON.stringify(todayLessons, null, 2));
    })
  }, []);

  //kiem tra ngay active de thay doi du lieu dau ra
  useEffect(()=>{
    const todayLessons :Lesson[] = [];
      lessons.forEach(item => {
        // console.log("today:", currentDate);
        // console.log("item :", item.day);
        if(item.day === activeDate){
          todayLessons.push(item);
        }
      });
      setTodayLessons(todayLessons);
      // console.log("todayLesson", JSON.stringify(todayLessons, null, 2));
      
  }, [activeDate])

  //kiem tra tuan de thay doi lich
  useEffect(()=>{
    
    const newCurrentDay : Date = new Date();
    newCurrentDay.setDate(day.getDate() + (currentWeek * 7))
    setCurrentDate(newCurrentDay.getDay());
    setCurrentDay(newCurrentDay)
    // console.log("today : ", today);
    // console.log("current Day : ", currentDay);
    
    
  },[currentWeek])

  return (
      <View style={styles.container}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{language.SCHEDULE}</Text>
          <View style={{flex: 1}}>
          <DropdownChildren learners={[]} onSlectedLeanerId={setSelectedUserId}/>
          </View>
        </View>
        <View style={styles.mainview}>
          <ScrollView showsVerticalScrollIndicator={false}
            contentContainerStyle={
              {
                // paddingHorizontal: 10,
                paddingTop: 5,
              }
            }>
            <WeekCalendar today={currentDay} currentDay={currentDay} currentDate={currentDate} currentWeek={currentWeek} activeDate={activeDate} setActiveDate={handlerSetActiveDate} setCurrentWeek={handlerSetWeek} setSelectedDate={setSelectedDate}/>
            {/* <TimeLine lessons={lessons}/> */}
            <TimeLine user_id={user_id} student_id={student_id} lessons={todayLessons} selectedDate={selectedDate}/>
          </ScrollView>
          {/* <RatingScreen/> */}

        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.white,
  },
  mainview: {
  },
  infoBox:{
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 20,
    marginTop: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderWidth: 1,
  },
  infoText:{
    fontSize: 20,
    justifyContent: 'center',
    textAlignVertical: 'center',
    fontWeight: '600',
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
