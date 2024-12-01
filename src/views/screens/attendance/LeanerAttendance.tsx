import React, { useContext, useCallback, useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  FlatList
} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { BackgroundColor } from "../../../configs/ColorConfig";

import {NavigationContext, NavigationRouteContext} from "@react-navigation/native";
import ScreenName from "../../../constants/ScreenName";
import Lesson from "../../../models/Lesson";
import AAttendance from "../../../apis/AAttendance";
import ClassInfo from "../../components/ClassInfo";
import ReactAppUrl from "../../../configs/ConfigUrl";
import ModalConfirmAttendClass from "../../components/modal/ModalConfirmAttendLesson";
import Attendance from "../../../models/Attendance";
import {AttendedForLearner} from "../../../configs/NavigationRouteTypeConfig";
import ChildItem from "../../components/attendance/ChildItem";
import ModalPay from "../../components/modal/ModalPay";
import { AccountContext } from "../../../configs/AccountConfig";
import User from "../../../models/User";
import SFirebase, { FirebaseNode } from "../../../services/SFirebase";

const URL = ReactAppUrl.PUBLIC_URL;

export default function LeanerAttendance() {
  // contexts
  const route = useContext(NavigationRouteContext);
  // Get class id
  const param = route?.params as AttendedForLearner || {lesson: new Lesson, user: new User};

  //context
  const account = useContext(AccountContext).account;
  const navigation = useContext(NavigationContext);

  // states
  const [modalVisible, setModalVisible] = useState<string | null>("");
  const [modalName, setModalName] = useState("");

  const [lessonDetail, setLessonDetail] = useState(new Lesson());
  const [user, setUser] = useState<User>(new User());
  const [attendance, setAttendance] = useState<Attendance>();
  const [loading, setLoading] = useState(true);

  const [paymentResult, setPaymentResult] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [realTimeStatus, setRealTimeStatus] = useState<number>(0);

  // Handler

  // Xử lý chuyển đến màn hình lịch sử đăng nhập
  const handleNavigateAttendanceHistory = useCallback(() => {
    navigation?.navigate(ScreenName.ATTENDANCE_HISTORY);
  }, []);
  
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

        AAttendance.sendLearnerPayment(
          formData,
          (data) => {
            setPaymentResult(data.result);
          },
          setLoading
        );
    }, [user, selectedImage]);

  const handlePay = () => {
    setModalVisible("modalPay")
  }

  // effects
  useEffect(() => {
    if(user){
      AAttendance.getAttendanceByLearnerLesson(
        lessonDetail.id,
        user.id,
        (data) => {
          setAttendance(data);
        },
        setLoading
      );
    }
  }, [user, lessonDetail, paymentResult, realTimeStatus]);

  useEffect(()=> {
    setUser(param.user);
    setLessonDetail(param.lesson);
    
  }, [param])

  useEffect(() => {
    SFirebase.track(FirebaseNode.Attendances, 
      [{key: FirebaseNode.LessonId, value: lessonDetail.id}], () => {
      const number = Math.floor(10 + Math.random() * 90);
        setRealTimeStatus(number);
      })
    
  }, [lessonDetail])


  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 10 }}>
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
                  {attendance?.attended ? (
                       <Text style={[styles.userStatus, styles.userStatusInLesson]}>Đã điểm danh</Text>
                  ) : (
                    <Text style={[styles.userStatus, styles.userStatusNotInLesson]}>Vắng mặt</Text>
                  )}

                  {attendance?.confirm_paid && (
                       <Text style={[styles.userStatus, styles.userStatusConfirmPay]}>Đã xác nhận thanh toán</Text>
                  ) }

                  {attendance?.confirm_deferred && (
                    <Text style={[styles.userStatus, styles.userStatusConfirmPay]}>Đã xác nhận trì hoàn</Text>
                  )}
                 
                </View>
                  <ClassInfo lessonDetail={lessonDetail} />
              </View>

              {/* Other user */}
              <View style={styles.otherUserContainer}>
                <Text style={styles.titleContainer}>Gia sư</Text>
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

              {/* History attendce list */}
              <TouchableOpacity onPress={handleNavigateAttendanceHistory}>
                <View style={styles.historyListContainer}>
                  <Octicons name="history" size={22} color="black" />
                  <Text style={styles.historyTitle}>Lịch sử điểm danh</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      {attendance?.attended &&
      <View style={styles.footerContainer}>
          <View style={styles.btnContainer}>
              <TouchableOpacity
                disabled={attendance?.deferred || attendance?.paid}
                style={[styles.btn,  attendance?.deferred ? styles.btnDebtDisable : attendance?.paid ? styles.btnNotActive : styles.btnDebt
                ]}
                onPress={() => handlePayment("deferred")}
              >
                <Text style={styles.btnDebtText}> {attendance?.deferred ? "Đã trì hoãn" : "Trì hoãn"}</Text>
              </TouchableOpacity>

            <TouchableOpacity
              disabled={attendance?.deferred || attendance?.paid}
              style={[styles.btn, attendance?.paid ? styles.btnPayDisable : attendance?.deferred ? styles.btnNotActive : styles.btnPay,
              ]}
              onPress={() => handlePay()}
            >
              <Text style={styles.btnPayText}>
                {attendance?.paid ? "Đã thanh toán" : "Thanh toán"}
              </Text>
            </TouchableOpacity>
          </View>
      </View>
      }

      {/* Modal hiển thị thanh toán thành công */}
      {
        modalName === "showDeffered" && 
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
      }

      {
        modalName === "showPaid" && 
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
      }

        <ModalPay
          confirmTitle="Thanh toán"
          visiable={modalVisible}
          onRequestCloseDialog={() => setModalVisible(null)}
          tutor={lessonDetail.class?.tutor}
          price={lessonDetail.class?.price}
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  payInfoContainer: {
    marginTop: 10,
    backgroundColor: BackgroundColor.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  hintTitleContainer: {
    flexDirection: "row",
    gap: 10,
  },

  hintTitle: {
    color: BackgroundColor.gray_c6,
    marginBottom: 10,
  },

  payInfoContent: {
    alignItems: "center",
    marginTop: 10,
  },

  logoOfBankContainer: {
    height: 50,
    width: "100%",
    marginTop: 10,
  },

  logoOfBank: {
    width: "100%",
    height: "100%",
  },

  bankingNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },

  bankingName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    paddingBottom: 10,
  },

  imageQrContainer: {
    backgroundColor: BackgroundColor.white,
    borderRadius: 10,
    padding: 5,
  },

  imageQr: {
    width: 170,
    height: 170,
  },

  // upload payment
  uploadPaymentContainer: {
    alignItems: "center",
    backgroundColor: BackgroundColor.white,
    marginTop: 10,
    paddingVertical: 20,
  },
  uploadImageButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  textContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  subText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 10, // Để văn bản không tràn khi có nhiều nội dung
  },

  paymentContainer: {
    backgroundColor: BackgroundColor.white,
    marginTop: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  selectedImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    borderRadius: 10,
    marginTop: 10,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
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
    backgroundColor: "#ddd"
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
    backgroundColor: BackgroundColor.primary_op05
  },

  btnPayText: {
    color: BackgroundColor.white,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
