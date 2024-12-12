import React, {useContext, useCallback, useState, useEffect} from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import {BackgroundColor} from "../../../configs/ColorConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  NavigationContext,
  NavigationRouteContext,
} from "@react-navigation/native";
import ScreenName from "../../../constants/ScreenName";
import Lesson from "../../../models/Lesson";
import AAttendance from "../../../apis/AAttendance";
import ClassInfo from "../../components/ClassInfo";
import ReactAppUrl from "../../../configs/ConfigUrl";
import ModalConfirmAttendClass from "../../components/modal/ModalConfirmAttendLesson";
import Attendance from "../../../models/Attendance";
import {AttendanceNavigationType, AttendedForLearner} from "../../../configs/NavigationRouteTypeConfig";
import ModalPay from "../../components/modal/ModalPay";
import {AccountContext} from "../../../configs/AccountConfig";
import User from "../../../models/User";
import SFirebase, {FirebaseNode} from "../../../services/SFirebase";
import {LanguageContext} from "../../../configs/LanguageConfig";
import {SCREEN_WIDTH} from "@gorhom/bottom-sheet";
import moment from "moment";

const URL = ReactAppUrl.PUBLIC_URL;

export default function LeanerAttendance() {
  // contexts
  const route = useContext(NavigationRouteContext);
  const param = (route?.params as AttendedForLearner) || {
    lesson: new Lesson(),
    user: new User(),
  };

  //context
  const account = useContext(AccountContext).account;
  const navigation = useContext(NavigationContext);
  const language = useContext(LanguageContext).language;

  const days = [
    language.SUNDAY,
    language.MONDAY,
    language.TUESDAY,
    language.WEDNESDAY,
    language.THURSDAY,
    language.FRIDAY,
    language.SATURDAY,
  ];

  // states
  const [modalVisible, setModalVisible] = useState<string | null>("");
  const [modalName, setModalName] = useState("");

  const [lessonDetail, setLessonDetail] = useState(new Lesson());
  const [user, setUser] = useState<User>(new User());
  const [attendance, setAttendance] = useState<Attendance>();
  const [deffereds, setDefffereds] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  const [paymentResult, setPaymentResult] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [realTimeStatus, setRealTimeStatus] = useState<number>(0);

  // Handler
  function formatCurrency(amount: number, locale = "vi-VN", currency = "VND") {
    // Kiểm tra nếu không phải số, trả về chuỗi lỗi
    if (typeof amount !== "number") return "Invalid input";

    return amount.toLocaleString(locale, {
      style: "currency",
      currency,
    });
  }

  // Xử lý chuyển đến màn hình lịch sử đăng nhập
  const handleNavigateAttendanceHistory = useCallback(() => {
    if (!user || !user.id || !lessonDetail || !lessonDetail.class || !lessonDetail.class.id) return;

    const data: AttendanceNavigationType = {
      userId: user.id,
      classId: lessonDetail.class.id
    }

    navigation?.navigate(ScreenName.ATTENDANCE_HISTORY, data);
  }, [user, lessonDetail]);

  const handlePayment = useCallback(
    async (status: string) => {
      let deferred = false;
      let paid = false;
      if (status === "pay") {
        deferred = false;
        paid = true;
        setModalName("showPaid");
        setModalVisible("modalDialogForClass");
      } else {
        deferred = true;
        paid = false;
        setModalName("showDeffered");
        setModalVisible("modalDialogForClass");
      }

      console.log(`paid: ${paid}, deffered: ${deferred}`);
      const formData = new FormData();

      // Thêm ảnh vào formData
      if (selectedImage && paymentMethod === "bank") {
        console.log("selected image", selectedImage);
        formData.append("file", {
          uri: selectedImage.uri,
          name: selectedImage.fileName,
          type: selectedImage.mimeType,
        } as any);
      }

      // Thêm các dữ liệu khác vào formData
      formData.append("lesson_id", String(lessonDetail.id));
      formData.append("user_id", user.id);
      formData.append("paid", String(paid));
      formData.append("type", paymentMethod);
      formData.append("deferred", String(deferred));

      if(deffereds.length > 0){
        const deferredLessons = deffereds.map((attendance) => attendance.lesson_id);
        const deferredIdsString = JSON.stringify(deferredLessons);
        formData.append("deferred_lessons", deferredIdsString);
      }

      AAttendance.sendLearnerPayment(
        formData,
        (data) => {
          setPaymentResult(data.result);
        },
        setLoading
      );
    },
    [user, selectedImage, deffereds]
  );

  const handlePay = () => {
    setModalVisible("modalPay");
  };

  // effects
  useEffect(() => {
    if (navigation) {
      navigation.setOptions({
        title: lessonDetail?.class?.title,
        headerShown: true,
        contentStyle: {
          padding: 0,
        },
        headerStyle: {
          backgroundColor: BackgroundColor.primary,
        },
        headerTintColor: "#fff",
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{paddingRight: 10, flexDirection: "row", gap: 5}}>
            <Ionicons name="chevron-back" size={24} color="white" style={{alignSelf: "center"}}/>
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, lessonDetail]);

  useEffect(() => {
    if (user && lessonDetail.class) {
      AAttendance.getAttendanceByLearnerLesson(
        lessonDetail.id,
        user.id,
        lessonDetail.class.id,
        (attendanceData, deferredsData) => {
          setAttendance(attendanceData);
          setDefffereds(deferredsData);
        },
        setLoading
      );
    }
  }, [user, lessonDetail, paymentResult, realTimeStatus]);

  useEffect(() => {
    setUser(param.user);
    setLessonDetail(param.lesson);
  }, [param]);

  useEffect(() => {
    SFirebase.track(
      FirebaseNode.Attendances,
      [{key: FirebaseNode.LessonId, value: lessonDetail.id}],
      () => {
        const number = Math.floor(10 + Math.random() * 90);
        setRealTimeStatus(number);
      }
    );
  }, [lessonDetail]);

  useEffect(() => {
    if (lessonDetail.class) {
      if (deffereds.length > 0) {
        const currentPrice = lessonDetail.class?.price;

        const deferredPrice = deffereds.length * currentPrice;
        const totalDebtPrice = deferredPrice + (attendance?.deferred ? 0 : currentPrice);

        setTotalPrice(totalDebtPrice);
      } else {
        setTotalPrice(lessonDetail.class?.price);
      }
    }
  }, [attendance, deffereds]);

  useEffect(() => {
    // console.log("user",user);
    
  },[param.lesson, param.user])

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 10}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.userContainer}>
                <Image
                  source={{uri: `${URL}${user?.avatar}`}}
                  style={styles.avatarUser}
                />
                <Text style={styles.pointText}>{user?.point}</Text>
                <Text style={styles.userName}>{user?.full_name}</Text>
              </View>
            </View>
            <View style={styles.bodyContainer}>
              {/* Class infomation */}
              <View style={styles.classInfoContainer}>
                {/* <ClassInfo/> */}
                <View style={styles.userStatusInLessonContainer}>
                  {attendance?.attended && (
                    <Text
                      style={[styles.userStatus, styles.userStatusInLesson]}
                    >
                      {language.ALREADY_ATTENDED}
                    </Text>
                    )}

                    {attendance?.attended === false && 
                    <Text
                      style={[styles.userStatus, styles.userStatusNotInLesson]}
                    >
                      {language.ABSENT}
                    </Text>
                    }
               

                  {attendance?.confirm_paid && (
                    <Text
                      style={[styles.userStatus, styles.userStatusConfirmPay]}
                    >
                      {language.PAYMENT_CONFIRMED}
                    </Text>
                  )}

                  {attendance?.confirm_deferred && (
                    <Text
                      style={[styles.userStatus, styles.userStatusConfirmPay]}
                    >
                      {language.DELAY_CONFIRMED}
                    </Text>
                  )}
                </View>
                <ClassInfo lessonDetail={lessonDetail} />
                {deffereds.length > 0 && (
                  <View style={styles.totalDebtContainer}>
                    <View style={styles.lineTop}></View>
                    <View style={styles.totalDebt}>
                      <Text style={styles.totalDebtTextSub}>Số tiền nợ:</Text>
                      <Text style={styles.totalDebtPriceSub}>
                        {formatCurrency(deffereds.length * deffereds[0].price)}
                      </Text>
                    </View>
                    <View style={styles.totalDebt}>
                      <Text style={styles.totalDebtText}>Tổng tiền:</Text>
                      <Text style={styles.totalDebtPrice}>
                        {formatCurrency(totalPrice)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Other user */}
              <View style={styles.otherUserContainer}>
                <Text style={styles.titleContainer}>{language.TUTOR}</Text>
                <View style={[styles.otherUserBox, styles.boxShadow]}>
                  <View style={styles.otherUserAvatarContainer}>
                    <Image
                      source={{
                        uri: `${URL}${lessonDetail.class?.tutor?.avatar}`,
                      }}
                      style={styles.otherUserAvatar}
                    />
                  </View>
                  <Text style={styles.otherUserName}>
                    {lessonDetail.class?.tutor?.full_name}
                  </Text>
                </View>
              </View>
              {deffereds.length > 0 && (
                <View style={styles.deferedContaier}>
                  <Text
                    style={[styles.titleContainer, {paddingHorizontal: 20}]}
                  >
                    Các buổi học bị nợ
                  </Text>
                  <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={true}
                    data={deffereds}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({item: deferredAttendance}) => (
                      <View
                        style={[
                          styles.attendanceItemContainer,
                          styles.boxShadow,
                        ]}
                      >
                        <View style={styles.attendanceItem}>
                          <View style={styles.contenLessonTitle}>
                            <Ionicons
                              name="today-outline"
                              size={20}
                              color="black"
                            />
                            <Text>{language.LESSON_DAY}</Text>
                          </View>
                          <Text>{days[deferredAttendance.day]}</Text>
                        </View>
                        <View style={styles.attendanceItem}>
                          <View style={styles.contenLessonTitle}>
                            <Ionicons
                              name="today-outline"
                              size={20}
                              color="black"
                            />
                            <Text>Ngày</Text>
                          </View>
                          <Text>
                            {moment(deferredAttendance.started_at).format(
                              "DD/MM/YYYY"
                            )}
                          </Text>
                        </View>
                      </View>
                    )}
                    contentContainerStyle={{
                      paddingHorizontal: 20,
                      paddingTop: 10,
                      paddingBottom: 20,
                    }}
                  />
                </View>
              )}

              {/* History attendce list */}
              <TouchableOpacity onPress={handleNavigateAttendanceHistory}>
                <View style={styles.historyListContainer}>
                  <Octicons name="history" size={22} color="black" />
                  <Text style={styles.historyTitle}>
                    {language.ATTENDANCE_HISTORY}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      {attendance?.attended && (
        <View style={styles.footerContainer}>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              disabled={attendance?.deferred || attendance?.paid}
              style={[
                styles.btn,
                attendance?.deferred
                  ? styles.btnDebtDisable
                  : attendance?.paid
                  ? styles.btnNotActive
                  : styles.btnDebt,
              ]}
              onPress={() => handlePayment("deferred")}
            >
              <Text style={styles.btnDebtText}>
                {" "}
                {attendance?.deferred ? "Đã trì hoãn" : "Trì hoãn"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={attendance?.deferred || attendance?.paid}
              style={[
                styles.btn,
                attendance?.paid
                  ? styles.btnPayDisable
                  : attendance?.deferred
                  ? styles.btnNotActive
                  : styles.btnPay,
              ]}
              onPress={() => handlePay()}
            >
              <Text style={styles.btnPayText}>
                {attendance?.paid ? "Đã thanh toán" : "Thanh toán"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modal hiển thị thanh toán thành công */}
      {modalName === "showDeffered" && (
        <ModalConfirmAttendClass
          modalName={modalName}
          confirmTitle="Xác nhận thành công"
          confirmContent={
            "Trì hoãn của bạn đã ghi được nhận. Gia sư sẽ sớm ghi nhận trì hoãn của bạn!"
          }
          imageStatus={"success"}
          visiable={modalVisible}
          onRequestCloseDialog={() => setModalVisible(null)}
        />
      )}

      {modalName === "showPaid" && (
        <ModalConfirmAttendClass
          modalName={modalName}
          confirmTitle="Xác nhận thành công"
          confirmContent={
            "Thanh toán của bạn đã được ghi nhận. Gia sư sẽ sớm sác nhận thanh toán của bạn!"
          }
          imageStatus={"success"}
          visiable={modalVisible}
          onRequestCloseDialog={() => setModalVisible(null)}
        />
      )}

      <ModalPay
        confirmTitle="Thanh toán"
        visiable={modalVisible}
        onRequestCloseDialog={() => setModalVisible(null)}
        lessonData={lessonDetail}
        price={totalPrice}
        onSelectedImage={setSelectedImage}
        onSetPaymentMethod={setPaymentMethod}
        onPay={() => handlePayment("pay")}
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
    marginTop: 15,
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
    marginTop: -40,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 10,
  },

  userStatusInLessonContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  userStatus: {
    fontWeight: "500",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

  userStatusInLesson: {
    backgroundColor: "rgba(73, 253, 38, 0.15)",
    color: "#03560A",
  },

  userStatusConfirmPay: {
    backgroundColor: "rgba(28, 186, 17, 0.10)",
    color: "#03560A",
  },

  userStatusNotInLesson: {
    backgroundColor: "#eee",
    color: "#333",
  },

  itemContentFee: {
    flex: 1,
    textAlign: "right",
    color: BackgroundColor.danger,
    fontWeight: "bold",
  },

  otherUserContainer: {
    backgroundColor: BackgroundColor.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  titleContainer: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 10,
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
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingVertical: 20,
    paddingLeft: 20,
    backgroundColor: BackgroundColor.white,
    borderRadius: 10,
  },

  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    borderWidth: 0.5,
    borderColor: BackgroundColor.gray_e6,
  },

  // Hitory
  historyListContainer: {
    marginTop: 10,
    backgroundColor: BackgroundColor.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
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

  btnContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
  },

  btn: {
    paddingVertical: 15,
    borderRadius: 10,
    flex: 1,
  },

  btnNotActive: {
    backgroundColor: "#ddd",
  },

  btnDebt: {
    backgroundColor: BackgroundColor.warning,
  },

  btnDebtDisable: {
    backgroundColor: BackgroundColor.warning_op09,
  },

  btnDebtText: {
    color: BackgroundColor.white,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  btnPay: {
    backgroundColor: BackgroundColor.primary,
  },

  btnPayDisable: {
    backgroundColor: BackgroundColor.primary_op05,
  },

  btnPayText: {
    color: BackgroundColor.white,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  // deferedContaier
  deferedContaier: {
    backgroundColor: BackgroundColor.white,
    paddingTop: 20,
    marginTop: 10,
  },

  attendanceItemContainer: {
    backgroundColor: BackgroundColor.white,
    marginRight: 10,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: SCREEN_WIDTH * 0.7,
    gap: 10,
  },

  attendanceItem: {
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

  totalDebtContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
    // alignItems: "flex-end"
  },

  lineTop: {
    height: 1,
    backgroundColor: BackgroundColor.gray_e6,
    marginBottom: 10,
  },

  totalDebt: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  totalDebtText: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 15,
  },

  totalDebtPrice: {
    fontWeight: "bold",
    color: "#ff0000",
    fontSize: 18,
  },

  totalDebtTextSub: {
    fontWeight: "bold",
    color: "#999",
    fontSize: 14,
    marginBottom: 5,
  },

  totalDebtPriceSub: {
    fontWeight: "bold",
    color: "#999",
    fontSize: 14,
  },
});
