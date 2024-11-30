import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import CourseItem from "../CourseItem";
import { BackgroundColor } from "../../../configs/ColorConfig";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import ClassComponent from "../admin/ClassComponent";
import Class from "../../../models/Class";
import AClassAdmin from "../../../apis/admin/AClassAdmin";
import Lesson from "../../../models/Lesson";
import User from "../../../models/User";
import {
  NavigationContext,
  RouteProp,
  useRoute,
} from "@react-navigation/native";
import ScreenName from "../../../constants/ScreenName";
import { LanguageContext } from "../../../configs/LanguageConfig";
import moment from "moment";
import ReactAppUrl from "../../../configs/ConfigUrl";
import { CLASS_TAB } from "../../../constants/TabListAdmin";

type DetailHistoryBottonSheetProps = {
  isVisible: boolean;
  onCloseButtonSheet: () => void;
  classData: Class | undefined;
  activeTab: string;
};

const ICON_SIZE = 20;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");
const URL = ReactAppUrl.PUBLIC_URL;
export default function ({
  isVisible,
  onCloseButtonSheet,
  classData,
  activeTab,
}: DetailHistoryBottonSheetProps) {
  // contexts ----------------------------------------------------------------
  const navigation = useContext(NavigationContext);
  const languageContext = useContext(LanguageContext);
  // Hàm lấy tên ngày từ số thứ tự
  const days = [
    languageContext.language.SUNDAY,
    languageContext.language.MONDAY,
    languageContext.language.TUESDAY,
    languageContext.language.WEDNESDAY,
    languageContext.language.THURSDAY,
    languageContext.language.FRIDAY,
    languageContext.language.SATURDAY,
  ];

  //state ----------------------------------------------------------------
  const [report, setReport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userList, setUserList] = useState<User[]>([]);

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Định nghĩa chiều cao BottomSheet
  const snapPoints = useMemo(() => ["50%", "90%"], []);

  // callbacks
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onCloseButtonSheet();
      }
    },
    [onCloseButtonSheet]
  );

  const renderBackProp = useCallback(
    (props: any) => {
      // Chỉ render backdrop khi BottomSheet đang hiển thị (isVisible === true)
      return isVisible ? (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      ) : null;
    },
    [isVisible]
  );

  const goToReportClass = () => {
    if (classData) {
      navigation?.navigate(ScreenName.REPORT_CLASS, { classId: classData.id });
    }
  };

  // effect ----------------------------------------------------------------
  useEffect(() => {
    if (classData) {
      AClassAdmin.getClassById(
        classData.id,
        (lessons, users) => {
          setLessons(lessons);
          setUserList(users);
        },
        setLoading
      );
    }
  }, [classData?.id]);

  // Mở hoặc đóng tùy theo `isVisible`
  if (isVisible && bottomSheetRef.current) {
    bottomSheetRef.current.snapToIndex(1);
  }

  //render ----------------------------------------------------------------
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      onChange={handleSheetChanges}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackProp}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            {classData && <ClassComponent classData={classData} />}
          </View>

          {classData?.is_reported && (
            <View style={{ alignItems: "center", paddingVertical: 20 }}>
              <TouchableOpacity
                onPress={goToReportClass}
                style={[styles.btnReport, styles.btnShowdow]}
              >
                <Text style={styles.btnReportText}>Xem các báo cáo</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.bodyContainer}>
            {/* Danh sách các buổi học */}
            <View style={styles.titleContainer}>
              <Ionicons name="book-outline" size={24} color="black" />
              <Text style={styles.title}>Các buổi học</Text>
            </View>
            <View style={styles.lessonListContainer}>
              <FlatList
                horizontal={true}
                data={lessons}
                renderItem={({ item: lesson }) => (
                  <View style={[styles.lessonItem, styles.boxshadow]}>
                    <View style={styles.contentLessonContainer}>
                      <View style={styles.contenLessonTitle}>
                        <Ionicons
                          name="today-outline"
                          size={ICON_SIZE}
                          color="black"
                        />
                        <Text>{languageContext.language.LESSON_DAY}</Text>
                      </View>
                      <Text>{days[lesson.day]}</Text>
                    </View>

                    <View style={styles.contentLessonContainer}>
                      <View style={styles.contenLessonTitle}>
                        <Ionicons
                          name="timer-outline"
                          size={ICON_SIZE}
                          color="black"
                        />
                        <Text>{languageContext.language.END_TIME}</Text>
                      </View>
                      <Text>
                        {lesson.duration / 60000}{" "}
                        {languageContext.language.MINUTES}
                      </Text>
                    </View>

                    <View style={styles.contentLessonContainer}>
                      <View style={styles.contenLessonTitle}>
                        <Image
                          source={require("../../../../assets/images/ic_start_time.png")}
                          style={styles.icImage}
                        />
                        <Text>{languageContext.language.START_TIME}</Text>
                      </View>
                      <Text>{moment(lesson.started_at).format("LT")}</Text>
                    </View>

                    <View style={styles.contentLessonContainer}>
                      <View style={styles.contenLessonTitle}>
                        <Image
                          source={require("../../../../assets/images/ic_end_time.png")}
                          style={styles.icImage}
                        />
                        <Text>{languageContext.language.END_TIME}</Text>
                      </View>
                      <Text>
                        {moment(lesson.started_at)
                          .add(lesson.duration)
                          .format("LT")}
                      </Text>
                    </View>

                    <View style={styles.contentLessonContainer}>
                      <View style={styles.contenLessonTitle}>
                        <Ionicons
                          name="git-commit-outline"
                          size={ICON_SIZE}
                          color="black"
                        />
                        <Text>{languageContext.language.FORM}</Text>
                      </View>
                      <Text>
                        {lesson.is_online === true
                          ? languageContext.language.ONLINE
                          : languageContext.language.OFFLINE}
                      </Text>
                    </View>

                    <View style={styles.line}></View>

                    <View>
                      <View
                        style={[styles.contenLessonTitle, { marginBottom: 10 }]}
                      >
                        <Ionicons
                          name="chatbox-ellipses-outline"
                          size={ICON_SIZE}
                          color="black"
                        />
                        <Text>Ghi chú</Text>
                      </View>
                      {lesson.note && <Text>{lesson.note}</Text>}
                    </View>
                  </View>
                )}
                contentContainerStyle={{ padding: 10 }}
              />
            </View>
          </View>

          {/* Danh sách học sinh của lớp */}
          <View style={[styles.titleContainer, {marginTop: 15}]}>
              <Ionicons name="people-outline" size={24} color="black" />
              <Text style={styles.title}>Danh sách học sinh</Text>
            </View>
            <View style={styles.studentListContainer}>
              {userList && userList.map((user, index) => (
                      <View key={index} style={[styles.studentItem, styles.boxshadow]}>
                        <Image source={{uri: `${URL}${user.avatar}`}} style={styles.studentAvatar}/>
                        <Text style={styles.studentText}>{user.full_name}</Text>
                      </View>
                ))}
                {!userList && 
                <Text>Chưa có người học trong lớp này</Text>
                }
            </View>
        </View>
      </ScrollView>
      {activeTab === CLASS_TAB.PENDING_APPROVAL && (
        <View style={styles.btnCotainer}>
          <TouchableOpacity style={[styles.btn, styles.btnDeny]}>
            <Text style={styles.btnDenyText}>Từ Chối</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnAccept]}>
            <Text style={styles.btnAcceptText}>Chấp nhận</Text>
          </TouchableOpacity>
        </View>
      )}

    {activeTab === CLASS_TAB.PENDING_PAY && (
        <View style={styles.btnCotainer}>
          <TouchableOpacity style={[styles.btn, styles.btnDeny]}>
            <Text style={styles.btnDenyText}>Nhắc nhở</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnAccept]}>
            <Text style={styles.btnAcceptText}>Đã thanh toán</Text>
          </TouchableOpacity>
        </View>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingVertical: 20,
  },

  userAvatar: {
    width: 40,
    height: 40,
  },

  headerContainer: {
    paddingHorizontal: 20,
  },

  userAvatarContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    gap: 10,
  },

  userInfoBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  badge: {
    backgroundColor: "#FF5050",
    color: "#fff",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 2,
    fontWeight: "medium",
  },

  userFullName: {
    fontSize: 16,
    fontWeight: "bold",
  },

  userHeaderContent: {},

  line: {
    backgroundColor: BackgroundColor.gray_c6,
    height: 1,
  },

  bodyContainer: {
    marginTop: 30,
  },

  titleContainer: {
    flexDirection: "row",
    alignContent: "center",
    marginBottom: 10,
    gap: 10,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },

  boxshadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },

  // Student list
  studentListContainer: {
    backgroundColor: "rgba(13, 153, 255, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    gap: 14,
    marginHorizontal: 20,
  },

  contentStudentComponent: {
    flexDirection: "row",
    gap: 8,
  },

  studentItem: {
    backgroundColor: BackgroundColor.white,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  studentAvatar: {
    width: 35,
    height: 35,
    borderRadius: 999,
  },

  studentText: {
    fontSize: 14,
    fontWeight: "500",
  },

  lessonListContainer: {
    marginHorizontal: 10,
  },

  lessonItem: {
    backgroundColor: BackgroundColor.white,
    borderRadius: 10,
    padding: 20,
    gap: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BackgroundColor.gray_e6,
    width: SCREEN_WIDTH * 0.8,
    marginRight: 10,
  },

  contentLessonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  contenLessonTitle: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  btnReport: {
    borderColor: "red",
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
    backgroundColor: BackgroundColor.white,
  },

  btnShowdow: {
    shadowColor: "red",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  btnReportText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },

  btnCotainer: {
    flexDirection: "row",
    gap: 20,
    paddingHorizontal: 15,
    paddingTop: 10,
    marginBottom: 10,
  },

  btn: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 20,
    alignItems: "center",
    borderRadius: 8,
  },

  btnDeny: {
    borderWidth: 1,
    borderColor: "#ff0000",
  },

  btnDenyText: {
    color: "#ff0000",
  },

  btnAccept: {
    backgroundColor: BackgroundColor.primary,
  },

  btnAcceptText: {
    color: BackgroundColor.white,
    fontWeight: "bold",
    fontSize: 16,
  },

  icImage: {
    width: 24,
    height: 24,
  },
});
