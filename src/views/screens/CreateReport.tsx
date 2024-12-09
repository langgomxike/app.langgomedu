import React, {useContext, useEffect, useState} from "react";
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
import MyIcon, {AppIcon} from "../components/MyIcon";
import IconReport from "../components/ItemUserReport";
import AUserReport from "../../apis/AUserReport";
import User from "../../models/User";
import Class from "../../models/Class";
import {CreateReportNavigationType} from "../../configs/NavigationRouteTypeConfig";
import {NavigationContext, NavigationRouteContext} from "@react-navigation/native";
import {BackgroundColor} from "../../configs/ColorConfig";
import {LanguageContext} from "../../configs/LanguageConfig";
import { AccountContext } from "../../configs/AccountConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateReport() {
  const route = useContext(NavigationRouteContext);
  const acountContext = useContext(AccountContext);
  const navigation = useContext(NavigationContext);
  const language = useContext(LanguageContext).language;

  const [content, setContent] = useState<string>(""); // Nội dung báo cáo
  const [selectedImages, setselectedImages] = useState<any[]>([]); // Mảng lưu trữ File[]
  const [isModalVisible, setModalVisible] = useState(false); // Trạng thái hiển thị modal
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Ảnh được chọn để xem
  const [reportee, setReportee] = useState<User>();
  const [_class, setClass] = useState<Class | undefined>();

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
    // console.log(
    //   "text pick many images selectedImages",
    //   JSON.stringify(selectedImages, null, 2)
    // );
  }, [selectedImages]);

  // Hàm xóa ảnh đã chọn
  const removeImage = (index: number) => {
    setselectedImages((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Hàm gửi báo cáo
  // const handleReportSubmit = async () => {
  //   // Kiểm tra nội dung báo cáo
  //   if (!content.trim()) {
  //     Alert.alert("Lỗi", "Vui lòng nhập nội dung báo cáo.");
  //     return;
  //   }
  
  //   // Kiểm tra danh sách hình ảnh
  //   if (selectedImages.length === 0) {
  //     Alert.alert("Lỗi", "Vui lòng thêm ít nhất một hình ảnh.");
  //     return;
  //   }

  // // Lấy số lần báo cáo hiện tại của người báo cáo đối với người bị báo cáo
  // const reportKey = `report_count_${acountContext.account?.id + ""}_${reportee?.id ?? "-1"}`;
  // const currentReportCount = await localStorage.getItem(reportKey);
  // const reportCount = currentReportCount ? parseInt(currentReportCount, 10) : 0;

  // console.log("-----------------------------");
  // console.log("reporter",acountContext.account?.id + "");
  // console.log("reportee",reportee?.id ?? "-1");
  // console.log("reportKey",reportKey);
  // console.log("currentReportCount",currentReportCount);
  // console.log("reportCount",reportCount);
  // // Kiểm tra xem người dùng đã báo cáo 3 lần chưa
  // if (reportCount >= 3) {
  //   Alert.alert("Lỗi", "Bạn đã báo cáo người này 3 lần. Bạn không thể báo cáo thêm.");
  //   return;
  // }

  //   const formdata = new FormData();
  //   formdata.append("reporter", acountContext.account?.id + "");
  //   formdata.append("reportee", reportee?.id ?? "-1");
  //   formdata.append("content", content);
  
  //   if (_class) {
  //     formdata.append("class_id", _class.id + "");
  //   }
  
  //   selectedImages.forEach((image, index) => {
  //     formdata.append(`reports`, {
  //       uri: image.uri,
  //       type: image.mimeType,
  //       name: image.name || `image_${index}.jpg`, // Tên tệp
  //     } as any);
  //   });
  //   // Gọi API tạo báo cáo
  //   AUserReport.createReport(
  //     formdata, // Dữ liệu báo cáo
  //     async (response: any) => {
  //       if (response.success) {
  //         await localStorage.setItem(reportKey, (reportCount + 1).toString());
  //         Alert.alert("Thành công", "Báo cáo đã được gửi thành công!");
  //         setContent("");
  //         navigation?.goBack();
  //       } else {
  //         Alert.alert("Thất bại", response.message || "Không thể gửi báo cáo.");
  //       }
  //     },
  //     (loading: boolean) => {
  //       if (loading) {
  //         console.log("Đang gửi báo cáo...");
  //       } else {
  //         console.log("Đã gửi báo cáo xong.");
  //       }
  //     }
  //   );
  // };
  
 
const handleReportSubmit = async () => {
  // Kiểm tra nội dung báo cáo
  if (!content.trim()) {
    Alert.alert("Lỗi", "Vui lòng nhập nội dung báo cáo.");
    return;
  }

  // Kiểm tra danh sách hình ảnh
  if (selectedImages.length === 0) {
    Alert.alert("Lỗi", "Vui lòng thêm ít nhất một hình ảnh.");
    return;
  }

  // Lấy số lần báo cáo hiện tại của người báo cáo đối với người bị báo cáo
  const reportKey = `report_count_${acountContext.account?.id + ""}_${reportee?.id ?? "-1"}`;
  const currentReportCount = await AsyncStorage.getItem(reportKey); // Sử dụng AsyncStorage
  const reportCount = currentReportCount ? parseInt(currentReportCount, 10) : 0;

  // Kiểm tra xem người dùng đã báo cáo 3 lần chưa
  if (reportCount >= 3) {
    Alert.alert("Lỗi", "Bạn đã báo cáo người này 3 lần. Bạn không thể báo cáo thêm.");
    return;
  }

  const formdata = new FormData();
  formdata.append("reporter", acountContext.account?.id + "");
  formdata.append("reportee", reportee?.id ?? "-1");
  formdata.append("content", content);

  if (_class) {
    formdata.append("class_id", _class.id + "");
  }

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
    async (response: any) => {
      if (response.success) {
        // Cập nhật số lần báo cáo thành công vào AsyncStorage
        await AsyncStorage.setItem(reportKey, (reportCount + 1).toString());
        Alert.alert("Thành công", "Báo cáo đã được gửi thành công!");
        setContent("");
        navigation?.goBack();
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
    if (navigation) {
      navigation.setOptions({
        title: "Tạo báo cáo",
        headerShown: true,
        contentStyle: {
          padding: 0,
        },
        headerStyle: {
          backgroundColor: BackgroundColor.primary,
        },
        headerTintColor: "#fff",
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        )
      });
    }
  }, [navigation]);

  useEffect(() => {
    const data: CreateReportNavigationType = route?.params as CreateReportNavigationType;

    setReportee(data.reportee);
    if (data.class) {
      setClass(data.class);
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.component1}>

        <Text style={styles.smallTitle}>Người dùng bị báo cáo</Text>
        <View style={styles.iconReport}>
          <IconReport userName={reportee?.full_name ?? ""} credibility={reportee?.point ?? 0}
                      userAvatar={reportee?.avatar}/>
        </View>

        {_class &&
          <>
            <Text style={styles.smallTitle}>Lop hoc bị báo cáo</Text>
            <View style={styles.iconReport}>
              <IconReport userName={_class?.title ?? ""} credibility={reportee?.point ?? 0}
                          userAvatar={_class?.major?.icon} isClass={true}/>
            </View>
          </>}

        <Text style={styles.smallTitle}>Nội dung báo cáo</Text>
        <TextInput
          style={styles.textInput}
          placeholder={language.INPUT_CONTENT}
          placeholderTextColor="#888"
          multiline
          value={content}
          onChangeText={setContent}
        />
      </View>
      <View style={styles.componentn}>
        <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
          <Ionicons name="image-outline" size={24} color="black"/>
          <Text style={styles.uploadText}>Chọn ảnh</Text>
        </TouchableOpacity>
        <Text style={styles.uploadGuideText}>
          {language.PLEASE_UPLOAD_REPORT_IMAGES}
        </Text>
      </View>
      <View style={styles.component1}>
        <Text style={styles.smallTitle}>{language.PICKED_IMAGE}</Text>
        {selectedImages.length > 0 ? (
          <FlatList
            data={selectedImages}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity onPress={() => openModal(index)}>
                  <View style={styles.imageContainer}>
                    <Image source={{uri: item.uri}} style={styles.image}/>
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
            {language.NO_IMAGE_PICKED}
          </Text>
        )}
      </View>
      <View style={styles.component1}>
        <TouchableOpacity style={styles.reportBtn} onPress={handleReportSubmit}>
          <Text style={styles.reportBtnText}>{language.REPORT}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          {/* Nút đóng Modal */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="#FFF"/>
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
