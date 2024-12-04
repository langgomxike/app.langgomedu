import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState, useEffect } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomInput from "../components/Inputs/CustomInput";
import GenderInput from "../components/Inputs/GenderInput";
import AUser from "../../apis/AUser";
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

const URL = ReactAppUrl.PUBLIC_URL;
const userId = "089204000001";
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
    if (selectedDetail) setSelectedDetail(selectedDetail);
  }, [province, district, ward, selectedDetail]);

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
            Alert.alert("Lỗi", response.message || "Cập nhật ảnh thất bại.");
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
    const formData = new FormData();

    // Thêm thông tin vào formData
    formData.append("gender", gender + "");
    if (province) formData.append("province", selectedCity);
    if (district) formData.append("district", selectedDistrict);
    if (ward) formData.append("ward", selectedWard);
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
          Alert.alert("Thành công", "Thông tin cá nhân đã được cập nhật.");
        } else {
          Alert.alert(
            "Lỗi",
            response.message || "Có lỗi xảy ra, vui lòng thử lại."
          );
        }
      },
      (isLoading) => {
        setLoading(isLoading);
      }
    );
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          {/* Screen Title */}
          <Text style={styles.title}>Cập nhật thông tin cá nhân</Text>

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
            <TouchableOpacity style={styles.button} onPress={handleImageUpload}>
              <Image
                style={styles.clickButtonImage}
                source={require("../../../assets/icons/ic_camera.png")}
              />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name */}
            <Text style={styles.label}>Họ và tên</Text>
            <View style={styles.textInput}>
              <Text>{userProfile?.full_name}</Text>
            </View>

            {/* Phone Number */}
            <Text style={styles.label}>Số điện thoại</Text>
            <View style={styles.textInput}>
              <Text>{userProfile?.phone_number}</Text>
            </View>

            {/* Date of Birth */}
            <Text style={styles.label}>Ngày tháng năm sinh</Text>
            <View style={styles.textInput}>
              <Text>{brithday}</Text>
            </View>

            {/* Gender */}
            <Text style={styles.label}>Giới tính</Text>
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
            <Text style={styles.label}>Địa chỉ</Text>
            <DropDownLocationCustom
              selectedCity={selectedCity}
              selectedDistrict={selectedDistrict}
              onSelectedCity={setSelectedCity}
              onSelectedDistrict={setSelectedDistrict}
              selectedWard={selectedWard}
              onSelectedWard={setSelectedWard}
              content={selectedDetail || ""}
              onSelectedContent={setSelectedDetail}
            />

            {/* Majors */}
            <Text style={styles.label}>
              Chuyên ngành và cấp độ lớp quan tâm
            </Text>
            <DropDownMajorsCustom
              selectedMajors={selectedMajors}
              selectedClassLevels={selectedClassLevels}
              onSetSelectedMajors={setSelectedMajors}
              onSetSelectedClassLevels={setSelectedClassLevels}
            />

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.buttonNext, loading && { opacity: 0.7 }]}
              onPress={handleUpdateProfile}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Cập nhật thông tin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    // textAlignVertical: "top",
    textAlign: "left",
    paddingHorizontal: 10,
    paddingVertical: 15,
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
});
