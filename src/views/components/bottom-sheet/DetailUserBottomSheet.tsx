import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import CourseItem from "../CourseItem";
import { BackgroundColor } from "../../../configs/ColorConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type DetailHistoryBottonSheetProps = {
  isVisible: boolean;
  onCloseButtonSheet: () => void;
};

export default function ({
  isVisible,
  onCloseButtonSheet,
}: DetailHistoryBottonSheetProps) {
  //state
  const [report, setReport] = useState(false);

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
                  source={require("../../../../assets/avatar/img_avatar_cat.png")}
                  style={styles.userAvatar}
                />
                <Text style={styles.userFullName}>Nguyen Van A</Text>
              </View>
              {
                report &&
              <Text style={styles.badge}>Bị báo cáo</Text>
              }
            </View>

            <View style={styles.line}></View>

            <View style={styles.userHeaderContent}>
              <View style={[styles.row, { marginBottom: 10 }]}>
                <Text
                  style={[styles.title, { color: BackgroundColor.primary }]}
                >
                  Điểm uy tín:
                </Text>
                <Text style={styles.content}>1000</Text>
              </View>

              <View style={styles.rowItem}>
                <View style={[styles.row, { flex: 1 }]}>
                  <Ionicons name="calendar-outline" size={20} color="black" />
                  <Text style={styles.content}>10/10/2024</Text>
                </View>

                <View style={[styles.row, { flex: 1, justifyContent:"flex-end" }]}>
                  <Ionicons name="call-outline" size={20} color="black" />
                  <Text style={styles.content}>0999999999</Text>
                </View>
              </View>

              <View style={styles.row}>
                <MaterialIcons
                  name="location-history"
                  size={20}
                  color="black"
                />
                <Text style={styles.content}>
                  Đường số 6, phường Linh Chiểu, TP Thủ Đức
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.userBodyContainer}>
            <View style={styles.classContainer}>
              <Text style={styles.titleBody}>Lớp học đã tham gia</Text>
              <View>
                <FlatList
                  horizontal={true}
                  data={[1, 2, 3]}
                  renderItem={({ item }) => (
                    <View style={styles.classItem}>
                      <CourseItem
                        majorIconUrl={
                          "https://cdn-icons-png.flaticon.com/128/15311/15311632.png"
                        }
                        name={"Lớp java"}
                        level={"Cơ bản"}
                        date={"20/10/2024"}
                        time={2}
                        type={"Tại nhà"}
                        address={"Linh Chiểu, Thủ đức, TP HCM"}
                        cost={50000}
                      />
                    </View>
                  )}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </View>
            <View style={styles.classContainer}>
              <Text style={[styles.titleBody, {marginTop: 50}]}>Lớp học đã tham gia</Text>
              <View>
                <FlatList
                  horizontal={true}
                  data={[1, 2, 3]}
                  renderItem={({ item }) => (
                    <View style={styles.classItem}>
                      <CourseItem
                        majorIconUrl={
                          "https://cdn-icons-png.flaticon.com/128/15311/15311632.png"
                        }
                        name={"Lớp java"}
                        level={"Cơ bản"}
                        date={"20/10/2024"}
                        time={2}
                        type={"Tại nhà"}
                        address={"Linh Chiểu, Thủ đức, TP HCM"}
                        cost={50000}
                      />
                    </View>
                  )}
                  showsHorizontalScrollIndicator={false}
                />
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
});
