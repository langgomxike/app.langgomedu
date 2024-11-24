import { View, StyleSheet, Text, ScrollView, Image } from "react-native";
import WeekCalendar from "../components/schedule/WeekCalendar";
import TimeLine from "../components/schedule/TimeLine";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import ASchedule from "../../apis/ASchedule";
import Lesson from "../../models/Lesson";
import { UserContext, UserType } from "../../configs/UserContext";
import { LanguageContext } from "../../configs/LanguageConfig";
import DropdownChildren from "../components/dropdown/DropDownChildren";
import SLog, { LogType } from "../../services/SLog";
import User from "../../models/User";
import { RoleList } from "../../models/Role";
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
  const { user, setUser } = useContext(UserContext);

  //STATE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const [type, setType] = useState<number>(0);
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentDate, setCurrentDate] = useState(day.getDay())
  const [currentDay, setCurrentDay] = useState(new Date());
  const [todayLessons, setTodayLessons] = useState<Lesson[]>([])
  const [activeDate, setActiveDate] = useState(currentDate);
  const [currentWeek, setCurrentWeek] = useState(0);
  /**
   * 0 = current week
   * -1 = last week , -2,-3,...
   * 1 = next week, 2,3,4,...
   */
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Người được chọn từ dropdown
  const [selectedUserId, setSelectedUserId] = useState(user.ID);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>(new User());


  //HANDLER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const handlerSetActiveDate = useCallback((activeDate: Date) => {

    setActiveDate(activeDate.getDay());
    setSelectedDate(activeDate);
  }, [lessons]);

  //thay đổi tuần
  const handlerSetWeek = useCallback((currentWeek: number) => {
    setCurrentWeek(currentWeek);
    const newSelectedate = new Date(selectedDate);
    newSelectedate.setDate(newSelectedate.getDate() + (currentWeek * 7))
    setSelectedDate(newSelectedate);
  }, []);

  //gọi api trả về danh sách lịch học
  const handleCallAPI = useCallback((lessons: Lesson[]) => {
    // console.log(JSON.stringify(lessons, null, 2));

    setLessons(lessons);
    const todayLessons: Lesson[] = [];
    const today = new Date(`${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}T00:00:00.000Z`)
    // console.log(today);
    lessons.forEach(item => {
      const started_at = new Date(item.started_at);
      const dateFromString = `${started_at.getFullYear()}-${started_at.getMonth() + 1}-${started_at.getDate()}T00:00:00.000Z`;
      const itemday = new Date(dateFromString);
      if (itemday.getTime() === today.getTime()) {

        todayLessons.push(item);
      }
    });
  }, [])

  //Effect >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //lay du lieu tu api
  useEffect(() => {
    // console.log("personalSchedule: " + selectedUserId);

    if (type === 1) {
      ASchedule.getTutorSchedule(selectedUser.id, handleCallAPI)
    }
    else {
      ASchedule.getLearnerSchedule(selectedUser.id, handleCallAPI)
    }
  }, [selectedUser, type]);

  //kiem tra ngay active de thay doi du lieu dau ra
  useEffect(() => {
    const selectedLessons: Lesson[] = [];
    // SLog.log(LogType.Info, "UseEffect", "yes", )
    lessons.forEach(item => {
      const started_at = new Date(item.started_at);
      const today = new Date(`${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}T00:00:00.000Z`)
      const dateFromString = `${started_at.getFullYear()}-${started_at.getMonth() + 1}-${started_at.getDate()}T00:00:00.000Z`;
      const itemday = new Date(dateFromString);

      if (itemday.getTime() === today.getTime()) {
        // SLog.log(LogType.Info, "data", '', [selectedDate, itemday, today])
        selectedLessons.push(item);
      }
    });
    setTodayLessons(selectedLessons);

  }, [lessons, selectedDate, activeDate, currentWeek, selectedUser, type])

  //kiem tra tuan de thay doi lich
  useEffect(() => {
    const newCurrentDay: Date = new Date();
    newCurrentDay.setDate(day.getDate() + (currentWeek * 7))
    setCurrentDate(newCurrentDay.getDay());
    setCurrentDay(newCurrentDay)
  }, [currentWeek])

  //lay danh sach cac nguoi dung trong thoi khoa bieu
  useEffect(() => {
    console.log(user.ID);
    
    ASchedule.getUserParentAndChild(user.ID, (users) => {
      //lấy người dùng mặc định trên dropdown
      users.forEach(item => {
        if (item.id === user.ID) {
          setSelectedUser(item);
          if (item.roles.some((role) => role.id === RoleList.TUTOR)) {
            setType(1);
          }
        }
        setUsers(users)
      });
    })
  }, [user])


  //testing ///////////////////////////////////////////
  useEffect(() => {
    console.log(type);
    // console.log(selectedUser);

  }, [type])

  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>{language.SCHEDULE}</Text>
        <View style={{ flex: 1 }}>
          <DropdownChildren user_default={selectedUser} learners={users} onSelectedLearner={(user) => {
            setSelectedUser(user);
            // Đặt lại type mỗi khi chọn người dùng
            if (user.roles.some((role) => role.id === RoleList.TUTOR)) {
              setType(1);
            } else {
              setType(0);
            }
          }} onChangeType={setType} />
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
          <WeekCalendar today={currentDay} currentDay={currentDay} currentDate={currentDate} currentWeek={currentWeek} activeDate={activeDate} setActiveDate={handlerSetActiveDate} setCurrentWeek={handlerSetWeek} setSelectedDate={setSelectedDate} />
          {/* <TimeLine lessons={lessons}/> */}
          <TimeLine user_id={user.ID} lessons={todayLessons} selectedDate={selectedDate} type={type} onChangeType={setType} />
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
  infoBox: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 20,
    marginTop: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderWidth: 1,
  },
  infoText: {
    fontSize: 20,
    justifyContent: 'center',
    textAlignVertical: 'center',
    fontWeight: '600',
    color: TextColor.sub_primary,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
    alignItems: 'flex-end',
    justifyContent: 'center',
  }
});
