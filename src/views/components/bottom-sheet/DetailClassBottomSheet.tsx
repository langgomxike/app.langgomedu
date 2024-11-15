import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
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
import { NavigationContext, RouteProp, useRoute } from "@react-navigation/native";
import ScreenName from "../../../constants/ScreenName";
import { RootStackParamList } from "../../../configs/NavigationRouteTypeConfig";

type DetailHistoryBottonSheetProps = {
  isVisible: boolean;
  onCloseButtonSheet: () => void;
  classData: Class | undefined;
};

const ICON_SIZE = 20;

export default function ({
  isVisible,
  onCloseButtonSheet,
  classData,
}: DetailHistoryBottonSheetProps) {
  const navigation = useContext(NavigationContext);
  //state
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
    if(classData){
      navigation?.navigate(ScreenName.REPORT_CLASS, { classId: classData.id });
    }
  }

  // effect
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
          <View style={styles.headerContainer}>
            {classData && <ClassComponent classData={classData} />}
          </View>

          {classData?.is_reported &&
          <View style={{ alignItems: "center" , paddingVertical: 20,}}>
            <TouchableOpacity onPress={goToReportClass} style={[styles.btnReport, styles.btnShowdow]}>
              <Text style={styles.btnReportText}>
                Xem các báo cáo
              </Text>
            </TouchableOpacity>
          </View>
          }



          <View style={styles.bodyContainer}>
            {/* Danh sách học sinh của lớp */}
            <View style={styles.titleContainer}>
              <Ionicons name="people-outline" size={24} color="black" />
              <Text style={styles.title}>Danh sách học sinh</Text>
            </View>
            <View style={styles.studentListContainer}>
              {userList &&
                userList.map((user, index) => (
                  <View key={index} style={styles.contentStudentComponent}>
                    <Text style={styles.bullet}>{"\u2B24"}</Text>
                    <Text style={styles.contentStudent}>{user.full_name}</Text>
                  </View>
                ))}
            </View>

            {/* Danh sách các buổi học */}
            <View style={styles.titleContainer}>
              <Ionicons name="book-outline" size={24} color="black" />
              <Text style={styles.title}>Các buổi học</Text>
            </View>
            <View style={styles.lessonListContainer}>
              <FlatList
                scrollEnabled={false}
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
                        <Text>Buổi học</Text>
                      </View>
                      <Text>Thứ 2</Text>
                    </View>

                    <View style={styles.contentLessonContainer}>
                      <View style={styles.contenLessonTitle}>
                        <Ionicons
                          name="timer-outline"
                          size={ICON_SIZE}
                          color="black"
                        />
                        <Text>Thời lượng</Text>
                      </View>
                      <Text>2 giờ</Text>
                    </View>

                    <View style={styles.contentLessonContainer}>
                      <View style={styles.contenLessonTitle}>
                        <Ionicons
                          name="git-commit-outline"
                          size={ICON_SIZE}
                          color="black"
                        />
                        <Text>Hình thức</Text>
                      </View>
                      <Text>Online</Text>
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
                      <Text>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Harum amet minima nesciunt? Quam iure ut fuga cum
                        aut est ad, nobis ea facilis enim similique commodi unde
                        totam veniam doloribus.
                      </Text>
                    </View>
                  </View>
                )}
                contentContainerStyle={{ padding: 10 }}
              />
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

  studentListContainer: {
    backgroundColor: "rgba(13, 153, 255, 0.18)",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    gap: 14,
    marginHorizontal: 20,
  },

  contentStudent: {},

  bullet: {
    fontSize: 7,
  },

  contentStudentComponent: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
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
    borderColor: BackgroundColor.gray_e6
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
