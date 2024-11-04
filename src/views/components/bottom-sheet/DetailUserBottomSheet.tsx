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

const URL = ReactAppUrl.PUBLIC_URL;

type DetailHistoryBottonSheetProps = {
  isVisible: boolean;
  onCloseButtonSheet: () => void;
  userData: User;
};

export default function ({
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

  function fomatDate(timestamp: number) {
    if (!timestamp) return ""; // Kiểm tra nếu timestamp là undefined hoặc null

    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Trả về chuỗi theo định dạng DD/MM/YYYY
  }

  // Mở hoặc đóng tùy theo `isVisible`
  if (isVisible && bottomSheetRef.current) {
    bottomSheetRef.current.snapToIndex(1);
  }

  // effects
  useEffect(() => {
    if (isVisible) {
      // Fetch dữ liệu danh sách lớp học
      AClass.getAttedingClass(
        userData.id,
        (data) => {
          setAttendingClasses(data);
        },
        setLoading
      );
      AClass.getTeachingClass(
        userData.id,
        (data) => {
          setTeachingClasses(data);
        },
        setLoading
      );

      AClass.getCreatedClass(
        userData.id,
        (data) => {
          setCreatedClasses(data);
        },
        setLoading
      );
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
          <View style={styles.userHeaderContainer}>
            <View style={styles.userInfoBlock}>
              <View style={styles.userAvatarContainer}>
                <Image
                  source={{ uri: `${URL}${userData.avatar?.path}` }}
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
                  {userData.information?.point}
                </Text>
              </View>

              <View style={styles.rowItem}>
                <View style={[styles.row, { flex: 1 }]}>
                  <Ionicons name="calendar-outline" size={20} color="black" />
                  <Text style={styles.content}>
                    {fomatDate(userData.information?.birthday!)}
                  </Text>
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
                <Text style={[styles.content, { marginTop: 7 }]}>
                  {`${userData.information?.address_4}, ${userData.information?.address_3}\n${userData.information?.address_2}, ${userData.information?.address_1}`}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.userBodyContainer}>
            <View style={styles.classContainer}>
              <Text style={styles.titleBody}>Lớp học đã tham gia</Text>
              <View>
                {loading && <ClassListSkeleton />}
                {!loading && (
                  <FlatList
                    data={attendingClasses}
                    renderItem={({ item: attedingClass }) => {
                      return (
                        <View style={styles.classItem}>
                          <Pressable>
                            <CourseItem
                              majorIconUrl={`${URL}${attedingClass.major?.icon?.path}`}
                              name={attedingClass.title}
                              level={attedingClass.class_level?.vn_name || ""}
                              date={fomatDate(attedingClass.started_at)}
                              time={2}
                              type={"Tại nhà"}
                              address={attedingClass.address_1}
                              cost={attedingClass.price}
                            />
                          </Pressable>
                        </View>
                      );
                    }}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[
                      styles.classList,
                      attendingClasses.length === 1 && styles.centeredItem,
                    ]}
                  />
                )}

                 {!loading && attendingClasses.length == 0 &&
                <Text>Không có lớp học đang tham gia</Text>}
              </View>
            </View>
            <View style={styles.classContainer}>
              <Text style={[styles.titleBody, { marginTop: 50 }]}>
                Lớp học đang dạy
              </Text>
              <View>
                {loading && <ClassListSkeleton />}

                {!loading && (
                  <FlatList
                    data={teachingClasses}
                    renderItem={({ item: attedingClass }) => {
                      return (
                        <View style={styles.classItem}>
                          <Pressable>
                            <CourseItem
                              majorIconUrl={`${URL}${attedingClass.major?.icon?.path}`}
                              name={attedingClass.title}
                              level={attedingClass.class_level?.vn_name || ""}
                              date={fomatDate(attedingClass.started_at)}
                              time={2}
                              type={"Tại nhà"}
                              address={attedingClass.address_1}
                              cost={attedingClass.price}
                            />
                          </Pressable>
                        </View>
                      );
                    }}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[
                      styles.classList,
                      teachingClasses.length === 1 && styles.centeredItem,
                    ]}
                  />
                )}
              </View>
            </View>

            <View style={styles.classContainer}>
              <Text style={[styles.titleBody, { marginTop: 50 }]}>
                Lớp học đã tạo
              </Text>
              <View>
                {loading && <ClassListSkeleton />}

                {!loading && createdClasses.length > 0 && (
                  <FlatList
                    data={createdClasses}
                    renderItem={({ item: createdClass }) => {
                      return (
                        <View style={styles.classItem}>
                          <Pressable>
                            <CourseItem
                              majorIconUrl={`${URL}${createdClass.major?.icon?.path}`}
                              name={createdClass.title}
                              level={createdClass.class_level?.vn_name || ""}
                              date={fomatDate(createdClass.started_at)}
                              time={2}
                              type={"Tại nhà"}
                              address={createdClass.address_1}
                              cost={createdClass.price}
                            />
                          </Pressable>
                        </View>
                      );
                    }}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[
                      styles.classList,
                      createdClasses.length === 1 && styles.centeredItem,
                    ]}
                  />
                )}

                {!loading && createdClasses.length == 0 &&
                <Text>Không có lớp học đã tạo</Text>
                }
              </View>
            </View>
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
});
