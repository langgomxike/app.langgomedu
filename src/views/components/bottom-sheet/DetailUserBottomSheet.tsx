import React, {
  useCallback, useContext,
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
  Pressable, Modal,
} from "react-native";
import BottomSheet, {BottomSheetBackdrop} from "@gorhom/bottom-sheet";
import {FlatList, ScrollView} from "react-native-gesture-handler";
import CourseItem from "../CourseItem";
import {BackgroundColor, TextColor} from "../../../configs/ColorConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import User from "../../../models/User";
import ReactAppUrl from "../../../configs/ConfigUrl";
import AClass from "../../../apis/AClass";
import Class from "../../../models/Class";
import ClassListSkeleton from "../skeleton/ClassListSkeleten";
import moment from "moment";
import UserComponent from "../admin/UserComponent";
import UserClassManager from "../UserClassManager";
import {LanguageContext} from "../../../configs/LanguageConfig";
import {NavigationContext} from "@react-navigation/native";
import ScreenName from "../../../constants/ScreenName";
import {IdNavigationType, ReportNavigationType} from "../../../configs/NavigationRouteTypeConfig";
import {AccountContext} from "../../../configs/AccountConfig";
import {RoleList} from "../../../models/Role";
import Toast from "react-native-simple-toast";
import DateTimeConfig from "../../../configs/DateTimeConfig";
import Report from "../../../models/Report";
import AUserAdmin from "../../../apis/admin/AUserAdmin";
import {AppInfoContext} from "../../../configs/AppInfoContext";

const URL = ReactAppUrl.PUBLIC_URL;

type DetailHistoryBottonSheetProps = {
  isVisible: boolean;
  onCloseButtonSheet: () => void;
  userData: User;
};

export default function DetailUserBottomSheet({
                                                isVisible,
                                                onCloseButtonSheet,
                                                userData,
                                              }: DetailHistoryBottonSheetProps) {
  //contexts
  const languageContext = useContext(LanguageContext).language;
  const navigation = useContext(NavigationContext);
  const accountContext = useContext(AccountContext);
  const appInfo = useContext(AppInfoContext).infos;

  //state
  const [attendingClasses, setAttendingClasses] = useState<Class[]>([]);
  const [teachingClasses, setTeachingClasses] = useState<Class[]>([]);
  const [createdClasses, setCreatedClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  const [reportList, setReportList] = useState<Report[]>([]);
  const [reportLevelList, setReportLevelList] = useState<{ id: number, label: string, points: number }[]>([]);

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

  const goToUserPermission = useCallback(() => {

    if (!accountContext.account || !accountContext.account.roles.map(r => r.id).includes(RoleList.SUPER_ADMIN)) {
      Toast.show("Bạn không có quyền truy cập vào trang quản lý quyền", 1000);
      return;
    }

    const data: IdNavigationType = {
      id: userData.id
    }

    navigation?.navigate(ScreenName.USER_PERMISSION_MANAGEMENT, data);
  }, [userData, accountContext.account]);

  const goToViewReport = useCallback((report: Report) => {
    const data: ReportNavigationType = {
      id: report.id,
      reporter: report.reporter ?? new User(),
    }
    navigation?.navigate(ScreenName.UPDATE_REPORT_USER, data);
  }, [])

  // Mở hoặc đóng tùy theo `isVisible`
  if (isVisible && bottomSheetRef.current) {
    bottomSheetRef.current.snapToIndex(1);
  }

  // effects
  useEffect(() => {
    AUserAdmin.getReportsOfUser(userData, reports => {
      setReportList(reports);
    });
  }, [userData]);

  useEffect(() => {
    const reportLevelList: { id: number, label: string, points: number }[] = [];

    reportLevelList.push({
      id: 1,
      label: languageContext.NOT_SERIOUS,
      points: appInfo.report_class_level_1
    });

    reportLevelList.push({
      id: 2,
      label: languageContext.QUITE_SERIOUS,
      points: appInfo.report_class_level_2
    });

    reportLevelList.push({
      id: 3,
      label: languageContext.SERIOUS,
      points: appInfo.report_class_level_3
    });

    reportLevelList.push({
      id: 4,
      label: languageContext.EXTREMELY_SERIOUS,
      points: appInfo.report_class_level_4
    });

    setReportLevelList(reportLevelList);
  }, []);

  //render
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
          {/* <View style={styles.userHeaderContainer}>
            <View style={styles.userInfoBlock}>
              <View style={styles.userAvatarContainer}>
                <Image
                  source={{ uri: `${URL}${userData.avatar}` }}
                  style={styles.userAvatar}
                />
                <Text style={styles.userFullName}>{userData.full_name}</Text>
              </View>
              {userData.is_reported && (
                <Text style={styles.badge}>Bị báo cáo</Text>
              )}
            </View>

            <View style={styles.line}></View>

            <View style={styles.userHeaderContent}>
              <View style={[styles.row, { marginBottom: 10 }]}>
                <Text
                  style={[styles.title, { color: BackgroundColor.primary }]}
                >
                  Điểm uy tín:
                </Text>
                <Text style={styles.content}>
                  {userData.point}
                </Text>
              </View>

              <View style={styles.rowItem}>
                <View style={[styles.row, { flex: 1 }]}>
                  <Ionicons name="calendar-outline" size={20} color="black" />
                  <Text style={styles.content}>{moment(userData.birthday).format("DD/MM/YYYY")}</Text>
                </View>

                <View style={[styles.row, { flex: 1 }]}>
                  <Ionicons name="call-outline" size={20} color="black" />
                  <Text style={styles.content}>{userData.phone_number}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <MaterialIcons
                  name="location-history"
                  size={20}
                  color="black"
                />
                <Text style={[styles.content, {marginTop: 7}]}>
                {`${userData.address?.ward}, ${userData.address?.district}, ${userData.address?.province}`}
              </Text>
              </View>
            </View>
          </View> */}

          <UserComponent userData={userData}/>

          <View style={{alignItems: "center"}}>
            <TouchableOpacity style={[styles.btnReport, styles.btnShowdow, {borderColor: BackgroundColor.warning}]}
                              onPress={goToUserPermission}>
              <Text style={[styles.btnReportText, {color: TextColor.warning}]}>
                Phan quyen nguoi dung
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{flex: 1, marginTop: 20,}}>
            <Text style={[styles.btnReportText, {color: TextColor.danger}]}>
              Danh sach bao cao
            </Text>

            {userData.is_reported && (
              <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{flex: 1}}>
                {reportList.map((report, index) => (
                  <Pressable key={index} style={[styles.btnReport, styles.btnShowdow, reportListStyle.container]}
                             onPress={() => goToViewReport(report)}>
                    <View style={{flexDirection: "row"}}>
                      <Text style={reportListStyle.level}>{reportLevelList.find(rl => rl.id === report.report_level)?.label}</Text>
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

            )}
          </View>

          <View style={styles.userBodyContainer}>
            <UserClassManager userId={userData.id}/>
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
  },

  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
  },

  userHeaderContainer: {},

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

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  rowItem: {
    flexDirection: "row",
    marginBottom: 10,
  },

  title: {
    fontSize: 14,
    fontWeight: "bold",
  },

  content: {
    fontSize: 14,
    lineHeight: 20,
  },

  showMoreContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  showMoreText: {
    color: BackgroundColor.gray_c9,
  },

  line: {
    backgroundColor: BackgroundColor.gray_c6,
    height: 1,
    marginVertical: 10,
  },
  userBodyContainer: {
    marginTop: 20,
  },

  titleBody: {
    fontWeight: "bold",
    marginTop: 20,
    fontSize: 18,
  },

  classContainer: {},

  classItem: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: 300,
  },

  classList: {
    paddingBottom: 10,
  },

  centeredItem: {
    flex: 1,
    justifyContent: "center",
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
    backgroundColor: BackgroundColor.white
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

})