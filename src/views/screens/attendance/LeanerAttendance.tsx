import React, { useContext, useCallback, useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { BackgroundColor } from "../../../configs/ColorConfig";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import {
  NavigationContext,
  RouteProp,
  useRoute,
} from "@react-navigation/native";
import ScreenName from "../../../constants/ScreenName";
import Lesson from "../../../models/Lesson";
import AAttendance from "../../../apis/AAttendance";
import { UserContext } from "../../../configs/UserContext";
import ClassInfo from "../../components/ClassInfo";
import ClassInfoSkeleton from "../../components/skeleton/ClassInfoSkeleton";
import ReactAppUrl from "../../../configs/ConfigUrl";
import ModalConfirmAttendClass from "../../components/modal/ModalConfirmAttendLesson";
import Attendance from "../../../models/Attendance";
import { RootStackParamList } from "../../../configs/NavigationRouteTypeConfig";
import moment from "moment";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

const URL = ReactAppUrl.PUBLIC_URL;
export default function LeanerAttendance() {
  const route =
    useRoute<RouteProp<RootStackParamList, ScreenName.ATTENDED_FOR_LEARNER>>();
  // Get class id
  const param = route.params;

  //context
  const user = useContext(UserContext).user;
  const navigation = useContext(NavigationContext);

  // states
  const [modalVisible, setModalVisible] = React.useState<string | null>("");
  const [lessonDetail, setLessonDetail] = useState(new Lesson());
  const [attendStudents, setAttendStudents] = useState<Attendance[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [confirmResult, setConfirmResult] = useState(false);
  const [paymentResult, setPaymentResult] = useState(false);
  const [confirmAttendance, setConfirmAttendance] = useState<
    boolean | undefined
  >();
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank">("cash");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isDeferred, setIsDeferred] = useState(false);
  const [modalName, setModalName] = useState("");

  const classId = param.classId;
  const lessonId = param.lessonId;
  const userId = user.ID;
  const attendedAt = new Date("2024-11-14").getTime();
  // moment.locale('vi');
  // console.log("attendedAt", param.date);

  // Handler
  const imageUri =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/800px-QR_code_for_mobile_English_Wikipedia.png";
  const downloadImage = async () => {
    try {
      // Kiểm tra và yêu cầu quyền truy cập vào thư viện
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Quyền truy cập bị từ chối",
          "Ứng dụng cần quyền truy cập vào thư viện"
        );
        return;
      }

      // Đặt tên cho file tải về trong hệ thống tệp của ứng dụng
      const fileUri = FileSystem.documentDirectory + "qrBanking.png";

      // Tải ảnh về thư mục nội bộ
      const { uri } = await FileSystem.downloadAsync(imageUri, fileUri);

      //Lưu ảnh vào thư viện của thiết bị
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Dowload", asset, false);

      Alert.alert("Tải ảnh thành công", "Ảnh đã được lưu vào thư viện!");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải ảnh");
      console.error(error);
    }
  };

  //
  const selectImage = async () => {
    // Request permission to access photos
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }

    // Open the image picker
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setSelectedImage(pickerResult.assets[0]);
      console.log("Image selected:", pickerResult.assets[0]);
      // Handle the selected image URI, e.g., save or display it
    }
  };

  // Xử lý chuyển đến màn hình lịch sử đăng nhập
  const handleNavigateAttendanceHistory = useCallback(() => {
    navigation?.navigate(ScreenName.ATTENDANCE_HISTORY);
  }, []);

  // Xử lý xác nhận điểm danh
  const handleAcceptAttendace = useCallback(() => {
    AAttendance.accpetAttendance(
      lessonId,
      userId,
      attendedAt,
      true,
      (data) => {
        if (data.result) {
          setModalName("showĐialogAttendance")
          setModalVisible("modalDialogForClass");
          setConfirmResult(true);
        }
      },
      setLoading
    );
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

      if (attendStudents) {
        const attendanceIds = attendStudents.map((student) => student.id);

        const formData = new FormData();

        // Thêm ảnh vào formData

        if (selectedImage && paymentMethod === "bank") {
          console.log("selected image", selectedImage);
          formData.append("file", {
            uri: selectedImage.uri,
            name: selectedImage.fileName,
            type: selectedImage.mimeType,
          } as any);

          console.log(
            "uri",
            selectedImage.uri,
            "name:",
            selectedImage.fileName,
            "type:",
            selectedImage.mimeType
          );
        }

        // Thêm các dữ liệu khác vào formData
        console.log(`paid: ${paid}, deffered: ${deferred}`);
        
        formData.append("attendance_ids", JSON.stringify(attendanceIds));
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
      }
    },
    [attendStudents, selectedImage]
  );

  // effects
  useEffect(() => {
    // SFirebase.trackOne(FirebaseNode.ATTENDANCE, 1, () => {
    //   console.log("Được gọi lại khi bấm điểm danh thành công!");
    // })
    AAttendance.getAttendanceByLearnerClassLesson(
      classId,
      lessonId,
      userId,
      attendedAt,
      (lessonDetail, attendStudents) => {
        setLessonDetail(lessonDetail);
        setAttendStudents(attendStudents);
        setConfirmAttendance(attendStudents[0].confirm_attendance);
        if (attendStudents.length > 0 && attendStudents[0].attendance_payment) {
          setIsPaid(attendStudents[0].attendance_payment.paid);
          setIsDeferred(attendStudents[0].attendance_payment.deferred);
          setPaymentMethod(attendStudents[0].attendance_payment.type as "cash" | "bank");
        }
      },
      setLoading
    );
  }, [confirmResult, paymentResult]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 10 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.userContainer}>
                <Image
                  source={require("../../../../assets/images/img_avatar_user.png")}
                  style={styles.avatarUser}
                />
                <Text style={styles.pointText}>1000</Text>
                <Text style={styles.userName}>Nguyễn Văn A</Text>
              </View>
            </View>
            <View style={styles.bodyContainer}>
              {/* Class infomation */}
              <View style={styles.classInfoContainer}>
                {/* <ClassInfo/> */}
                {loading && lessonDetail ? (
                  <ClassInfoSkeleton />
                ) : (
                  <ClassInfo lessonDetail={lessonDetail} />
                )}
              </View>

              {/* Other user */}
              <View style={styles.otherUserContainer}>
                <Text style={styles.titleContainer}>Gia sư</Text>
                <View style={[styles.otherUserBox, styles.boxShadow]}>
                  <View style={styles.otherUserAvatarContainer}>
                    <Image
                      source={{
                        uri: `${URL}${lessonDetail.class?.tutor?.avatar?.path}`,
                      }}
                      style={styles.otherUserAvatar}
                    />
                  </View>
                  <Text style={styles.otherUserName}>
                    {lessonDetail.class?.tutor?.full_name}
                  </Text>
                </View>
              </View>

              {/* Uploading payment */}
              <View style={styles.paymentContainer}>
                <Text style={styles.titleContainer}>
                  Chọn phương thức thanh toán
                </Text>

                {/* Phương thức Tiền mặt */}
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => setPaymentMethod("cash")}
                >
                  <Ionicons
                    name="cash-outline"
                    size={24}
                    color={paymentMethod === "cash" ? "green" : "gray"}
                  />
                  <Text style={styles.optionText}>Thanh toán tiền mặt</Text>
                  {paymentMethod === "cash" && (
                    <Ionicons name="checkmark" size={24} color="green" />
                  )}
                </TouchableOpacity>

                {/* Phương thức Chuyển khoản */}
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => setPaymentMethod("bank")}
                >
                  <Ionicons
                    name="card-outline"
                    size={24}
                    color={paymentMethod === "bank" ? "green" : "gray"}
                  />
                  <Text style={styles.optionText}>Chuyển khoản</Text>
                  {paymentMethod === "bank" && (
                    <Ionicons name="checkmark" size={24} color="green" />
                  )}
                </TouchableOpacity>
              </View>

              {paymentMethod === "bank" && (
                <View>
                  {/* Pay infomation */}
                  <View style={styles.payInfoContainer}>
                    <Text style={styles.titleContainer}>
                      Thông tin chuyển khoản
                    </Text>
                    <View style={styles.payInfoContent}>
                      <View style={styles.hintTitleContainer}>
                        <Text style={styles.hintTitle}>
                          Nhấn giữ hình để lưu
                        </Text>
                        <Octicons
                          name="download"
                          size={18}
                          color={BackgroundColor.gray_c6}
                        />
                      </View>

                      <TouchableOpacity
                        onLongPress={downloadImage}
                        style={[styles.boxShadow, styles.imageQrContainer]}
                      >
                        <Image
                          source={{
                            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/800px-QR_code_for_mobile_English_Wikipedia.png",
                          }}
                          style={[styles.imageQr, styles.boxShadow]}
                        />
                      </TouchableOpacity>
                      <View style={styles.logoOfBankContainer}>
                        <Image
                          source={{ uri: "https://api.vietqr.io/img/MB.png" }}
                          style={styles.logoOfBank}
                          resizeMode="contain"
                        />
                      </View>
                      <Text style={styles.bankingNumber}>
                        {lessonDetail.class?.tutor?.information?.banking_code}
                      </Text>
                      <Text style={styles.bankingName}>
                        {lessonDetail.class?.tutor?.full_name}
                      </Text>
                    </View>
                  </View>

                  {/* Uploading payment */}
                  <View style={styles.uploadPaymentContainer}>
                    <TouchableOpacity
                      onPress={selectImage}
                      style={[styles.uploadImageButton, styles.boxShadow]}
                    >
                      <Ionicons name="image-outline" size={24} color="black" />
                      <Text style={styles.buttonText}>Chọn hình</Text>
                    </TouchableOpacity>

                    <View style={styles.textContainer}>
                      <Text style={styles.uploadText}>
                        Tải ảnh minh chứng thanh toán
                      </Text>
                      <Text style={styles.subText}>
                        Vui lòng tải lên ảnh chụp màn hình hoặc hóa đơn để xác
                        nhận thanh toán.
                      </Text>
                    </View>

                    {/* Display the selected image if available */}
                    {selectedImage && (
                      <Image
                        source={{ uri: selectedImage.uri }}
                        style={styles.selectedImage}
                      />
                    )}
                  </View>
                </View>
              )}

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
      <View style={styles.footerContainer}>
        {!confirmAttendance && (
          <TouchableOpacity
            disabled={confirmAttendance || false ? true : false}
            onPress={handleAcceptAttendace}
            style={[
              styles.btnAttendce,
              {
                backgroundColor:
                  confirmAttendance || false
                    ? BackgroundColor.primary_op05
                    : BackgroundColor.primary,
              },
            ]}
          >
            <Text style={styles.btnAttendceText}>Xác nhận điểm danh</Text>
          </TouchableOpacity>
        )}

        {confirmAttendance && (
          <View style={styles.btnContainer}>
              <TouchableOpacity
                disabled={isPaid || isDeferred}
                style={[
                  styles.btnDebt,
                  {
                    backgroundColor: isPaid || isDeferred
                      ? BackgroundColor.warning_op09
                      : BackgroundColor.warning,
                  },
                ]}
                onPress={() => handlePayment("deferred")}
              >
                <Text style={styles.btnDebtText}> {isDeferred ? "Đã trì hoãn" : "Trì hoãn"}</Text>
              </TouchableOpacity>

            <TouchableOpacity
              disabled={isPaid || isDeferred}
              style={[
                styles.btnPay,
                {
                  backgroundColor: isPaid || isDeferred
                    ? BackgroundColor.primary_op05
                    : BackgroundColor.primary,
                },
              ]}
              onPress={() => handlePayment("pay")}
            >
              <Text style={styles.btnPayText}>
                {isPaid ? "Đã thanh toán" : "Thanh toán"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Modal xác nhận điểm danh */}
      {
        modalName === "showĐialogAttendance" && 
      <ModalConfirmAttendClass
        modalName="showDeffred"
        confirmTitle="Xác nhận thành công"
        confirmContent={
          "Cảm ơn bạn đã xác nhận tham gia buổi học. Hãy cùng học tập hiệu quả nhé!"
        }
        imageStatus={"success"}
        visiable={modalVisible}
        onRequestCloseDialog={() => setModalVisible(null)}
      />
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

  btnDebt: {
    paddingVertical: 15,
    borderRadius: 10,
    flex: 1,
  },

  btnDebtText: {
    color: BackgroundColor.white,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  btnPay: {
    paddingVertical: 15,
    borderRadius: 10,
    flex: 1,
    backgroundColor: BackgroundColor.primary,
  },

  btnPayText: {
    color: BackgroundColor.white,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
