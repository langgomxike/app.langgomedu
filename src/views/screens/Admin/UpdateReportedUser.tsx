import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import MyIcon, { AppIcon } from "../../components/MyIcon";
import Button from "../../components/Button";
import IconReport from "../../components/ItemUserReport";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import ImageViewer from "react-native-image-zoom-viewer";
import AUserReport from "../../../apis/AUserReport";
import UserReport from "../../../models/UserReport";
import { BackgroundColor } from "../../../configs/ColorConfig";
import ReactAppUrl from "../../../configs/ConfigUrl";
import Accordion from "../../components/Accordion";
import AUser from "../../../apis/AUser";
export default function UpdateReportedUser() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [userReport, setUserReport] = useState<UserReport | null>(null);
  const [loading, setLoading] = useState(true);
  const URL = ReactAppUrl.PUBLIC_URL;
  const userReportId = "1"; // Thay bằng ID thực tế

  useEffect(() => {
    AUserReport.getUserReportById(
      userReportId,
      (data: UserReport) => {
        console.log(data);
        setUserReport(data); // Lưu dữ liệu nhận được vào state
      },
      (isLoading: boolean) => {
        setLoading(isLoading); // Cập nhật trạng thái tải
      }
    );
  }, [userReportId]);
  const openModal = (index: number) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };
  interface Item {
    id: number;
    name: string;
  }
  // Kiểm tra và log giá trị của đường dẫn hình ảnh trong userReport
  if (userReport?.files) {
    userReport.files.forEach((file, index) => {
      console.log(`Path ${index + 1}: ${file.path}`); // Kiểm tra giá trị của path
    });
  }

  // Tạo mảng data từ userReport.files
  const data: Item[] =
    userReport?.files?.map((file, index) => ({
      id: file.id || index, // Sử dụng index làm ID dự phòng nếu id bị null
      name: file.path || "", // Đảm bảo có giá trị chuỗi rỗng nếu path là null
    })) || [];

  // Log để kiểm tra kết quả của mảng data
  data.forEach((item, index) => {
    console.log(`Item ${index + 1}:`, item);
  });

  // Hàm renderItem để hiển thị hình ảnh từ `data`
  const renderItem = ({ item, index }: { item: Item; index: number }) => {
    // Tạo đường dẫn hình ảnh đầy đủ từ `URL` và `item.name`
    const imageUri = item.name ? `${URL}${item.name}` : URL; // Kết hợp URL với tên ảnh nếu có

    console.log("Đường dẫn đến hình:", imageUri);

    return (
      <TouchableOpacity
        style={styles.imgParent}
        onPress={() => openModal(index)}
      >
        <Image style={styles.img} source={{ uri: imageUri }} />
      </TouchableOpacity>
    );
  };

  // Styles animated chevron
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* nút back và tên màn hình */}
      <View style={styles.component}>
        <View style={styles.screenName}>
          <View style={styles.backBtn}>
            <MyIcon icon={AppIcon.back_button} size="20"></MyIcon>
          </View>
          <Text style={styles.screenTitel}> Chi tiết báo cáo lớp học</Text>
        </View>
        {/* tài khoản báo cáo */}
        <Text style={styles.smallTitle1}>Tài khoản báo cáo</Text>

        <IconReport
          userAvatar={
            userReport?.from_user?.avatar_of_fromUser?.from_user_avatar + ""
          }
          userName={userReport?.from_user?.full_name + ""}
          credibility={userReport?.from_user?.information?.point}
        ></IconReport>
        {/* tài khoản bị báo cáo */}
        <Text style={styles.smallTitle2}>Tài khoản bị báo cáo</Text>
        <IconReport
          userAvatar={
            userReport?.to_user?.avatar_of_toUser?.to_user_avatar + ""
          }
          userName={userReport?.to_user?.full_name + ""}
          credibility={userReport?.to_user?.information?.point}
        ></IconReport>
        {/* lớp học bị báo cáo */}
      </View>
      <View style={styles.component1}>
        <Text style={styles.smallTitle3}>
          Đã bị báo cáo {userReport?.reports_before.length} lần
        </Text>
        {userReport?.reports_before.map((report, index) => (
          <View key={index} style={styles.itemlCenter}>
            <View style={styles.textareaContainer}>
              <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
              >
                {report.content ? (
                  <Accordion
                    title={`Báo cáo ${index + 1}`}
                    details={report.content}
                  />
                ) : (
                  <Text>"Không có nội dung báo cáo trước đây"</Text>
                )}
              </ScrollView>
            </View>
          </View>
        ))}
        {/* <View style={styles.line}></View> */}

        <Text style={styles.smallTitle3}>Lý do</Text>
        <Text style={styles.reportContent}>
          {userReport?.report_content || "Không có thông tin lý do"}
        </Text>
      </View>

      <View style={styles.component2}>
        <Text style={styles.smallTitle3}>Minh chứng:</Text>
        <View style={styles.images}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          ></FlatList>
        </View>
        <View>
          <View style={styles.btns}>
            <TouchableOpacity
              style={[styles.btn, styles.btnAccept]}
              onPress={() => {
                // Hiển thị alert xác nhận
                Alert.alert(
                  "Xác nhận",
                  "Bạn có chắc chắn muốn chấp nhận và trừ điểm uy tín không?",
                  [
                    {
                      text: "Hủy",
                      style: "cancel",
                    },
                    {
                      text: "Xác nhận",
                      onPress: () => {
                        // Gọi hàm trừ điểm uy tín và xử lý trạng thái
                        AUser.minusUserPoints(
                          userReport?.to_user?.id, // Truyền user ID của người dùng cần trừ điểm
                          (response) => {
                            if (response.success) {
                              console.log("Points deducted successfully.");
                              Alert.alert(
                                "Điểm uy tín đã được trừ thành công!"
                              );
                            } else {
                              console.log(
                                "Failed to deduct points:",
                                response.message
                              );
                              Alert.alert(
                                "Đã xảy ra lỗi trong quá trình xử lý!"
                              );
                            }
                          },
                          (loading) => {
                            // Bạn có thể xử lý trạng thái loading tại đây nếu cần
                          }
                        );
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={styles.textBtnAccept}>Chấp nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnDeney]}
              onPress={() => {
                // Hiển thị alert xác nhận
                Alert.alert(
                  "Xác nhận",
                  "Bạn có chắc chắn muốn từ chối báo cáo này không?",
                  [
                    {
                      text: "Hủy",
                      style: "cancel",
                    },
                    {
                      text: "Xác nhận",
                      onPress: () => {
                        // Gọi hàm từ chối báo cáo và xử lý trạng thái
                        AUserReport.deneyUserReport(
                          userReport?.report_id,
                          (response) => {
                            if (response.success) {
                              console.log("Report denied successfully.");
                              Alert.alert("Từ chối báo cáo thành công!");
                            } else {
                              console.log(
                                "Failed to deny report:",
                                response.message
                              );
                              Alert.alert(
                                "Đã xảy ra lỗi trong quá trình xử lý!"
                              );
                            }
                          },
                          (loading) => {}
                        );
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={styles.textBtnDeney}>Từ chối</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
  style={[styles.btn, styles.deleteUser]}
  onPress={() => {
    // Hiển thị alert xác nhận
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn khóa tài khoản người dùng này không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => {
            // Gọi hàm khóa tài khoản và xử lý trạng thái
            AUser.lockUserAccount(
              userReport?.to_user?.id, 
              (response) => {
                if (response.success) {
                  console.log("User account locked successfully.");
                  Alert.alert("Tài khoản đã được khóa thành công!");
                } else {
                  console.log("Failed to lock account:", response.message);
                  Alert.alert("Đã xảy ra lỗi trong quá trình khóa tài khoản!");
                }
              },
              (loading) => {
                // Có thể cập nhật trạng thái loading tại đây nếu cần
              }
            );
          },
        },
      ]
    );
  }}
>
  <Text style={styles.textBtnDeleteUser}>Khóa tài khoản</Text>
</TouchableOpacity>
        </View>
      </View>

      {/* Modal hiển thị hình ảnh */}
      {selectedIndex !== null && (
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <ImageViewer
            imageUrls={data.map((item) => ({ url: `${URL}${item.name}` }))}
            index={selectedIndex}
            onSwipeDown={() => setModalVisible(false)}
            enableSwipeDown={true}
          />
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EEEEEE",
  },
  screenName: {
    flexDirection: "row",
    top: 30,
    marginBottom: 30,
    width: "100%",
  },
  screenTitel: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    left: "50%",
    width: "80%",
    top: "1%",
  },
  backBtn: {
    top: "2%",
  },
  user: {
    height: 60,
    alignItems: "center", // Căn giữa các phần tử theo chiều dọc
    borderWidth: 1, // Độ dày của viền
    borderColor: "#ccc", // Màu sắc của viền
    borderRadius: 10, // Bo góc cho viền
    shadowColor: "#000",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 25,
    marginTop: 10,
    marginLeft: 10,
  },
  smallTitle1: {
    top: 10,
    fontWeight: "bold",
    fontSize: 18,
    paddingBottom: 15,
    color: "#0D99FF",
  },
  smallTitle2: {
    top: 10,
    fontWeight: "bold",
    fontSize: 18,
    paddingBottom: 15,
    color: "red",
  },
  smallTitle3: {
    top: 10,
    fontWeight: "bold",
    fontSize: 18,
    paddingBottom: 15,
    color: "black",
  },
  iconInUser: {
    flexDirection: "row",
    marginTop: "5%",
    left: "35%",
  },
  classInfor: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: "center",
    height: 60,
    borderRadius: 10, // Bo góc cho viền
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
  },
  component: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  component1: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  component2: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  textareaContainer: {
    width: "98%",
    borderRadius: 10,

    paddingHorizontal: 15,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
    marginBottom: 20,
  },

  reportParent: {
    marginBottom: 20,
  },
  itemlCenter: {
    alignItems: "center",
  },
  reportContent: {
    width: "98%",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
    marginBottom: 30,
  },
  img: {
    width: 300,
    height: 200,
    borderRadius: 5,
  },
  imgParent: {
    marginRight: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
  },

  images: {
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 10,
    width: 70,
    height: 50,
    top: 50,
    left: 350,
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 1,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1, // Để chiếm toàn bộ chiều cao màn hình
    justifyContent: "center", // Căn giữa nội dung theo chiều dọc
    alignItems: "center", // Căn giữa nội dung theo chiều ngang
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Làm mờ nền
  },
  btns: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 15,
  },
  btn: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  btnAccept: {
    backgroundColor: BackgroundColor.primary,
    flex: 1,
  },
  textBtnAccept: {
    color: "#fff",
  },
  btnDeney: {
    backgroundColor: BackgroundColor.warning,
    flex: 1,
  },
  textBtnDeney: {
    color: "#fff",
  },
  deleteUser: {
    backgroundColor: BackgroundColor.danger,
    flex: 1,
  },
  textBtnDeleteUser: {
    color: "#fff",
  },
});
