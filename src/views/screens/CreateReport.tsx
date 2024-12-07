import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "react-native-image-zoom-viewer";
import MyIcon, { AppIcon } from "../components/MyIcon";
import IconReport from "../components/ItemUserReport";
import AUserReport from "../../apis/AUserReport";
import { AccountContext } from "../../configs/AccountConfig";
import { LanguageContext } from "../../configs/LanguageConfig";
import { NavigationContext } from "@react-navigation/native";
import AUser from "../../apis/AUser";
import User from "../../models/User";
import ReactAppUrl from "../../configs/ConfigUrl";
import Class from "../../models/Class";
import AClass from "../../apis/AClass";
const URL = ReactAppUrl.PUBLIC_URL;

export default function CreateReport() {
  //contexts
  const accountContext = useContext(AccountContext);
  const languageContext = useContext(LanguageContext).language;
  const navigation = useContext(NavigationContext);

  const reporter = "089204000001";
  const reportee = "080204000002";
  const class_id = "2";

  const [content, setContent] = useState<string>("");
  const [selectedImages, setselectedImages] = useState<any[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reporteeInfor, setreporteeInfor] = useState<User | null>(null);
  const [classReport, setClassReport] = useState<Class | null>(null);

  // Hàm mở thư viện ảnh
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Lỗi", "Ứng dụng cần quyền truy cập thư viện ảnh.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const images = result.assets;
      // console.log('text pick many images',result.assets );
      setselectedImages(images);
    }
  };

  useEffect(() => {
    console.log(
      "text pick many images selectedImages",
      JSON.stringify(selectedImages, null, 2)
    );
  }, [selectedImages]);

  // Hàm xóa ảnh đã chọn
  const removeImage = (index: number) => {
    setselectedImages((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Hàm gửi báo cáo
  const handleReportSubmit = () => {
    if (!content.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung báo cáo.");
      return;
    }

    const formdata = new FormData();
    formdata.append("reporter", reporter);
    formdata.append("reportee", reportee);
    formdata.append("content", content);
    formdata.append("class_id", class_id);

    selectedImages.forEach((image, index) => {
      formdata.append(`reports`, {
        uri: image.uri,
        type: image.mimeType,
        name: image.name || `image_${index}.jpg`, // Tên tệp
      } as any);
    });

    // Gọi API tạo báo cáo
    AUserReport.createReport(
      formdata, // Dữ liệu báo cáo
      (response: any) => {
        if (response.success) {
          Alert.alert("Thành công", "Báo cáo đã được gửi thành công!");
          setContent("");
        } else {
          Alert.alert("Thất bại", response.message || "Không thể gửi báo cáo.");
        }
      },
      (loading: boolean) => {
        if (loading) {
          console.log("Đang gửi báo cáo...");
        } else {
          console.log("Đã gửi báo cáo xong.");
        }
      }
    );
  };

  // Hàm mở modal xem ảnh
  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setModalVisible(true);
  };

  useEffect(() => {
    AUser.getUserProfileById(
      reportee,
      (data: User) => {
        // console.log(data);
        setreporteeInfor(data); // Lưu dữ liệu nhận được vào state
      },
      (isLoading: boolean) => {}
    );
  }, [reportee]);

  useEffect(() => {
    if (class_id && class_id !== 0+"") {
      AClass.getClassById(
        class_id,
        (classDetails) => {
          if (classDetails) {
            setClassReport(classDetails);
          } else {
            setClassReport(null);
          }
        },
        (isLoading) => {
          console.log("Loading:", isLoading);
        }
      );
    } else {
      setClassReport(null);
    }
  }, [class_id]);

  console.log("class_id", class_id);
  console.log("class", classReport?.title);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.component1}>
        <View style={styles.screenName}>
          <TouchableOpacity style={styles.backBtn}>
            <MyIcon
              size="20"
              icon={AppIcon.back_button}
              onPress={navigation?.goBack}
            />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>
            {languageContext.SCREEN_NAME_REPORT}
          </Text>
        </View>
        <Text style={styles.smallTitle}>{languageContext.REPORTEE}</Text>
        <View style={styles.iconReport}>
          <IconReport
            userAvatar={reporteeInfor?.avatar + ""}
            userName={reporteeInfor?.full_name + ""}
            credibility={reporteeInfor?.point}
          />
        </View>
        {class_id !== 0 + "" ? (
          <>
            <Text style={styles.smallTitle}>
              {languageContext.CLASS_DETAILS}
            </Text>
            <View style={styles.classReport}>
              <Text>{classReport?.title}</Text>
            </View>
          </>
        ) : null}
        <Text style={styles.smallTitle}>{languageContext.CONTENT_REPORT}</Text>
        <TextInput
          style={styles.textInput}
          placeholder={languageContext.INPUT_CONTENT}
          placeholderTextColor="#888"
          multiline
          value={content}
          onChangeText={setContent}
        />
      </View>
      <View style={styles.componentn}>
        <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
          <Ionicons name="image-outline" size={24} color="black" />
          <Text style={styles.uploadText}>{languageContext.PICK_IMAGE}</Text>
        </TouchableOpacity>
        <Text style={styles.uploadGuideText}>
          {languageContext.PLEASE_UPLOAD_REPORT_IMAGES}
        </Text>
      </View>
      <View style={styles.component1}>
        <Text style={styles.smallTitle}>{languageContext.PICKED_IMAGE}</Text>
        {selectedImages.length > 0 ? (
          <FlatList
            data={selectedImages}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity onPress={() => openModal(index)}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: item.uri }} style={styles.image} />
                    <TouchableOpacity
                      style={styles.deleteIcon}
                      onPress={() => removeImage(index)}
                    >
                      <Ionicons
                        name="close-circle"
                        size={24}
                        style={styles.removePicture}
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            }}
            horizontal
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text style={styles.noImageText}>
            {languageContext.NO_IMAGE_PICKED}
          </Text>
        )}
      </View>
      <View style={styles.component1}>
        <TouchableOpacity style={styles.reportBtn} onPress={handleReportSubmit}>
          <Text style={styles.reportBtnText}>{languageContext.REPORT}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          {/* Nút đóng Modal */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="#FFF" />
          </TouchableOpacity>

          {/* Image Viewer */}
          <ImageViewer
            imageUrls={selectedImages.map((selectedImage) => ({
              url: selectedImage.uri,
            }))} // Sử dụng imageUris để hiển thị ảnh
            index={currentImageIndex}
            onCancel={() => setModalVisible(false)}
            enableSwipeDown={true} // Cho phép vuốt xuống để đóng modal
          />
        </View>
      </Modal>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eee",
    flex: 1,
  },
  component1: {
    backgroundColor: "#fff",
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
  },
  component3: {
    backgroundColor: "#fff",
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
  },
  componentn: {
    backgroundColor: "#fff",
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  screenName: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backBtn: {
    marginRight: 10,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  smallTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#828282",
  },
  textInput: {
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  uploadBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    width: 150,
  },
  uploadText: {
    marginLeft: 10,
    fontSize: 16,
  },
  uploadGuideText: {
    marginTop: 10,
    textAlign: "center",
    color: "#666",
  },
  imageContainer: {
    marginRight: 10,
    position: "relative",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  deleteIcon: {
    color: "#fff",
    position: "absolute",
    top: 5,
    right: 5,
  },
  noImageText: {
    color: "#666",
    textAlign: "center",
  },
  component2: {
    padding: 15,
  },
  reportBtn: {
    backgroundColor: "#0D99FF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  reportBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  iconReport: {},
  classReport: {
    borderWidth: 0.5,
    height: 55,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    justifyContent: "center",
    borderRadius: 10,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)", // Màu nền tối
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1, // Hiển thị trên mọi thành phần khác
  },
  removePicture: {
    color: "#000",
  },
});
