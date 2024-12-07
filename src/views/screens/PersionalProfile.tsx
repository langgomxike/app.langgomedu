import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useState, useEffect, useContext } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomInput from "../components/Inputs/CustomInput";
import GenderInput from "../components/Inputs/GenderInput";
import AUser from "../../apis/AUser";
import Ionicons from "@expo/vector-icons/Ionicons";
import User from "../../models/User";
import DateTimeConfig from "../../configs/DateTimeConfig";
import ReactAppUrl from "../../configs/ConfigUrl";
import DropDownAddress from "../components/dropdown/DropDownAddress";
import DropDownLocation from "../components/dropdown/DropDownLocation";
import DropDownMajors from "../components/dropdown/DropDownMajors";
import DropDownLocationCustom from "../components/dropdown/DropDownLocationCustom";
import DropDownMajorsCustom from "../components/dropdown/DropDownMajorsCustom";
import { TextInput } from "react-native-gesture-handler";
import { set } from "firebase/database";
import { FileInfo } from "expo-file-system";
import { AccountContext } from "../../configs/AccountConfig";
import { LanguageContext } from "../../configs/LanguageConfig";
import { NavigationContext } from "@react-navigation/native";
import MyIcon, { AppIcon } from "../components/MyIcon";
import { BackgroundColor } from "../../configs/ColorConfig";
import ImageViewer from "react-native-image-zoom-viewer";

const URL = ReactAppUrl.PUBLIC_URL;
let userId = "-1";
const GENDER = {
  MALE: 0,
  FEMALE: 1,
  OTHER: 2,
};
const GENDER_TEXT = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Khác",
};
export default function PersionalProfileScreen() {
  //contexts
  const accountContext = useContext(AccountContext);
  userId = accountContext.account?.id || "-1";
  const languageContext = useContext(LanguageContext).language;
  const navigation = useContext(NavigationContext);

  // States
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<any | null>(null);
  const [province, setProvince] = useState<string | undefined>();
  const [district, setDistrict] = useState<string | undefined>();
  const [ward, setWard] = useState<string | undefined>();
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [selectedDetail, setSelectedDetail] = useState<string>("");
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [selectedClassLevels, setSelectedClassLevels] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  // Giới tính
  const [gender, setGender] = useState(GENDER.MALE); // Default to MALE

  // Lấy thông tin profile
  useEffect(() => {
    AUser.getUserProfileById(
      userId,
      (data: User) => {
        setUserProfile(data);
        setImage(data?.avatar ? `${URL}/${data.avatar}` : null);
        setProvince(data?.address?.province || "");
        setDistrict(data?.address?.district || "");
        setWard(data?.address?.ward || "");
        setSelectedDetail(data?.address?.detail || "");

        const classLevelIds =
          data?.interested_class_levels?.map((item: any) => item.id) || [];
        setSelectedClassLevels(classLevelIds);

        const MajorIds =
          data?.interested_majors?.map((item: any) => item.id) || [];
        setSelectedMajors(MajorIds);

        switch (data.gender?.id) {
          case 0:
            setGender(GENDER.MALE);
            break;
          case 1:
            setGender(GENDER.FEMALE);
            break;
          case 2:
            setGender(GENDER.OTHER);
            break;
        }
      },
      (isLoading: boolean) => {
        setLoading(isLoading);
      }
    );
  }, [userId]);

  useEffect(() => {
    if (province) setSelectedCity(province);
    if (district) setSelectedDistrict(district);
    if (ward) setSelectedWard(ward);
  }, [province, district, ward]);

  useEffect(() => {
    if (selectedDetail) setSelectedDetail(selectedDetail);
  }, [selectedDetail]);

  // Chuyển đổi thời gian
  const timestamp = userProfile?.birthday ?? 0;
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const brithday = `${day}/${month}/${year}`;

  const handleImageUpload = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Cần quyền truy cập",
        "Vui lòng cấp quyền truy cập thư viện ảnh!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Cắt ảnh vuông
      quality: 0.7, // Chất lượng ảnh
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const fileName = uri.split("/").pop();
      const fileType = fileName?.split(".").pop();
      const response = await fetch(uri);
      const blob = await response.blob();
      const imageFile = new File([blob], fileName || "profile.jpg", {
        type: `image/${fileType}`,
      });

      setSelectedImageFile(imageFile);
      setImage(uri); // Lưu URI để sử dụng trong FormData

      const formData = new FormData();
      formData.append("file", {
        name: imageFile.name,
        type: imageFile.type,
        uri: uri, // URI đã lưu
      } as any);

      // Gọi API updateAvatar
      AUser.updateAvatar(
        userId,
        formData,
        (response) => {
          if (response.success) {
            Alert.alert("Thành công", "Cập nhật ảnh đại diện thành công!");
          } else {
            Alert.alert(response.message || "Cập nhật ảnh thất bại.");
          }
        },
        (loading) => {
          console.log("Loading:", loading);
        }
      );
    } else {
      console.log("Image selection canceled.");
    }
  };

  const handleGenderChange = (value: number) => {
    switch (value) {
      case GENDER.MALE:
        setGender(GENDER.MALE);
        break;
      case GENDER.FEMALE:
        setGender(GENDER.FEMALE);
        break;
      case GENDER.OTHER:
        setGender(GENDER.OTHER);
        break;
    }
  };

  const handleUpdateProfile = async () => {
    // Kiểm tra các trường bắt buộc
    if (!selectedCity || !selectedDistrict || !selectedWard) {
      Alert.alert("Thông báo", "Vui lòng chọn đầy đủ Tỉnh, Quận/Huyện và Xã.");
      return;
    }

    const formData = new FormData();

    // Thêm thông tin vào formData
    formData.append("gender", gender + "");
    if (selectedCity) formData.append("province", selectedCity);
    if (selectedDistrict) formData.append("district", selectedDistrict);
    if (selectedWard) formData.append("ward", selectedWard);
    if (selectedDetail) formData.append("detail", selectedDetail);
    if (selectedClassLevels.length > 0) {
      formData.append("classes", JSON.stringify(selectedClassLevels));
    }
    if (selectedMajors.length > 0) {
      formData.append("majors", JSON.stringify(selectedMajors));
    }

    // Gọi API cập nhật
    AUser.updateUserProfile(
      userId,
      formData,
      (response) => {
        if (response.success) {
          // Alert.alert("Thành công", "Thông tin cá nhân đã được cập nhật.");
          Alert.alert("Cập nhật thông tin thành công");
        } else {
          Alert.alert(response.message || "Có lỗi xảy ra, vui lòng thử lại.");
          // Alert.alert("Cập nhật thất bại vui lòng thử lại");
        }
      },
      (isLoading) => {
        setLoading(isLoading);
      }
    );
  };

  // console.log("user Id", `${ReactAppUrl.PUBLIC_URL}${userProfile?.avatar}`);
  // console.log("user Id", userId);
  useEffect(() => {
    if (navigation) {
      navigation.setOptions({
        title: languageContext.SCREEN_NAME_SETING_PROFILE,
        headerShown: true,
        contentStyle: {
          padding: 0,
        },
        headerStyle: {
          backgroundColor: BackgroundColor.primary,
        },
        headerTintColor: "#fff",
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ paddingRight: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, userProfile]);
  const handleViewImage = () => {
    // Hiển thị modal chứa ImageViewer
    setShowImageModal(true);
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView>
        <View style={styles.container}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Image
              source={
                image
                  ? { uri: image }
                  : require("../../../assets/avatar/img_avatar_cat.png")
              }
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowModal(true)} // Hiển thị modal khi nhấn vào avatar
            >
              <Image
                style={styles.clickButtonImage}
                source={require("../../../assets/icons/ic_camera.png")}
              />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name */}
            <Text style={styles.label}>{languageContext.NAME}</Text>
            <View style={styles.textInput}>
              <Text>{userProfile?.full_name}</Text>
            </View>

            {/* Phone Number */}
            <Text style={styles.label}>{languageContext.PHONE_NUMBER}</Text>
            <View style={styles.textInput}>
              <Text>{userProfile?.phone_number}</Text>
            </View>

            {/* Date of Birth */}
            <Text style={styles.label}>{languageContext.BIRTHDAY}</Text>
            <View style={styles.textInput}>
              <Text>{brithday}</Text>
            </View>

            {/* Gender */}
            <Text style={styles.label}>{languageContext.GENDER}</Text>
            <View style={styles.genderDropdown}>
              <Picker
                selectedValue={gender} // Giá trị hiện tại của giới tính
                onValueChange={handleGenderChange} // Hàm xử lý khi chọn giá trị mới
                style={styles.picker}
              >
                <Picker.Item label="Nam" value={GENDER.MALE} />
                <Picker.Item label="Nữ" value={GENDER.FEMALE} />
                <Picker.Item label="Khác" value={GENDER.OTHER} />
              </Picker>
            </View>
            {/* Address */}
            <Text style={styles.label}>{languageContext.ADDRESS}</Text>
            <DropDownLocationCustom
              selectedCity={selectedCity}
              selectedDistrict={selectedDistrict}
              onSelectedCity={setSelectedCity}
              onSelectedDistrict={setSelectedDistrict}
              selectedWard={selectedWard}
              onSelectedWard={setSelectedWard}
            />
            <TextInput
              style={styles.detailAddress}
              placeholder="Nhập nội dung"
              placeholderTextColor="#888"
              multiline
              value={selectedDetail}
              onChangeText={setSelectedDetail}
            />

            {/* Majors */}
            <Text style={styles.label}>
              {languageContext.MAJORS_AND_CLASS_LEVEL}
            </Text>
            <DropDownMajorsCustom
              selectedMajors={selectedMajors}
              selectedClassLevels={selectedClassLevels}
              onSetSelectedMajors={setSelectedMajors}
              onSetSelectedClassLevels={setSelectedClassLevels}
            />
          </View>
        </View>
      </ScrollView>
      {/* Save Button */}
      <TouchableOpacity
        style={[styles.buttonNext, loading && { opacity: 0.7 }]}
        onPress={handleUpdateProfile}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{languageContext.UPDATED_PROFILE}</Text>
      </TouchableOpacity>
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)} // Đóng modal
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowModal(false); // Đóng modal
                handleImageUpload(); // Gọi hàm cập nhật hình ảnh
              }}
            >
              <Text style={styles.modalButtonText}>Cập nhật hình ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowModal(false); // Đóng modal
                handleViewImage(); // Gọi hàm xem ảnh
              }}
            >
              <Text style={styles.modalButtonText}>Xem ảnh</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal xem hình ảnh */}
      <Modal
        visible={showImageModal}
        transparent={true}
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentImg}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowImageModal(false)} // Đóng modal
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            {/* ImageViewer */}
            <ImageViewer
              imageUrls={[
                {
                  url: `${ReactAppUrl.PUBLIC_URL}${userProfile?.avatar}` || "",
                },
              ]}
              enableSwipeDown={true}
              onSwipeDown={() => setShowImageModal(false)} // Đóng modal khi vuốt xuống
              saveToLocalByLongPress={false} // Tùy chọn nếu bạn không muốn người dùng lưu ảnh
              style={{ width: "100%", height: "100%" }} // Đảm bảo image viewer chiếm toàn bộ modal
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    justifyContent: "center",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonNext: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginLeft: "5%",
    width: "90%",
    marginBottom: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  mainAvatar: {
    marginBottom: 15,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50, // Để hình tròn
  },
  button: {
    position: "absolute",
    bottom: -8,
    right: -5,
    borderRadius: 20,
    padding: 5,
  },
  clickButtonImage: {
    width: 25,
    height: 25,
    borderRadius: 50,
  },
  textInput: {
    height: 50,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    textAlign: "left",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  detailAddress: {
    height: 100,
    textAlignVertical: "top",
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 10,
    backgroundColor: "#fff",
    textAlign: "left",
    paddingVertical: 15,
    marginTop: 15,
  },

  genderDropdown: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
    paddingTop: 50,
  },
  modalContentImg: {
    backgroundColor: "white",
    padding: 0,
    borderRadius: 10,
    width: "90%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalButton: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    borderWidth: 0.5,
  },
  modalButtonText: {
    color: "#000",
    fontSize: 14,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "transparent",
    alignItems: "center",
    borderRadius: 50,
    borderColor: "#ddd",
    width: 40,
    height: 40,
    zIndex: 1, // Đảm bảo nút đóng luôn ở trên các nút khác
  },
  closeButtonText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
});
