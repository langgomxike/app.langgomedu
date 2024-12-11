import React, {useCallback, useContext, useEffect, useState} from "react";
import {FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import CustomInput from "../../components/Inputs/CustomInput";
import {BackgroundColor} from "../../../configs/ColorConfig";
import DetailHistoryBottonSheet from "../../components/bottom-sheet/DetailHistoryBottomSheet";
import Attendance from "../../../models/Attendance";
import SearchBar from "../../components/Inputs/SearchBar";
import IconReport from "../../components/ItemUserReport";
import User from "../../../models/User";
import {NavigationContext, NavigationRouteContext} from "@react-navigation/native";
import ScreenName from "../../../constants/ScreenName";
import {AttendanceNavigationType, IdNavigationType} from "../../../configs/NavigationRouteTypeConfig";
import {AccountContext} from "../../../configs/AccountConfig";
import SFirebase, {FirebaseNode} from "../../../services/SFirebase";
import AUser from "../../../apis/AUser";
import AAttendance from "../../../apis/AAttendance";
import DateTimeConfig from "../../../configs/DateTimeConfig";
import ReactAppUrl from "../../../configs/ConfigUrl";
import SLog, {LogType} from "../../../services/SLog";
import Toast from "react-native-simple-toast";
import {LanguageContext} from "../../../configs/LanguageConfig";
import Ionicons from "@expo/vector-icons/Ionicons";

interface AttendanceItem {
  date: number,
  histories: Attendance[]
}

export default function HistoryAttendance() {
  //conetxts
  const navigation = useContext(NavigationContext);
  const accountContext = useContext(AccountContext);
  const route = useContext(NavigationRouteContext);
  const language = useContext(LanguageContext).language;

  // states
  const [fromDate, setFromDate] = useState(new Date(2024, 0, 1).getTime());
  const [toDate, setToDate] = useState(new Date().getTime());
  const [historyList, setHistoryList] = useState<AttendanceItem[]>([]);
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
  const [attendanceListInClass, setAttendanceListInClass] = useState<Attendance[]>([]);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [searchKey, setSearchKey] = useState("");
  const [activeAttendance, setActiveAttendance] = useState<Attendance | undefined>(undefined);

  // handlers
  const openProfile = useCallback(() => {
    const data: IdNavigationType = {
      id: user?.id ?? "-1",
    }
    navigation?.navigate(ScreenName.PROFILE, data);
  }, [user]);

  const handleSetFromDate = useCallback((value: string) => {
    const values = value.split("/");

    if (values.length < 3) {
      Toast.show("Invalid date", 1000);
      return;
    }

    const date = new Date(+values[2], +values[1] - 1, +values[0]);

    if (date.getTime() > toDate || date.getTime() < new Date(2024, 0, 1).getTime()) {
      Toast.show("Invalid date", 1000);
      return;
    }

    setFromDate(date.getTime());
  }, [toDate]);

  const handleSetToDate = useCallback((value: string) => {
    const values = value.split("/");

    if (values.length < 3) {
      Toast.show("Invalid date", 1000);
      return;
    }

    const date = new Date(+values[2], +values[1] - 1, +values[0]);

    if (date.getTime() < fromDate || date.getTime() > new Date().getTime()) {
      Toast.show("Invalid date", 1000);
      return;
    }

    setToDate(date.getTime());
  }, [fromDate]);

  //effects
  useEffect(() => {
    if (navigation) {
      navigation.setOptions({
        title: language.ATTENDANCE_HISTORY,
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
    const data: AttendanceNavigationType = route?.params as AttendanceNavigationType ?? {userId: accountContext.account?.id};
    let userId: string = data.userId;

    if (userId === "-1") {
      userId = accountContext.account?.id + "";
    }

    // userId = "000004_child001";

    SFirebase.track(FirebaseNode.Users, [{key: FirebaseNode.Id, value: userId}], () => {
      AUser.getUserById(userId, user => {
        setUser(user);
      });
    });

    SFirebase.track(FirebaseNode.Attendances, [], () => {
      AAttendance.getAttendanceHistoriesOfUser(userId, attendances => {
        setAttendanceList(attendances);
      });
    });
  }, [accountContext.account]);

  useEffect(() => {
    const data: AttendanceNavigationType = route?.params as AttendanceNavigationType ?? {classId: -1};
    let classId: number = data.classId;

    // classId = 2;

    const attendances = attendanceList
      .filter(a => classId > 0 ? a.class?.id === classId : true)
      .filter(a => (a.class?.title ?? "").toUpperCase().includes(searchKey?.toUpperCase().trim()) || searchKey?.toUpperCase()?.trim()?.includes((a.class?.title ?? "").toUpperCase()));

    const dates = Array.from(new Set(attendances.map(a => (a.lesson?.started_at ?? 0)).filter(d => d > 0)));
    const histories: AttendanceItem[] = [];

    dates.forEach(date => {
      histories.push({
        date: date,
        histories: attendances.filter(a => DateTimeConfig.getDateFormatFullYear(a.lesson?.started_at ?? 0) === DateTimeConfig.getDateFormatFullYear(date)),
      })
    });

    setHistoryList(histories);
  }, [searchKey, attendanceList]);

  // render
  return (
    <View style={styles.container}>
      <View style={{margin: 10}}>
        <IconReport
          userAvatar={user?.avatar + ""}
          userName={user?.full_name + ""}
          credibility={user?.point ?? 0}
          onPress={openProfile}
        />
      </View>


      <View style={{margin: 10}}>
        <SearchBar value={searchKey} onChangeText={setSearchKey}/>
      </View>

      <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
        <View style={styles.queryContaienr}>
          <View style={[styles.queryDateBlock, styles.marginBottom]}>
            <View style={{flex: 1}}>
              <CustomInput
                label="Từ ngày"
                placeholder=""
                required={false}
                value={DateTimeConfig.getDateFormatFullYear(fromDate)}
                onChangeText={handleSetFromDate}
                type="date"
              />
            </View>

            <View style={{flex: 1}}>
              <CustomInput
                label="Đến ngày"
                placeholder=""
                required={false}
                value={DateTimeConfig.getDateFormatFullYear(toDate)}
                onChangeText={handleSetToDate}
                type="date"
              />
            </View>
          </View>
        </View>

        <View style={styles.historyContainer}>
          <FlatList
            data={historyList.filter(h => h.date >= fromDate && h.date <= toDate + 23 * 60 * 60 * 1000)}
            scrollEnabled={false}
            keyExtractor={(item, index) => DateTimeConfig.getDateFormatFullYear(item.date) + index}
            renderItem={({item: bigItem}) => (
              <View style={[styles.sectionContainer, styles.boxShadow]}>
                {/* Hiển thị ngày */}
                <View style={styles.headerContainer}>
                  <Text
                    style={[styles.headerText, {fontSize: 15}]}>{DateTimeConfig.getDateFormatFullYear(bigItem.date)}</Text>
                </View>

                {/* FlatList bên trong để hiển thị các giao dịch của ngày */}
                <FlatList
                  scrollEnabled={false}
                  data={bigItem.histories}
                  keyExtractor={(subItem, index) => subItem.id + "" + index}
                  renderItem={({item: subItem}) => (
                    <View style={[styles.itemContainer]}>
                      <TouchableOpacity activeOpacity={0.5} onPress={() => setActiveAttendance(subItem)}>

                        <View style={[styles.itemContentContainer, {marginBottom: 10,}]}>
                          <View style={styles.subjectContainer}>
                            <Image
                              src={ReactAppUrl.PUBLIC_URL + subItem?.user?.avatar}
                              style={[styles.subjectImage, {borderRadius: 100}]}
                            />
                            <Text style={[styles.title, {fontSize: 14}]}>{subItem?.user?.full_name}</Text>
                          </View>

                          <Text style={[styles.userStatus, subItem?.class?.tutor?.id === user?.id ?styles.statusTutor :  styles.statusLeaner]}>
                          {subItem?.class?.tutor?.id === user?.id ? "Lớp dạy" : "Lớp học"}
                          </Text>
                        </View>

                        <View style={styles.itemContentContainer}>
                          <View style={styles.subjectContainer}>
                            <Image
                              src={ReactAppUrl.PUBLIC_URL + subItem?.class?.major?.icon}
                              style={styles.subjectImage}
                            />
                            <Text style={[styles.title, {fontSize: 14}]}>{subItem?.class?.title}</Text>
                          </View>

                          <Text
                            style={styles.price}>{(subItem?.deferred ?? false) ? "~" : subItem?.class?.tutor?.id === user?.id ? "+" : "-"}{subItem?.class?.price}</Text>

                        </View>

                        <View style={styles.itemBadgeContainer}>
                          {!!(subItem?.attended ?? 0) && (<Text style={[styles.badge, styles.attendedText]}>
                            Điểm danh
                          </Text>)}

                          {!!(subItem?.paid ?? 0) && (<Text style={[styles.badge, styles.payText]}>
                            Thanh toán
                          </Text>)}

                          {!!(subItem?.deferred ?? 0) && (<Text style={[styles.badge, styles.deferredText]}>
                            No hoc phi
                          </Text>)}
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            )}
          />
        </View>
      </ScrollView>
      <DetailHistoryBottonSheet
        attendance={activeAttendance}
        isVisible={!!activeAttendance}
        onCloseButtonSheet={() => setActiveAttendance(undefined)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.white,
  },

  queryContaienr: {
    marginTop: 20,
    paddingHorizontal: 20,
  },

  queryDateBlock: {
    flexDirection: "row",
    gap: 20,
  },

  marginBottom: {
    marginBottom: 20,
  },

  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  btnQuery: {
    backgroundColor: BackgroundColor.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
  },

  btnQueryText: {
    color: BackgroundColor.white,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },

  colorInfoContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 30,
    marginTop: 30,
  },

  colorInfoItem: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  color: {
    width: 25,
    height: 10,
    borderRadius: 999
  },

  tutorColor: {
    backgroundColor: "#76E5D8",
  },

  leanerColor: {
    backgroundColor: "#FD9011",
  },

  historyContainer: {
    marginVertical: 20,
  },

  sectionContainer: {
    borderColor: "#CFDFF9",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 20,
    backgroundColor: BackgroundColor.white,
  },

  headerContainer: {
    backgroundColor: "#E8EEFE",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  itemContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBlockColor: "#CFDFF9",
    borderBottomWidth: 1,
  },

  itemContentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
  },

  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#33B55D",
  },

  tutorBorderRight: {
    borderRightColor: "#76E5D8",
  },

  learnerBorderRight: {
    borderRightColor: "#FD9011",
  },

  itemBadgeContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },

  subjectContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  subjectImage: {
    width: 35,
    height: 35,
  },

  badge: {
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 3,
    fontSize: 10,
  },

  payText: {
    backgroundColor: BackgroundColor.warning,
    color: BackgroundColor.black,
    fontWeight: 500,
  },

  deferredText: {
    backgroundColor: BackgroundColor.danger,
    color: BackgroundColor.white,
    fontWeight: 500,
  },

  attendedText: {
    backgroundColor: BackgroundColor.primary,
    color: BackgroundColor.white,
    fontWeight: 500,
  },

  userStatus: {
    fontWeight: "500",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    fontSize: 12,
    position: "absolute",
    right: 0,
    top: 0,
  },

  statusTutor: {
    backgroundColor: "rgba(73, 253, 38, 0.15)",
    color: "#03560A",
  },

  statusLeaner: {
    backgroundColor: "rgba(253, 144, 17, 0.10)",
    color: "#FD9011",
  },
});
