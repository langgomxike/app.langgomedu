import React, {
  useCallback,
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
  Pressable,
} from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import CourseItem from "../CourseItem";
import { BackgroundColor } from "../../../configs/ColorConfig";
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

const URL = ReactAppUrl.PUBLIC_URL;

type DetailHistoryBottonSheetProps = {
  isVisible: boolean;
  onCloseButtonSheet: () => void;
  userData: User;
};

export default function DetailUserBottomSheet ({
  isVisible,
  onCloseButtonSheet,
  userData,
}: DetailHistoryBottonSheetProps) {
  //state
  const [attendingClasses, setAttendingClasses] = useState<Class[]>([]);
  const [teachingClasses, setTeachingClasses] = useState<Class[]>([]);
  const [createdClasses, setCreatedClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Mở hoặc đóng tùy theo `isVisible`
  if (isVisible && bottomSheetRef.current) {
    bottomSheetRef.current.snapToIndex(1);
  }

  // effects
  useEffect(() => {
    if (isVisible) {
      // Fetch dữ liệu danh sách lớp học
    }
  }, [isVisible]);

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

          {userData.is_reported && (
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity style={[styles.btnReport, styles.btnShowdow]}>
              <Text style={styles.btnReportText}>
                Xem danh sách người báo cáo
              </Text>
            </TouchableOpacity>
          </View>
          )}

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
