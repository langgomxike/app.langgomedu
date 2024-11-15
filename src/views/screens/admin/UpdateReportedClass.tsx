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
import IconReport from "../../components/ItemUserReport";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import ImageViewer from "react-native-image-zoom-viewer";
import ClassReport from "../../../models/ClassReport";
import AClassReport from "../../../apis/AClassReport";
import { BackgroundColor } from "../../../configs/ColorConfig";
import ReactAppUrl from "../../../configs/ConfigUrl";
import Accordion from "../../components/Accordion";
import AUser from "../../../apis/AUser";
import AClass from "../../../apis/AClass";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../configs/NavigationRouteTypeConfig";
import ScreenName from "../../../constants/ScreenName";

export default function UpdateReportedClass() {
  const route = useRoute<RouteProp<RootStackParamList, ScreenName.REPORT_CLASS>>();
  // Get class id
    const param = route.params;
    console.log("Class id in report class: ", param.classId.toString());

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [classReport, setClassReport] = useState<ClassReport | null>(null);
  const [loading, setLoading] = useState(true);
  const classReportId = param.classId.toString();
  const URL = ReactAppUrl.PUBLIC_URL;
  useEffect(() => {
    AClassReport.getClassReportById(
      classReportId,
      (data: ClassReport) => {
        console.log("Class report", JSON.stringify(data, null, 2));
        setClassReport(data); // Lưu dữ liệu nhận được vào state
      },
      (isLoading: boolean) => {
        setLoading(isLoading); // Cập nhật trạng thái tải
      }
    );
  }, [classReportId]);

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  interface Item {
    id: number;
    name: string;
  }

  if (classReport?.files) {
    classReport.files.forEach((file, index) => {
      console.log(`Path ${index + 1}: ${file.path}`); // Kiểm tra giá trị của path
    });
  }

  // Giả sử cấu trúc là [{ id, path }], không có file.files
  const data: Item[] =
    classReport?.files?.map((file , index) => ({
      id: file.id || index, // Sử dụng index làm ID dự phòng nếu id bị null
      name: file.path || "", // Đảm bảo có giá trị chuỗi rỗng nếu path là null
    })) || [];

  // Log để kiểm tra kết quả của mảng data
  data.forEach((item, index) => {
    console.log(`Item ${index + 1}:`, item);
  });

  const renderItem = ({ item, index }: { item: Item; index: number }) => {
    // Kiểm tra và tạo đường dẫn đầy đủ từ `URL` và `item.name`
    const imageUri = item.name ? `${URL}${item.name}` : URL; // Kết hợp URL và tên ảnh nếu có

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
  const text: string =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis impedit laboriosam ullam, nulla sunt dolorum, fugiat a doloremque possimus saepe aliquam officiis facere odit totam rem cum. Obcaecati, consectetur at!.";
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
          userAvatar={classReport?.user?.avatar?.path}
          userName={classReport?.user?.full_name + ""}
          credibility={classReport?.user?.information?.point}
        ></IconReport>
        {/* tài khoản bị báo cáo */}
        <Text style={styles.smallTitle2}>Tài khoản bị báo cáo</Text>
        <IconReport
          userAvatar={classReport?.class?.author?.avatar?.path}
          userName={classReport?.class?.author?.full_name + ""}
          credibility={classReport?.class?.author?.information?.point}
        ></IconReport>
        {/* lớp học bị báo cáo */}
        <Text style={styles.smallTitle2}>Lớp học bị báo cáo</Text>
        <View style={styles.classInfor}>
          <Text>{classReport?.class?.title}</Text>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </View>
      </View>
      <View style={styles.component1}>
        {classReport &&
        classReport.reports_before &&
        classReport.reports_before.length > 0 &&
        classReport.reports_before[0]?.content !== null ? (
          <>
            <Text style={styles.smallTitle3}>
              Đã bị báo cáo {classReport.reports_before.length} lần
            </Text>
            <View style={styles.reportParent}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                {classReport.reports_before.map((report, index) => (
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
              </ScrollView>
            </View>
          </>
        ) : (
          <Text style={styles.smallTitle3}>
            Không có báo cáo nào trước đây.
          </Text>
        )}

        <Text style={styles.smallTitle3}>Lý do</Text>
        <Text style={styles.reportContent}>{classReport?.content}</Text>
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
                  "Bạn có chắc chắn muốn chấp nhận báo cáo lớp học này không?",
                  [
                    {
                      text: "Hủy",
                      style: "cancel",
                    },
                    {
                      text: "Xác nhận",
                      onPress: () => {
                        // Gọi hàm trừ điểm uy tín
                        AUser.minusUserPoints(
                          classReport?.class?.author?.id, 50, // ID người dùng trừ 50 điểm do là lỗi nghiêm trọng
                          (pointResponse) => {
                            if (pointResponse.success) {
                              console.log("Điểm uy tín đã bị trừ thành công.");

                              // Sau khi trừ điểm, gọi hàm khóa lớp học
                              AClass.lockClass(
                                classReport?.class?.class_id, // ID lớp học
                                (lockResponse) => {
                                  if (lockResponse.success) {
                                    console.log(
                                      "Lớp học đã bị khóa thành công."
                                    );
                                    Alert.alert(
                                      "Lớp học đã được khóa thành công và đã trừ điểm uy tín người dùng!"
                                    );
                                  } else {
                                    console.log(
                                      "Không thể khóa lớp học: ",
                                      lockResponse.message
                                    );
                                    Alert.alert(
                                      "Đã xảy ra lỗi trong quá trình khóa lớp học."
                                    );
                                  }
                                },
                                (lockLoading) => {
                                  // Xử lý trạng thái loading nếu cần thiết
                                  console.log(
                                    "Đang khóa lớp học...",
                                    lockLoading
                                  );
                                }
                              );
                            } else {
                              console.log(
                                "Không thể trừ điểm uy tín: ",
                                pointResponse.message
                              );
                              Alert.alert(
                                "Đã xảy ra lỗi trong quá trình trừ điểm."
                              );
                            }
                          },
                          (pointLoading) => {
                            // Xử lý trạng thái loading nếu cần thiết
                            console.log(
                              "Đang trừ điểm uy tín...",
                              pointLoading
                            );
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
                  "Bạn có chắc chắn muốn từ chối báo cáo lớp học này không?",
                  [
                    {
                      text: "Hủy",
                      style: "cancel",
                    },
                    {
                      text: "Xác nhận",
                      onPress: () => {
                        // Gọi hàm từ chối báo cáo lớp học và xử lý trạng thái
                        AClassReport.denyClassReport(
                          classReport?.id, // Thay `classReport?.reportId` với ID báo cáo lớp học
                          (response) => {
                            if (response.success) {
                              console.log("Class report denied successfully.");
                              Alert.alert(
                                "Từ chối báo cáo lớp học thành công!"
                              );
                            } else {
                              console.log(
                                "Failed to deny class report:",
                                response.message
                              );
                              Alert.alert(
                                "Đã xảy ra lỗi trong quá trình xử lý!"
                              );
                            }
                          },
                          (loading) => {} // Có thể xử lý trạng thái loading nếu cần thiết
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
      "Bạn có chắc chắn muốn khoá tài khoản và lớp học này không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => {
            // Gọi hàm khóa tài khoản
            AUser.lockUserAccount(
              classReport?.class?.author?.id ?? "", // ID người dùng
              (accountResponse) => {
                if (accountResponse.success) {
                  console.log("Tài khoản đã bị khóa thành công.");

                  // Sau khi khóa tài khoản, gọi hàm khóa lớp học
                  AClass.lockClass(
                    classReport?.class?.class_id, // ID lớp học
                    (classResponse) => {
                      if (classResponse.success) {
                        console.log("Lớp học đã bị khóa thành công.");
                        Alert.alert(
                          "Tài khoản và lớp học đã được khóa thành công!"
                        );
                      } else {
                        console.log(
                          "Không thể khóa lớp học: ",
                          classResponse.message
                        );
                        Alert.alert(
                          "Đã xảy ra lỗi trong quá trình khóa lớp học."
                        );
                      }
                    },
                    (classLoading) => {
                      // Xử lý trạng thái loading nếu cần thiết
                      console.log("Đang khóa lớp học...", classLoading);
                    }
                  );
                } else {
                  console.log(
                    "Không thể khóa tài khoản: ",
                    accountResponse.message
                  );
                  Alert.alert("Đã xảy ra lỗi trong quá trình khóa tài khoản.");
                }
              },
              (accountLoading) => {
                // Xử lý trạng thái loading nếu cần thiết
                console.log("Đang khóa tài khoản...", accountLoading);
              }
            );
          },
        },
      ]
    );
  }}
>
  <Text style={styles.textBtnDeleteUser}>Khoá tài khoản</Text>
</TouchableOpacity>
        </View>
      </View>
      {/* Modal hiển thị hình ảnh */}
      {selectedIndex !== null && (
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)} // Sửa để đóng modal khi nhấn nút back
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <ImageViewer
            imageUrls={data.map((item) => ({ url: `${URL}${item.name}` }))} // Kết hợp URL với tên ảnh
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