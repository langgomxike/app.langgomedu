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
  TextInput,
} from "react-native";
import MyIcon, { AppIcon } from "../../components/MyIcon";
import RadioButtonGroup from "react-native-radio-buttons-group";
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
import { MaterialIcons } from "@expo/vector-icons";
import AClass from "../../../apis/AClass";

const reportLevels = [
  { id: 1, label: "Cảnh báo nhẹ", points: 10 },
  { id: 2, label: "Trung bình", points: 30 },
  { id: 3, label: "Nghiêm trọng", points: 50 },
  { id: 4, label: "Rất nghiêm trọng", points: 100 },
];

export default function UpdateReportedUser() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLockUserVisible, setModalLockUserVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [userReport, setUserReport] = useState<UserReport | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const URL = ReactAppUrl.PUBLIC_URL;
  const userReportId = "1"; // Thay bằng ID thực tế
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const handleSelectLevel = (levelId: number) => {
    setSelectedLevel(levelId);
  };
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

  const denyReport = (reportId) => {
    if (!reason.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập lý do từ chối!");
      return;
    }

    // Gọi API để từ chối báo cáo
    AUserReport.lockReport(
      reportId,
      reason,
      (response) => {
        setModalVisible(false);
        if (response.success) {
          Alert.alert("Từ chối báo cáo thành công!");
          console.log("Report denied successfully.");
        } else {
          Alert.alert("Đã xảy ra lỗi trong quá trình xử lý!", response.message);
          console.log("Failed to deny report:", response.message);
        }
      },
      (loading) => {
        console.log("Loading state:", loading);
      }
    );
  };

  // Xử lý sự kiện khi người dùng chọn một radio button
  const handleRoleSelect = (roleId: string) => {
    if (selectedRoles.includes(roleId)) {
      // Nếu vai trò đã được chọn, bỏ chọn nó
      setSelectedRoles(selectedRoles.filter((id) => id !== roleId));
    } else {
      // Nếu vai trò chưa được chọn, thêm nó vào danh sách đã chọn
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const handleLockAccount = () => {
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
              userReport?.reportee?.id,
              userReportId, // user_id
              selectedRoles, // Gửi danh sách các permissionIds (có thể là các vai trò đã chọn)
              (response) => {
                if (response.success) {
                  console.log("User account locked successfully.");
                  Alert.alert("Tài khoản đã được khóa thành công!");

                  // Sau khi khóa tài khoản thành công, kiểm tra điều kiện khóa lớp
                  if (
                    userReport?.class?.id !== 0 &&
                    userReport?.reportee?.id === userReport?.class?.author_id
                  ) {
                    // Gọi hàm khóa lớp
                    AClass.lockClass(
                      userReport?.class?.id, // classId
                      (classResponse) => {
                        if (classResponse.success) {
                          console.log("Class locked successfully.");
                          Alert.alert(
                            "Quyền của người dùng đã bị giới hạn và lớp học đã được khóa thành công!"
                          );
                        } else {
                          console.error(
                            "Failed to lock class:",
                            classResponse.message
                          );
                          Alert.alert(
                            "Đã xảy ra lỗi trong quá trình khóa lớp!"
                          );
                        }
                      },
                      (loading) => {
                        // Cập nhật trạng thái loading nếu cần
                        console.log("Locking class loading state:", loading);
                      }
                    );
                  }
                  setModalLockUserVisible(false); // Đóng modal sau khi thành công
                } else {
                  console.log("Failed to lock account:", response.message);
                  Alert.alert("Đã xảy ra lỗi trong quá trình khóa tài khoản!");
                }
              },
              (loading) => {
                // Có thể cập nhật trạng thái loading tại đây nếu cần
                if (loading) {
                  console.log("Loading...");
                } else {
                  console.log("Not loading");
                }
              }
            );
          },
        },
      ]
    );
  };

  // Hàm khóa tài khoản người dùng
  const lockUserAccount = () => {
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
              userReport?.reportee?.id, // user_id
              selectedRoles, // Gửi danh sách các permissionIds (có thể là các vai trò đã chọn)
              (response) => {
                if (response.success) {
                  console.log("User account locked successfully.");
                  Alert.alert("Tài khoản đã được khóa thành công!");
                  setModalLockUserVisible(false); // Đóng modal sau khi thành công
                } else {
                  console.log("Failed to lock account:", response.message);
                  Alert.alert("Đã xảy ra lỗi trong quá trình khóa tài khoản!");
                }
              },
              (loading) => {
                // Có thể cập nhật trạng thái loading tại đây nếu cần
                if (loading) {
                  console.log("Loading...");
                } else {
                  console.log("Not loading");
                }
              }
            );
          },
        },
      ]
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
          <Text style={styles.screenTitel}> Chi tiết báo cáo </Text>
        </View>
        <View style={styles.infor}>
          <Text style={styles.smallTitle1}>Tài khoản báo cáo </Text>
          <Text style={styles.smallTitle1}>
            {userReport?.class?.id !== 0 &&
            userReport?.reporter?.id === userReport?.class?.tutor_id
              ? "Gia sư"
              : "Học sinh"}
          </Text>
        </View>

        <IconReport
          userAvatar={userReport?.reporter?.avatar + ""}
          userName={userReport?.reporter?.full_name + ""}
          credibility={userReport?.reporter?.point ?? 0}
        ></IconReport>
        {/* tài khoản bị báo cáo */}
        <View style={styles.infor}>
          <Text style={styles.smallTitle2}>Tài khoản báo cáo </Text>
          <Text style={styles.smallTitle2}>
            {userReport?.class?.id !== 0 &&
            userReport?.reportee?.id === userReport?.class?.tutor_id
              ? "Gia sư"
              : "Học sinh"}
          </Text>
        </View>

        <IconReport
          userAvatar={userReport?.reportee?.avatar + ""}
          userName={userReport?.reportee?.full_name + ""}
          credibility={userReport?.reportee?.point ?? 0}
        ></IconReport>
        {/* lớp học bị báo cáo */}
        {/* lớp học bị báo cáo */}
        {userReport?.class?.id !== 0 &&
        userReport?.reportee?.id === userReport?.class?.author_id ? (
          <View>
            <Text style={styles.smallTitle2}>Lớp học bị báo cáo</Text>
            <View style={styles.classInfor}>
              <Text>{userReport?.class?.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="black" />
            </View>
          </View>
        ) : null}
      </View>
      <View style={styles.component1}>
        <Text style={styles.smallTitle3}>
          Đã bị báo cáo{" "}
          {userReport?.reports_before?.filter((report) => report.content)
            .length || 0}{" "}
          lần
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
          {userReport?.content || "Không có thông tin lý do"}
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

        <View style={styles.reportLevelContainer}>
          <Text style={styles.title}>Chọn mức độ báo cáo:</Text>
          {reportLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelOption,
                selectedLevel === level.id && styles.selectedOption,
              ]}
              onPress={() => handleSelectLevel(level.id)}
            >
              <Text style={styles.optionText}>{level.label}</Text>
              {selectedLevel === level.id && (
                <MaterialIcons name="check" size={20} color="green" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View>
          <View style={styles.btns}>
            <TouchableOpacity
              style={[styles.btn, styles.btnAccept]}
              onPress={() => {
                if (selectedLevel === null) {
                  Alert.alert(
                    "Vui lòng chọn mức độ báo cáo trước khi chấp nhận!"
                  );
                  return;
                }

                // Tìm số điểm tương ứng với mức độ đã chọn
                const level = reportLevels.find(
                  (level) => level.id === selectedLevel
                );
                const pointsToDeduct = level?.points || 0;

                // Kiểm tra điều kiện khóa lớp
                if (
                  userReport?.class?.id !== 0 &&
                  userReport?.reportee?.id === userReport?.class?.author_id
                ) {
                  // Gọi hàm khóa lớp
                  AClass.lockClass(
                    userReport?.class?.id, // classId
                    (response) => {
                      if (response.success) {
                        console.log("Class locked successfully.");
                        Alert.alert("Lớp học đã được khóa thành công!");
                        // Sau khi khóa lớp thành công, tiếp tục trừ điểm uy tín
                        deductPoints();
                      } else {
                        console.error(
                          "Failed to lock class:",
                          response.message
                        );
                        Alert.alert("Đã xảy ra lỗi trong quá trình khóa lớp!");
                      }
                    },
                    (loading) => {
                      // Cập nhật trạng thái loading nếu cần
                      console.log("Locking class loading state:", loading);
                    }
                  );
                } else {
                  // Nếu không cần khóa lớp, trực tiếp trừ điểm uy tín
                  deductPoints();
                }

                // Hàm trừ điểm uy tín
                function deductPoints() {
                  // Hiển thị alert xác nhận
                  Alert.alert(
                    "Xác nhận",
                    `Bạn có chắc chắn muốn chấp nhận và trừ ${pointsToDeduct} điểm uy tín không?`,
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
                            userReport?.reportee?.id,
                            pointsToDeduct,
                            userReportId,
                            (response) => {
                              if (response.success) {
                                console.log("Points deducted successfully.");
                                Alert.alert(
                                  "Điểm uy tín đã được trừ thành công!"
                                );
                              } else {
                                console.error(
                                  "Failed to deduct points:",
                                  response.message
                                );
                                Alert.alert(
                                  "Đã xảy ra lỗi trong quá trình xử lý!"
                                );
                              }
                            },
                            (loading) => {
                              // Cập nhật trạng thái loading nếu cần
                              console.log("Loading state:", loading);
                            }
                          );
                        },
                      },
                    ]
                  );
                }
              }}
            >
              <Text style={styles.textBtnAccept}>Chấp nhận</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnDeney]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.textBtnDeney}>Từ chối</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.btn, styles.deleteUser]}
            onPress={() => setModalLockUserVisible(true)}
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

      {/* //modal từ chối báo cáo */}
      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhập lý do từ chối</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Lý do từ chối báo cáo"
              value={reason}
              onChangeText={(text) => setReason(text)}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, styles.btnCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textBtnCancel}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnD, styles.btnConfirm]}
                onPress={() => denyReport(userReport?.report_id)}
              >
                <Text style={styles.textBtnConfirm}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* modal khoá tài khoản */}
      <Modal
        visible={modalLockUserVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalLockUserVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Khóa tài khoản</Text>

            {/* Hiển thị các vai trò dưới dạng các TouchableOpacity */}
            <ScrollView>
              {userReport?.reportee?.roles?.length > 0 ? (
                userReport.reportee.roles.map((role, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.roleButton,
                      selectedRoles.includes(role.role_id.toString()) &&
                        styles.selectedRoleButton, // Thêm style khi role được chọn
                    ]}
                    onPress={() => handleRoleSelect(role.role_id.toString())} // Cập nhật vai trò đã chọn khi nhấn
                  >
                    <Text
                      style={[
                        styles.roleText,
                        selectedRoles.includes(role.role_id.toString()) &&
                          styles.selectedRoleText, // Thêm style cho văn bản khi role được chọn
                      ]}
                    >
                      {role.role_name}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>Không có vai trò nào.</Text>
              )}
            </ScrollView>

            {/* Nút xác nhận */}
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleLockAccount} // Gọi hàm khóa tài khoản
            >
              <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>

            {/* Nút hủy */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalLockUserVisible(false)}
            >
              <Text style={styles.buttonText}>Hủy bỏ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  reportLevelContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  levelOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  selectedOption: {
    borderColor: "#007AFF",
    backgroundColor: "#e6f0ff",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  role: {
    left: 90,
  },
  infor: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnD: {
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnCancel: {
    backgroundColor: "#ccc",
    flex: 1,
    marginRight: 5,
  },
  btnConfirm: {
    backgroundColor: "#4caf50",
    flex: 1,
    marginLeft: 5,
  },
  textBtnCancel: {
    color: "#000",
    textAlign: "center",
  },
  textBtnConfirm: {
    color: "#fff",
    textAlign: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  textBtn: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  roleButton: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedRoleButton: {
    backgroundColor: "#cce5ff", // Màu nền khi role được chọn
    borderColor: "#007bff", // Đổi màu viền khi role được chọn
  },
  roleText: {
    fontSize: 16,
  },
  selectedRoleText: {
    fontWeight: "bold",
    color: "#007bff", // Màu chữ khi role được chọn
  },
});
