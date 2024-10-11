import React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import { BackgroundColor } from "../../configs/ColorConfig";
import ModalStudentList from "../components/modal/ModalStudentList";
import ModalAttended from "../components/modal/ModalAttended";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
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

  // Handler
    const imageUri = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/800px-QR_code_for_mobile_English_Wikipedia.png";
    const downloadImage = async () => {
      try {
        // Kiểm tra và yêu cầu quyền truy cập vào thư viện
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Quyền truy cập bị từ chối', 'Ứng dụng cần quyền truy cập vào thư viện');
          return;
        }

        // Đặt tên cho file tải về trong hệ thống tệp của ứng dụng
        const fileUri = FileSystem.documentDirectory + "qrBanking.png";

         // Tải ảnh về thư mục nội bộ
       const {uri} = await FileSystem.downloadAsync(imageUri, fileUri);

       //Lưu ảnh vào thư viện của thiết bị
       const asset = await MediaLibrary.createAssetAsync(uri);
       await MediaLibrary.createAlbumAsync("Dowload", asset, false);

       Alert.alert('Tải ảnh thành công', 'Ảnh đã được lưu vào thư viện!');
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải ảnh');
        console.error(error);
      }
    }
  
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
                <Text style={styles.titleContainer}>Gia sư</Text>
                <View style={[styles.otherUserBox, styles.boxShadow]}>
                  <View style={styles.otherUserAvatarContainer}>
                    <Image
                      source={require("../../../assets/avatar/img_avatar_cat.png")}
                      style={styles.otherUserAvatar}
                    />
                  </View>
                  <Text style={styles.otherUserName}>Nguyễn Văn B</Text>
                </View>
              </View>

              {/* Pay infomation */}
              <View style={styles.payInfoContainer}>
                <Text style={styles.titleContainer}>
                  Thông tin chuyển khoản
                </Text>
                <View style={styles.payInfoContent}>
                  <View style={styles.hintTitleContainer}>
                  <Text style={styles.hintTitle}>Nhấn giữ hình để lưu</Text>
                  <Octicons name="download" size={18} color={BackgroundColor.gray_c6} />
                  </View>

                  <TouchableOpacity onLongPress={downloadImage}  style={[styles.boxShadow, styles.imageQrContainer]}>
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
                  <Text style={styles.bankingNumber}>7924042001093</Text>
                  <Text style={styles.bankingName}>Nguyễn Văn B</Text>
                </View>
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
          <Text style={styles.btnAttendceText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>

      <ModalStudentList
        visible={modalVisible}
        onRequestClose={() => setModalVisible(null)}
        studentList={studentList}
      />
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
    // paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 10,
  },

  // classInfoTitle: {
  //   fontWeight: "bold",
  //   fontSize: 18,
  //   marginBottom: 20,
  // },

  // row: {
  //   flexDirection: "row",
  //   gap: 10,
  //   alignItems: "center",
  // },

  // itemInfoTwo: {
  //   flex: 1,
  //   flexDirection: "row",
  //   gap: 10,
  //   alignItems: "center",
  // },

  // itemInfo: {
  //   flexDirection: "row",
  //   gap: 10,
  //   alignItems: "center",
  //   marginTop: 10,
  // },

  // itemContent: {
  //   flex: 1,
  //   textAlign: "right",
  //   color: BackgroundColor.primary,
  //   fontWeight: "bold",
  // },

  // itemContentBlack: {
  //   flex: 1,
  //   textAlign: "right",
  //   color: BackgroundColor.black,
  //   fontWeight: "bold",
  // },

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
    marginBottom: 10
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
    fontSize: 20,
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
    width: 200,
    height: 200,
  },

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
    backgroundColor: BackgroundColor.primary,
    width: "80%",
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  btnAttendceText: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    color: BackgroundColor.white,
  },
});
