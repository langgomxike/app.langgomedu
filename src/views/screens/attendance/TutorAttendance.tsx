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
  Touchable,
  TouchableOpacity,
  FlatList,
  Pressable,
  SectionList,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import { BackgroundColor } from "../../../configs/ColorConfig";
import ModalStudentList from "../../components/modal/ModalStudentList";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ModalPaidResult from "../../components/modal/ModalPaidResult";
import ClassInfo from "../../components/ClassInfo";
import AAttendance from "../../../apis/AAttendance";
import { UserContext } from "../../../configs/UserContext";
import Attendance from "../../../models/Attendance";
import ClassInForSkeleton from "../../components/skeleton/ClassInfoSkeleton";
import Lesson from "../../../models/Lesson";
import ScreenName from "../../../constants/ScreenName";
import { NavigationContext, RouteProp, useRoute } from "@react-navigation/native";
import User from "../../../models/User";
import ReactAppUrl from "../../../configs/ConfigUrl";
import LeanerAttendanceSkeleton from "../../components/skeleton/LeanerAttendanceSkeleton";
import { ActivityIndicator } from "react-native";
import SFirebase, { FirebaseNode } from "../../../services/SFirebase";
import { MaterialIcons } from "@expo/vector-icons";
import DropdownParent from "../../components/dropdown/DropDownParent";
import { RootStackParamList } from "../../../configs/NavigationRouteTypeConfig";

const studentList = [
  {
    id: 1,
    name: "Nguyễn Văn A",
  },
  {
    id: 2,
    name: "Nguyễn Văn B",
  },
  {
    id: 3,
    name: "Nguyễn Văn C",
  },
  {
    id: 4,
    name: "Nguyễn Văn A",
  },
  {
    id: 5,
    name: "Nguyễn Văn B",
  },
  {
    id: 6,
    name: "Nguyễn Văn C",
  },
  {
    id: 7,
    name: "Nguyễn Văn A",
  },
  {
    id: 8,
    name: "Nguyễn Văn B",
  },
  {
    id: 9,
    name: "Nguyễn Văn C",
  },
];

const URL = ReactAppUrl.PUBLIC_URL;

export default function TutorAttendance() {
  const route = useRoute<RouteProp<RootStackParamList, ScreenName.ATTENDED_FOR_LEARNER>>();
  const param = route.params;

  //context
  const user = useContext(UserContext).user;
  const navigation = useContext(NavigationContext);
  // state
  const [modalVisible, setModalVisible] = React.useState<string | null>("");
  const [loading, setLoading] = React.useState(true);
  const [lessonDetail, setLessonDetail] = useState(new Lesson());
  const [attendStudents, setAttendStudents] = useState<Attendance[]>([]);
  const [learners, setLearners] = useState<User[]>();
  const [attendanceResult, setAttendanceResult] = useState(false);
  const [selectedLearnerId, setSelectedLearnerId] = useState<string>("");

  const classId = param.classId;
  const lessonId = param.lessonId;
  const userId = user.ID;

  // animate
  const listRef = useAnimatedRef<Animated.View>();
  const heightValue = useSharedValue(0);
  const open = useSharedValue(false);
  const progress = useDerivedValue(() =>
    open.value ? withTiming(0) : withTiming(1)
  );

  // handler

  // Xử lý chuyển đến màn hình lịch sử điểm danh
  const handleNavigateAttendanceHistory = useCallback(() => {
    navigation?.navigate(ScreenName.ATTENDANCE_HISTORY);
  }, []);

  // Lấy giá trị trả về từ server khi bấm điểm danh
  const handleAttendanceResult = (result: boolean) => {
    setAttendanceResult(result);
  };

  // Ghi nhớ danh sách attendStudents đã lọc dựa trên selectedLearnerId
  const filteredAttendStudents = useMemo(() => {
    if (!selectedLearnerId || selectedLearnerId === "all") {
      return attendStudents;
    }

    return attendStudents.filter(
      (student) => student.user?.id === selectedLearnerId
    );
  }, [selectedLearnerId, attendStudents]);

  // Lấy id của phụ huynh để xử lý lọc cho danh sánh attendStudens
  const handleOnSlectedLearnerId = (learnerId: string) => {
    if (learnerId) {
      setSelectedLearnerId(learnerId);
    }
  };

  // Styles animated chevron
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * -90}deg` }],
  }));

  const heightAnimationStyle = useAnimatedStyle(() => ({
    height: interpolate(
      progress.value,
      [0, 1],
      [heightValue.value, 0],
      Extrapolation.CLAMP
    ),
  }));

  // effects
  useEffect(() => {
    // SFirebase.trackOne(FirebaseNode.ATTENDANCE, 1, () => {
    //   console.log("Được gọi lại khi bấm điểm danh thành công!");
    // })
    
    AAttendance.getAttendanceByTutorClassLesson(
      classId,
      lessonId,
      userId,
      (lessonDetail, attendStudents, learners) => {
        setLessonDetail(lessonDetail);
        setAttendStudents(attendStudents);
        setLearners(learners);
      },
      setLoading
    );
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 10 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.userContainer}>
                <Image
                  source={require("../../../../assets/images/img_avatar_user.png")}
                  style={styles.avatarUser}
                />
                <Text style={styles.pointText}>200</Text>
                <Text style={styles.userName}>Nguyễn Văn A</Text>
              </View>
            </View>
            <View style={styles.bodyContainer}>
              {/* Class infomation */}
              <View style={styles.classInfoContainer}>
                {loading && lessonDetail ? (
                  <ClassInForSkeleton />
                ) : (
                  <ClassInfo lessonDetail={lessonDetail} />
                )}
              </View>

              {/* Other user */}
              <View style={styles.otherUserContainer}>
                <Text style={styles.titleContainer}>Phụ huynh/ học sinh</Text>

                {loading &&
                  <LeanerAttendanceSkeleton />
                }
                {!loading && learners &&
                  <FlatList
                    data={learners}
                    renderItem={({ item: learner }) => (
                      <View style={[styles.otherUserBox, styles.boxshadow]}>
                        <View style={styles.userTypeContainer}>
                          <Text
                            style={[
                              styles.userType,
                              learner.students
                                ? { backgroundColor: '#4CAF50' }
                                : { backgroundColor: BackgroundColor.warning },
                            ]}
                          >
                            {learner.students ? "Phụ huynh" : "Học sinh"}
                          </Text>
                        </View>
                        <Pressable
                          style={styles.otherUserPressable}
                          onPress={() => {
                            open.value = !open.value;
                          }}
                        >
                          <View>
                            <View style={styles.otherUser}>
                              <View style={[styles.otherUserAvatarContainer, {borderWidth: 2, borderColor: learner.students ? '#4CAF50' : BackgroundColor.warning}]}>
                                <Image
                                  source={{
                                    uri: `${URL}${learner.avatar?.path}`,
                                  }}
                                  style={styles.otherUserAvatar}
                                />
                              </View>
                              <Text style={styles.otherUserName}>
                                {learner.full_name}
                              </Text>
                            </View>
                          </View>

                          <TouchableOpacity
                            onPress={() => {
                              open.value = !open.value;
                            }}
                            style={styles.chevronIcon}
                          >
                            <Animated.View style={iconStyle}>
                              <Ionicons
                                name="chevron-down-outline"
                                size={20}
                                color="#666"
                              />
                            </Animated.View>
                          </TouchableOpacity>
                        </Pressable>

                        <Animated.View style={heightAnimationStyle}>
                          <Animated.View
                            ref={listRef}
                            style={styles.otherUserContentContainer}
                            onLayout={(event) => {
                              const { height } = event.nativeEvent.layout; // Lấy chiều cao từ layout
                              heightValue.value = height;
                              // Cập nhật heightValue
                            }}
                          >
                            <View style={styles.contentBlock}>
                              <Text style={styles.textContentTitle}>
                                Đã chuyển khoản cho bạn!
                              </Text>
                              <TouchableOpacity
                                onPress={() =>
                                  setModalVisible("modal_paid_result")
                                }
                              >
                                <Text style={styles.textSubTitle}>
                                  Xem thông tin
                                </Text>
                              </TouchableOpacity>
                              <View style={styles.btnContainer}>
                                <TouchableOpacity
                                  style={[
                                    styles.btn,
                                    styles.btnDeny,
                                    styles.boxshadow,
                                  ]}
                                >
                                  <Text style={styles.btnText}>Từ chối</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={[
                                    styles.btn,
                                    styles.btnAccpet,
                                    styles.boxshadow,
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.btnText,
                                      { color: BackgroundColor.white },
                                    ]}
                                  >
                                    Xác nhận
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </Animated.View>
                        </Animated.View>
                      </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    contentContainerStyle={[styles.otherUserContainerList, learners.length === 1 && styles.centeredItem,]}
                  />
                }
              </View>

              <View style={styles.studentListContainer}>
                <View>
                  <Text style={styles.titleContainer}>Danh sách điểm danh</Text>
                  {learners && (
                    <DropdownParent
                      learners={learners}
                      onSlectedLeanerId={handleOnSlectedLearnerId}
                    />
                  )}
                </View>
                <View style={styles.studentList}>
                  {filteredAttendStudents && (
                    <FlatList
                      scrollEnabled={false}
                      showsVerticalScrollIndicator={false}
                      data={filteredAttendStudents}
                      keyExtractor={(item, index) => `${item.id}-${index}`}
                      renderItem={({ item: attendStudent }) => {
                        const isChecked = attendStudents.some(
                          (s) => s.attended === true
                        );
                        return (
                          <View style={[styles.activeCheckbox]}>
                            <MaterialIcons
                              name={
                                isChecked
                                  ? "check-box"
                                  : "check-box-outline-blank"
                              }
                              size={24}
                              color={isChecked ? "#06b6d4" : "#64748b"}
                            />
                            <Text style={styles.activeText}>
                              {attendStudent.student?.id === null
                                ? attendStudent.user?.full_name
                                : attendStudent.student?.full_name}
                            </Text>
                          </View>
                        );
                      }}
                    />
                  )}
                </View>
              </View>

              {/* History attendce list */}
              <TouchableOpacity onPress={handleNavigateAttendanceHistory}>
                <View style={styles.historyListContainer}>
                  <Octicons name="history" size={22} color="black" />
                  <Text style={styles.historyTitle}>Lịch sử điểm danh</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.footerContainer}>
        <TouchableOpacity
          disabled = {attendStudents ? true : false}
          onPress={() => setModalVisible("modal_student_list")}
          style={[styles.btnAttendce, attendStudents ? {backgroundColor: BackgroundColor.primary_op05} : {backgroundColor: BackgroundColor.primary}]}
        >
          <Text style={styles.btnAttendceText}>
            { attendStudents? " Đã điểm danh" : "Điểm danh" }
           </Text>
        </TouchableOpacity>
      </View>

      {/* Modal show paid result */}
      <ModalPaidResult
        visiable={modalVisible}
        onRequestClose={() => setModalVisible(null)}
        image_uri="https://help.senpay.vn/hc/article_attachments/16787882502041"
      />

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
    fontWeight: 'bold',
    color: '#333',
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
    width: "40%",
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
});
