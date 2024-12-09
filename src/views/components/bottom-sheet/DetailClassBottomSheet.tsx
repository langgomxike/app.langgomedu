import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions, Pressable, Alert,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import {FlatList, ScrollView} from "react-native-gesture-handler";
import CourseItem from "../CourseItem";
import {BackgroundColor, TextColor} from "../../../configs/ColorConfig";
import {Ionicons, AntDesign} from "@expo/vector-icons";
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
import {LanguageContext} from "../../../configs/LanguageConfig";
import moment from "moment";
import ReactAppUrl from "../../../configs/ConfigUrl";
import {CLASS_TAB} from "../../../constants/TabListAdmin";
import ModalDialogForClass from "../modal/ModalDialogForClass";
import ModalInputReason from "../modal/ModalInputReason";
import DateTimeConfig from "../../../configs/DateTimeConfig";
import Report from "../../../models/Report";
import {ReportNavigationType} from "../../../configs/NavigationRouteTypeConfig";
import {AppInfoContext} from "../../../configs/AppInfoContext";
import AUserAdmin from "../../../apis/admin/AUserAdmin";

type DetailHistoryBottonSheetProps = {
  isVisible: boolean;
  onCloseButtonSheet: () => void;
  classData: Class | undefined;
  activeTab: string;
};

const ICON_SIZE = 20;
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("screen");
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
  const [modalResult, setModalResult] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<{ title: string, content: string }>({title: "", content: ""})
  const [approveResult, setApproveResult] = useState(false);
  const [approvePayResult, setApprovePayResult] = useState(false);
  const [reportList, setReportList] = useState<Report[]>([]);
  const [reportLevelList, setReportLevelList] = useState<{ id: number, label: string, points: number }[]>([]);

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const appInfo = useContext(AppInfoContext).infos;

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

  const handleApproveClass = useCallback(() => {
    setModalContent({title: "Xác nhận", content: "Xác thực lớp thành công!"})
    setModalResult("modalDialogForClass");
    if (classData) {
      AClassAdmin.approveClass(classData.id, (data) => {
        setApproveResult(data.result);
      }, setLoading);
    }
  }, [classData]);

  const handleApprovePaymentByAdmin = useCallback(() => {
    if (classData) {
      setModalContent({title: "Xác nhận", content: "Xác nhận thanh toán thành công!"})
      setModalResult("modalDialogForClass");
      AClassAdmin.approvePaymentByAdmin(
        classData.id,
        (data) => {
          setApprovePayResult(data.result);
        },
        setLoading
      );
    }
  }, [classData]);

  const handleDenyClass = () => {
    setModalResult("modalInputReason")
  }

  const goToViewReport = useCallback((report: Report) => {
    const data: ReportNavigationType = {
      id: report.id,
      reporter: report.reporter ?? new User(),
    }
    navigation?.navigate(ScreenName.UPDATE_REPORT_USER, data);
  }, []);

  const handleDeleteClass = useCallback(() => {
    Alert.alert("Xac nhan xoa", "lop hoc se bi khoa vinh vien va khong the khoi phuc", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: () => {
          // AClassAdmin.deleteClass(classData.id, (data) => {
          //   if (data.result) {
          //     onCloseButtonSheet();
          //     navigation?.navigate(ScreenName.ADMIN_CLASS);
          //   }
          // }, setLoading);
        },
      },
    ])
  }, [classData]);

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

      setApprovePayResult(false);
      setApproveResult(false);
    }
  }, [classData?.id]);

  // Mở hoặc đóng tùy theo `isVisible`
  if (isVisible && bottomSheetRef.current) {
    bottomSheetRef.current.snapToIndex(1);
  }

  // effects
  useEffect(() => {
    if (!classData) return;

    AUserAdmin.getReportsOfClass(classData, reports => {
      setReportList(reports);
    });
  }, [classData]);

  useEffect(() => {
    const reportLevelList: { id: number, label: string, points: number }[] = [];

    reportLevelList.push({
      id: 1,
      label: languageContext.language.NOT_SERIOUS,
      points: appInfo.report_class_level_1
    });

    reportLevelList.push({
      id: 2,
      label: languageContext.language.QUITE_SERIOUS,
      points: appInfo.report_class_level_2
    });

    reportLevelList.push({
      id: 3,
      label: languageContext.language.SERIOUS,
      points: appInfo.report_class_level_3
    });

    reportLevelList.push({
      id: 4,
      label: languageContext.language.EXTREMELY_SERIOUS,
      points: appInfo.report_class_level_4
    });

    setReportLevelList(reportLevelList);
  }, []);

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
            {classData && <ClassComponent classData={classData}/>}
          </View>

          {classData?.is_reported && (
            <View style={{flex: 1, margin: 20,}}>
              <Text style={[styles.btnReportText, {color: TextColor.danger}]}>
                Danh sach bao cao
              </Text>

              <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{flex: 1}}>
                {reportList.map((report, index) => (
                  <Pressable key={index} style={[styles.btnReport, styles.btnShowdow, reportListStyle.container]}
                             onPress={() => goToViewReport(report)}>
                    <View style={{flexDirection: "row"}}>
                      <Text
                        style={reportListStyle.level}>{reportLevelList.find(rl => rl.id === report.report_level)?.label}</Text>
                      <Text
                        style={reportListStyle.time}>⏰{DateTimeConfig.getDateFormat(new Date(report.created_at).getTime(), true, true)}</Text>
                    </View>

                    <View style={{flexDirection: "row", marginTop: 10,}}>
                      <Image src={ReactAppUrl.PUBLIC_URL + report.reporter?.avatar} style={reportListStyle.avatar}/>

                      <View style={{flex: 1}}>
                        <Text style={reportListStyle.username}>{report.reporter?.full_name}</Text>
                        <Text style={reportListStyle.content}>{report.content.substring(0, 50)}...</Text>
                      </View>
                    </View>

                  </Pressable>
                ))}
              </ScrollView>

              <Pressable style={[styles.btnReport, styles.btnShowdow, {alignSelf: "center"}]}
                         onPress={handleDeleteClass}>
                <Text style={styles.btnReportText}>{"Xoa lop hoc vinh vien"}</Text>
              </Pressable>

            </View>
          )}

          <View style={styles.bodyContainer}>
            {/* Danh sách các buổi học */}
            <View style={styles.titleContainer}>
              <Ionicons name="book-outline" size={24} color="black"/>
              <Text style={styles.title}>Các buổi học</Text>
            </View>
            <View style={styles.lessonListContainer}>
              <FlatList
                horizontal={true}
                data={lessons}
                renderItem={({item: lesson}) => (
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
                        style={[styles.contenLessonTitle, {marginBottom: 10}]}
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
                contentContainerStyle={{padding: 10}}
              />
            </View>
          </View>

          {/* Danh sách học sinh của lớp */}
          <View style={[styles.titleContainer, {marginTop: 15}]}>
            <Ionicons name="people-outline" size={24} color="black"/>
            <Text style={styles.title}>Danh sách học sinh</Text>
          </View>
          <View style={styles.studentListContainer}>
            {userList &&
              userList.map((user, index) => (
                <View
                  key={index}
                  style={[styles.studentItem, styles.boxshadow]}
                >
                  <Image
                    source={{uri: `${URL}${user.avatar}`}}
                    style={styles.studentAvatar}
                  />
                  <Text style={styles.studentText}>{user.full_name}</Text>
                </View>
              ))}
            {!userList && <Text>Chưa có người học trong lớp này</Text>}
          </View>
        </View>
      </ScrollView>
      {activeTab === CLASS_TAB.PENDING_APPROVAL && (
        <View>
          {!approveResult ? (
            <View style={styles.btnCotainer}>
              <TouchableOpacity onPress={handleDenyClass} style={[styles.btn, styles.btnDeny]}>
                <Text style={styles.btnDenyText}>Từ Chối</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApproveClass}
                style={[styles.btn, styles.btnAccept]}
              >
                <Text style={styles.btnAcceptText}>Chấp nhận</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.btnCotainer}>
              <TouchableOpacity
                disabled={true}
                style={[styles.btn, styles.btnAcceptDisable]}
              >
                <Text style={styles.btnAcceptText}>Chờ thanh toán</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {activeTab === CLASS_TAB.PENDING_PAY && (
        <View>
          {!approvePayResult ? (
            <View style={styles.btnCotainer}>
              <TouchableOpacity style={[styles.btn, styles.btnDeny]}>
                <Text style={styles.btnDenyText}>Nhắc nhở</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApprovePaymentByAdmin}
                style={[styles.btn, styles.btnAccept]}
              >
                <Text style={styles.btnAcceptText}>Xác nhận trả</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.btnCotainer}>
              <TouchableOpacity
                onPress={handleApprovePaymentByAdmin}
                style={[styles.btn, styles.btnAcceptDisable]}
              >
                <Text style={styles.btnAcceptText}>Đã xác nhận thanh toán</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <ModalDialogForClass
        confirmTitle={modalContent.title}
        confirmContent={modalContent.content}
        imageStatus="success"
        visiable={modalResult}
        onRequestCloseDialog={() => setModalResult(null)}
        loading={loading}
      />
      <ModalInputReason
        confirmTitle="Từ chối"
        confirmContent=""
        imageStatus="confirm"
        visiable={modalResult}
        onRequestCloseDialog={() => setModalResult(null)}/>
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

  btnAcceptDisable: {
    backgroundColor: BackgroundColor.gray_50,
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

const reportListStyle = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 300,
    borderWidth: 0.8,
    borderColor: BackgroundColor.sub_danger,
    marginHorizontal: 10,
    marginBottom: 5,
    marginTop: 5,
    borderRadius: 20,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 35,
    borderWidth: 0.5,
    borderColor: BackgroundColor.sub_danger,
  },

  username: {
    fontWeight: "700",
    paddingHorizontal: 10,
    fontSize: 14,
  },

  content: {
    paddingHorizontal: 10,
    fontSize: 10,
  },

  level: {
    backgroundColor: BackgroundColor.warning,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 10,
    fontSize: 10,
    textAlign: "center",
    textAlignVertical: 'center',
  },

  time: {
    flex: 1,
    textAlign: "right",
    fontSize: 10,
    textAlignVertical: 'center',
    color: TextColor.danger,
  }

});