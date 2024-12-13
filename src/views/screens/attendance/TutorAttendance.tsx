import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { BackgroundColor } from "../../../configs/ColorConfig";
import ModalStudentList from "../../components/modal/ModalStudentList";
import ClassInfo from "../../components/ClassInfo";
import AAttendance from "../../../apis/AAttendance";
import Attendance from "../../../models/Attendance";
import ClassInForSkeleton from "../../components/skeleton/ClassInfoSkeleton";
import Lesson from "../../../models/Lesson";
import ScreenName from "../../../constants/ScreenName";
import {NavigationContext, NavigationRouteContext} from "@react-navigation/native";
import User from "../../../models/User";
import ReactAppUrl from "../../../configs/ConfigUrl";
import SFirebase, { FirebaseNode } from "../../../services/SFirebase";
import {AttendedForTutor} from "../../../configs/NavigationRouteTypeConfig";
import ModalConfirmAttendClass from "../../components/modal/ModalConfirmAttendLesson";
import { AccountContext } from "../../../configs/AccountConfig";
import ChildItem from "../../components/attendance/ChildItem";
import DropdownLearners from "../../components/dropdown/DropDownLearners";
import moment from "moment";
import { ActivityIndicator } from "react-native";
import { LanguageContext } from "../../../configs/LanguageConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";

const URL = ReactAppUrl.PUBLIC_URL;
const { width: SCREEN_WIDTH } = Dimensions.get("screen");
const LESSON_NOTIFY_KEY = "NOTIFYDATA_LESSON";
export default function TutorAttendance() {
  const route = useContext(NavigationRouteContext);
  const param = route?.params as AttendedForTutor || new Lesson();

  //context----------------------------------------------------------------
  const account = useContext(AccountContext).account
  const navigation = useContext(NavigationContext);
  const language = useContext(LanguageContext).language;
  const classId = param.lesson.class?.id;
  const lessonId = param.lesson.id;

  // state ----------------------------------------------------------------
  const [modalVisible, setModalVisible] = React.useState<string | null>("");
  const [loading, setLoading] = React.useState(false);
  const [loadingNotify, setLoadingNotify] = React.useState(false);
  const [lessonDetail, setLessonDetail] = useState(new Lesson());
  const [attendStudents, setAttendStudents] = useState<Attendance[]>([]);
  const [learners, setLearners] = useState<User[]>();
  const [attendanceResult, setAttendanceResult] = useState(false);
  const [selectedLearnerId, setSelectedLearnerId] = useState<string>("");
  const [attendanceStatus, setAttendanceStatus] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [realTimeStatus, setRealTimeStatus] = useState<number>(0);
  const [unPaidLearner, setUnPaidLearner] = useState<User[]>([]);


  // handler -----------------------------------------------------------------

  // Xử lý chuyển đến màn hình lịch sử điểm danh
  const handleNavigateAttendanceHistory = useCallback(() => {
    navigation?.navigate(ScreenName.ATTENDANCE_HISTORY);
  }, []);

  // Lấy giá trị trả về từ server khi bấm điểm danh
  const handleAttendanceResult = (result: boolean) => {
    setAttendanceResult(result);
  };

  // Ghi nhớ danh sách attendStudents đã lọc dựa trên selectedLearnerId
  const filteredLearners = useMemo(() => {
    if (!selectedLearnerId || selectedLearnerId === "all") {
      return learners;
    }

    if(learners) {
      return learners.filter(
        (learner) => learner.id === selectedLearnerId
      );
    }
  }, [selectedLearnerId, learners]);

  // Lấy id của phụ huynh để xử lý lọc cho danh sánh attendStudens
  const handleOnSlectedLearnerId = (learnerId: string) => {
    if (learnerId) {
      setSelectedLearnerId(learnerId);
    }
  };

  const handleNotifyAll = useCallback(async () => {
    const date: string = moment(lessonDetail.started_at).format("DD/MM/YYYY");

    // Lấy danh sách nhắc nhở từ AsyncStorage
  const notifyData = JSON.parse(await AsyncStorage.getItem(LESSON_NOTIFY_KEY) || "{}");
  const lessonId = lessonDetail.id;
  const now = moment();

   // Kiểm tra nếu đã gửi thông báo trong vòng 1 ngày
  if (notifyData[lessonId] && now.diff(moment(notifyData[lessonId]), "days") < 1) {
    alert("Bạn chỉ có thể nhắc nhở 1 lần mỗi ngày cho buổi học này. Vui lòng thử lại sau.");
    return;
  }


    if (learners) {
      // Lọc danh sách learner chưa thanh toán hoặc hoãn thanh toán
      const unpaidLearners = learners.filter(
        (learner) => !learner.attendance?.attended  &&  (!learner.attendance?.paid || !learner.attendance?.deferred)
      );
  
      if (unpaidLearners.length === 0) {
        alert("Không có học viên nào cần nhắc nhở.");
        return;
      }
  
      // Tạo danh sách ID và thông báo cho từng learner
      const learnerIds = [];
      const parentIds = [];
      const messages = unpaidLearners.map((learner) => {
        learnerIds.push(learner.id);
        if (learner.parent_id) {
          parentIds.push(learner.parent_id);
        }
  
        const learnerMessage = `${learner.full_name}, bạn vừa hoàn thành buổi học của môn ${lessonDetail.class?.major?.vn_name} vào ${date}. Vui lòng thanh toán học phí cho buổi học ngày nhé. Xin cảm ơn!`;
  
        const parentMessage = learner.parent_id
          ? `Quý phụ huynh, con bạn ${learner.full_name} vừa hoàn thành buổi học của môn ${lessonDetail.class?.major?.vn_name} vào ${date}. Học phí của con bạn vẫn chưa được thanh toán. Xin cảm ơn!`
          : "";
  
        return { learnerId: learner.id, parentId: learner.parent_id, learnerMessage, parentMessage };
      });
  
      // Gửi thông báo
      messages.forEach(({ learnerId, parentId, learnerMessage, parentMessage }) => {
        setLoadingNotify(true)
        AAttendance.sendNotifyLearners(
          learnerId,
          parentId,
          learnerMessage,
          parentMessage,
          (data) => {
            if (data) {
              console.log(`Thông báo đã được gửi cho học viên ID: ${learnerId}`);
            }
          },
          setLoading
        );
      });
      
      // Cập nhật thời gian nhắc nhở cho lessonId
    notifyData[lessonId] = now.toISOString();
    await AsyncStorage.setItem(LESSON_NOTIFY_KEY, JSON.stringify(notifyData));
      setLoadingNotify(false)
      alert(language.NOTIFICATION_SENT);
    }
  }, [learners, lessonDetail, lessonDetail]);
  

  // effects ----------------------------------------------------------------
  useEffect(() => {
    // Đặt lại title của header khi màn hình được hiển thị
    if (navigation) {
      navigation.setOptions({
        title: language.ATTENDANCE,
        headerShown: true,
        contentStyle: {
          padding: 0,
        },
        headerStyle: {
          backgroundColor: BackgroundColor.primary,
        },
        headerTintColor: "#fff",
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        )
      });
    }
  }, [navigation]);

  useEffect(() => {
    if(classId && lessonId) {  
      console.log("Fetch time: ", moment().format('MMMM Do YYYY, h:mm:ss a'));
        AAttendance.getAttendanceByTutorClassLesson(
          classId,
          lessonId,
          (learners) => {
            setLearners(learners);
  
            // Kiểm tra nếu tất cả học sinh chưa được điểm danh
            const allNotMarked = learners.some((learner) => learner.attendance);
            setAttendanceStatus(allNotMarked ? true : false);
            
          },
          setLoading
        );
      }
  }, [attendanceResult, confirmStatus, realTimeStatus]);

  useEffect(() => {
    setLessonDetail(param.lesson);
  }, [param.lesson])

  useEffect(() => {
    SFirebase.track(FirebaseNode.Attendances, 
      [{key: FirebaseNode.LessonId, value: lessonDetail.id}], () => {
      console.log("Time: ", moment().format('MMMM Do YYYY, h:mm:ss a'));
      const number = Math.floor(10 + Math.random() * 90);
        setRealTimeStatus(number);
      })
    
  }, [lessonDetail])

  useEffect(() => {
    const checkAllPaid = async () => {
      if(learners){
        const unpaidLearners = learners.filter(
          (learner) => learner.attendance?.attended !== false &&  (!learner.attendance?.paid || !learner.attendance?.deferred)
        );
        setUnPaidLearner(unPaidLearner);
  
        // Nếu tất cả học viên đã thanh toán, xóa thông tin nhắc nhở
        if (unpaidLearners.length === 0) {
          let notifyData = JSON.parse(await AsyncStorage.getItem(LESSON_NOTIFY_KEY) || "{}");
          delete notifyData[lessonId];
          await AsyncStorage.setItem(LESSON_NOTIFY_KEY, JSON.stringify(notifyData));
          console.log("Xóa notifyData với lesson id: ", lessonId);
        }
      }
    };

    // Kiểm tra khi có sự thay đổi trong learners
    checkAllPaid();
  }, [learners, lessonId]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 10 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.userContainer}>
                <Image
                  source={{uri: (`${URL}${account?.avatar}`)}}
                  style={styles.avatarUser}
                />
                <Text style={styles.pointText}>{account?.point}</Text>
                <Text style={styles.userName}>{account?.full_name}</Text>
              </View>
            </View>
            <View style={styles.bodyContainer}>
              {/* Class infomation */}
              <View style={styles.classInfoContainer}>
                  <ClassInfo lessonDetail={lessonDetail} />
              </View>

              {learners && (
                    <DropdownLearners
                      learners={learners}
                      onSlectedLeanerId={handleOnSlectedLearnerId}
                    />
                  )}
                
              {/* Danh sach con của người học nếu có */}
              {learners && 
              <View style={styles.childrenComponent}>
                <View style={styles.childrenComponentTitleContainer}>
                  <Text style={styles.childrenComponentTitle}>{language.STUDENT_LIST}</Text>
                  <View style={styles.colorInfo}>
                        <View style={styles.colorContainer}>
                          <View style={[styles.color, {backgroundColor: BackgroundColor.green_light}]}></View>
                          <Text style={styles.textColor}>{language.ATTENDED}</Text>
                        </View>
                        <View style={styles.colorContainer}>
                          <View style={[styles.color, {backgroundColor: BackgroundColor.gray_c6}]}></View>
                          <Text style={styles.textColor}>{language.ABSENT}</Text>
                        </View>
                  </View>

                </View>
                <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={filteredLearners}
                renderItem={({item: learner}) => {
                  return (
                    <ChildItem lessonData={lessonDetail} onConfirmStatus={setConfirmStatus} learnerData={learner}/>
                  )
                }}
                contentContainerStyle={[{padding: 10}, filteredLearners?.length === 1 && styles.centeredItem]}
                keyExtractor={(item, key) => `${key}`}
                />
                {unPaidLearner.length > 0 && 
                <View style={styles.btnNotifyAllCContainer}>
                  <TouchableOpacity style={styles.btnNotifyAll} onPress={handleNotifyAll}>
                    <Text style={styles.btnNotifyAllText} >{language.SEND_REMINDERS_TO_ALL}</Text>
                    {loadingNotify && <ActivityIndicator color={"#fff"}/>}
                  </TouchableOpacity>
                </View>
                }

              </View>
              }

              {/* History attendce list */}
              <TouchableOpacity onPress={handleNavigateAttendanceHistory}>
                <View style={styles.historyListContainer}>
                  <Octicons name="history" size={22} color="black" />
                  <Text style={styles.historyTitle}>{language.ATTENDANCE_HISTORY}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.footerContainer}>
        <TouchableOpacity
          disabled={attendanceStatus ? true : false}
          onPress={() => setModalVisible("modal_student_list")}
          style={[
            styles.btnAttendce,
            attendanceStatus
              ? { backgroundColor: BackgroundColor.primary_op05 }
              : { backgroundColor: BackgroundColor.primary },
          ]}
        >
          <Text style={styles.btnAttendceText}>
            {attendanceStatus ? `${language.ALREADY_ATTENDED}` : `${language.ATTEND}`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal show student list */}
      {lessonDetail && learners && (
        <ModalStudentList
          visible={modalVisible}
          onRequestClose={() => setModalVisible(null)}
          lessonId={lessonDetail.id}
          learners={learners}
          onAttendanceResult={handleAttendanceResult}
        />
      )}

      <ModalConfirmAttendClass
        confirmTitle={language.CONFIRM_SUCCESS}
        confirmContent={
         language.CONFIRM_PAYMENT_SUCCESS
        }
        imageStatus={"success"}
        visiable={modalVisible}
        onRequestCloseDialog={() => setModalVisible(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.gray_e6,
  },

  headerContainer: {
    backgroundColor: BackgroundColor.primary,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 70,
  },

  bodyContainer: {},

  line: {
    height: 1,
    backgroundColor: BackgroundColor.gray_c6,
  },

  icImage: {
    width: 24,
    height: 24,
    borderRadius: 999,
  },

  userContainer: {
    alignItems: "center",
  },

  avatarUser: {
    width: 100,
    height: 100,
    borderRadius: 999,
  },

  userName: {
    color: BackgroundColor.white,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  pointText: {
    color: BackgroundColor.white,
    backgroundColor: BackgroundColor.warning,
    paddingHorizontal: 20,
    borderRadius: 999,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: -15,
  },

  classInfoContainer: {
    backgroundColor: BackgroundColor.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -50,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 10,
  },

  otherUserContainer: {
    backgroundColor: BackgroundColor.white,
    paddingVertical: 20,
  },

  titleContainer: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 10,
    paddingHorizontal: 20,
  },

  historyListContainer: {
    marginTop: 10,
    backgroundColor: BackgroundColor.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginBottom: 10,
  },

  historyTitle: {
    fontWeight: "bold",
  },

  footerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: BackgroundColor.gray_c6,
  },

  btnAttendce: {
    width: "80%",
    paddingVertical: 15,
    borderRadius: 10,
  },

  btnAttendceText: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    color: BackgroundColor.white,
  },

  chevronIcon: {
    // alignItems: "flex-end",
    // paddingHorizontal: 20
  },

  userTypeContainer: {
    alignItems: "flex-end",
    marginTop: 5,
    marginRight: 15,
  },

  userType: {
    borderRadius: 5,
    color: BackgroundColor.white,
    fontWeight: "600",
    paddingHorizontal: 7,
    fontSize: 13,
  },

  otherUserAvatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 999,
    overflow: "hidden",
  },

  otherUserAvatar: {
    width: 50,
    height: 50,
  },

  otherUserName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  otherUserBox: {
    backgroundColor: BackgroundColor.white,
    borderWidth: 1,
    borderColor: BackgroundColor.gray_e6,
    borderRadius: 10,
    width: 300,
    marginRight: 10,
    overflow: "hidden",
  },

  otherUserPressable: {
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },

  otherUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  otherUserContainerList: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },

  boxshadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },

  otherUserContentContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    paddingBottom: 20,
  },

  contentBlock: {
    marginTop: 10,
    paddingHorizontal: 20,
    backgroundColor: BackgroundColor.white,
  },

  textContentTitle: {
    textAlign: "center",
  },

  textSubTitle: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    color: BackgroundColor.primary,
    fontWeight: "bold",
  },

  studentListContainer: {
    backgroundColor: BackgroundColor.white,
    marginTop: 10,
    paddingVertical: 20,
  },

  studentList: {
    paddingHorizontal: 20,
  },

  checkbox: {
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: "center",
    gap: 15,
    marginBottom: 15,
  },

  activeCheckbox: {
    backgroundColor: "#06b6d4" + "11",
    borderRadius: 10,
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: "center",
    gap: 15,
    marginBottom: 12,
  },

  checkboxText: {
    color: "#6b7280",
    fontSize: 14,
  },

  activeText: {
    color: "#374151",
    fontSize: 14,
  },

  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "10%",
    gap: 20,
  },

  btn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    flex: 1,
  },

  btnText: {
    fontWeight: "bold",
    textAlign: "center",
  },

  btnDeny: {
    backgroundColor: BackgroundColor.warning,
  },

  btnAccpet: {
    backgroundColor: BackgroundColor.primary,
    color: BackgroundColor.white,
  },

  centeredItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  contentBlockConfirm: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: BackgroundColor.white,
    gap: 10
  },
  contentBlockConfirmTitle:{
    textAlign: "center",
  },

   // children list
   childrenComponent : {
    backgroundColor: BackgroundColor.white,
    paddingTop: 20,
    paddingBottom: 30,
  },

  childrenComponentTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 20
  },

  childrenComponentTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  colorInfo: {
    flexDirection: "row",
    gap: 20
  },

  colorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  color: {
    width: 25,
    height: 10,
    borderRadius: 999,
  },

  textColor: {
    color: "#666",
    fontSize: 13,
  },

  btnNotifyAllCContainer: {
    alignItems: "center",
  },

  btnNotifyAll: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: BackgroundColor.primary,
    borderRadius: 8,
    marginTop: 20,
    width: SCREEN_WIDTH * 0.6,
    flexDirection: "row",
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnNotifyAllText: {
    color: BackgroundColor.white,
    fontSize: 14,
    fontWeight: "bold",
  }


});
