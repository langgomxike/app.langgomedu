import React from "react";
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
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import { BackgroundColor } from "../../configs/ColorConfig";
import ModalStudentList from "../components/modal/ModalStudentList";
import ModalAttended from "../components/modal/ModalAttended";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ModalPaidResult from "../components/modal/ModalPaidResult";
import ClassInfo from "../components/ClassInfo";

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

export default function Attendance() {
  const [modalVisible, setModalVisible] = React.useState<string | null>("");

  const listRef = useAnimatedRef<Animated.View>();
  const heightValue = useSharedValue(0);
  const open = useSharedValue(false);
  const progress = useDerivedValue(() =>
    open.value ? withTiming(1) : withTiming(0)
  );

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

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 10 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.userContainer}>
                <Image
                  source={require("../../../assets/images/img_avatar_user.png")}
                  style={styles.avatarUser}
                />
                <Text style={styles.userName}>Nguyễn Văn A</Text>
                <Text style={styles.pointText}>200</Text>
              </View>
            </View>
            <View style={styles.bodyContainer}>
              {/* Class infomation */}
              <View style={styles.classInfoContainer}>
                <ClassInfo/>
              </View>

              {/* Other user */}
              <View style={styles.otherUserContainer}>
                <Text style={styles.titleContainer}>Phụ huyh/học sinh</Text>
                <FlatList
                  data={[1, 1, 1, 1, 1, 1]}
                  renderItem={({ item }) => (
                    <View style={[styles.otherUserBox, styles.boxshadow]}>
                      <Pressable
                        style={styles.otherUserPressable}
                        onPress={() => {
                          open.value = !open.value;
                        }}
                      >
                        <View style={styles.otherUser}>
                          <View style={styles.otherUserAvatarContainer}>
                            <Image
                              source={require("../../../assets/avatar/img_avatar_cat.png")}
                              style={styles.otherUserAvatar}
                            />
                          </View>
                          <Text style={styles.otherUserName}>Nguyễn Văn B</Text>
                        </View>

                        <TouchableOpacity
                          onPress={() => {
                            open.value = !open.value;
                          }}
                          style={styles.chevronIcon}
                        >
                          <Animated.View style={iconStyle}>
                          <Ionicons name="chevron-down-outline" size={20} color="black" />
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
                            <Text style={styles.textContentTitle}>Đã chuyển khoản cho bạn!</Text>
                            <TouchableOpacity onPress={() => setModalVisible('modal_paid_result')}>
                            <Text style={styles.textSubTitle}>Xem thông tin</Text>
                            </TouchableOpacity>
                            <View style={styles.btnContainer}>
                              <TouchableOpacity
                                style={[styles.btn, styles.btnDeny, styles.boxshadow]}
                              >
                                <Text style={styles.btnText}>Từ chối</Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={[styles.btn, styles.btnAccpet, styles.boxshadow]}
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
                  contentContainerStyle={styles.otherUserContainerList}
                />
              </View>

              {/* History attendce list */}
              <TouchableOpacity
                onPress={() => setModalVisible("modal_attended")}
              >
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
          onPress={() => setModalVisible("modal_student_list")}
          style={styles.btnAttendce}
        >
          <Text style={styles.btnAttendceText}>Điểm danh</Text>
        </TouchableOpacity>
      </View>

      {/* Modal show paid result */}
      <ModalPaidResult 
      visiable={modalVisible}
      onRequestClose={() => setModalVisible(null)}
      image_uri="https://help.senpay.vn/hc/article_attachments/16787882502041"
      />

       {/* Modal show student list */}
      <ModalStudentList
        visible={modalVisible}
        onRequestClose={() => setModalVisible(null)}
        studentList={studentList}
      />

      {/* Modal show history attended list */}
      <ModalAttended
        visible={modalVisible}
        onRequestClose={() => setModalVisible(null)}
        studentList={studentList}
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
    paddingTop: 70,
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
    fontSize: 16,
    marginTop: 10,
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
    backgroundColor: BackgroundColor.primary,
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
    fontWeight: "bold",
    fontSize: 15,
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
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
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
});
