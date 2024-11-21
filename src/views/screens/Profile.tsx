import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import {useCallback, useState} from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomInput from "../components/Inputs/CustomInput";
import GenderInput from "../components/Inputs/GenderInput";

export default function ProfileScreen() {
  //states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [hometown, setHometown] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [interestedField, setInterestedField] = useState("");

  //handlers
  const handleSubmit = useCallback(() => {
    alert("Call api to save profile here");
  }, []);
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* screen title */}
        <Text style={styles.title}>Cập nhật thông tin cá nhân</Text>

        {/* avatar*/}
        <View style={styles.avatarContainer}>
          <Image
            source={require("../../../assets/avatar/img_avatar_cat.png")}
            style={styles.avatar}
          />

          {/* pick avatar*/}
          <TouchableOpacity
            style={styles.button}
            onPress={() => alert("Chọn ảnh!")}
          >
            <Image
              style={styles.clickButtonImage}
              source={require("../../../assets/icons/ic_camera.png")}
            />
          </TouchableOpacity>
        </View>

        {/* hint text */}
        <Text style={{ marginBottom: 20 }}>Vui long chon anh</Text>

        <View style={styles.form}>
          {/* Full name*/}
          <View style={styles.label}>
            <CustomInput
              label="Họ & tên *"
              onChangeText={setName}
              placeholder="Nhập họ và tên"
              type="text"
              required={false}
            />
          </View>

          {/* Phone number */}
          <View style={styles.label}>
            <CustomInput
              label="Số điện thoại *"
              onChangeText={setPhone}
              type="phone"
              required={false}
              placeholder="037XXXXXXX"
              editable={false}
            />
          </View>

          {/* Day of birth */}
          <View style={styles.label}>
            <CustomInput
              label="Ngày sinh"
              placeholder="..."
              type="date"
              onChangeText={() => {}}
              editable={false}
              required={true}
            />
          </View>

          {/* Gender */}
          <Text style={styles.label}>Giới tính *</Text>
          <View style={styles.label}>
            <GenderInput onChange={() => setGender("")} value={1} />
          </View>

          {/* Address */}
          <Text style={styles.label}>Địa chỉ *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={address}
              onValueChange={(itemValue) => setAddress(itemValue)}
            >
              <Picker.Item label="Chọn tỉnh/thành phố" value="" />
              <Picker.Item label="Hà Nội" value="Hanoi" />
              <Picker.Item label="Hồ Chí Minh" value="HCMC" />
              {/* Thêm các tỉnh/thành khác */}
            </Picker>
          </View>

          {/* Quê quán */}
          <Text style={styles.label}>Quê quán *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={hometown}
              onValueChange={(itemValue) => setHometown(itemValue)}
            >
              <Picker.Item label="Chọn tỉnh/thành phố" value="" />
              <Picker.Item label="Hà Nội" value="Hanoi" />
              <Picker.Item label="Hồ Chí Minh" value="HCMC" />
              {/* Thêm các tỉnh/thành khác */}
            </Picker>
          </View>

          {/* Phương tiện */}
          <Text style={styles.label}>Phương tiện</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={vehicle}
              onValueChange={(itemValue) => setVehicle(itemValue)}
            >
              <Picker.Item label="Chọn phương tiện" value="" />
              <Picker.Item label="Xe máy" value="motorbike" />
              <Picker.Item label="Ô tô" value="car" />
              <Picker.Item label="Xe đạp" value="bicycle" />
              {/* Thêm phương tiện khác */}
            </Picker>
          </View>

          {/* Chuyên ngành quan tâm */}
          <Text style={styles.label}>Chuyên ngành quan tâm</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={interestedField}
              onValueChange={(itemValue) => setInterestedField(itemValue)}
            >
              <Picker.Item label="Các chuyên ngành quan tâm" value="" />
              <Picker.Item label="Công nghệ thông tin" value="it" />
              <Picker.Item label="Kinh tế" value="economy" />
              {/* Thêm các ngành khác */}
            </Picker>
          </View>

          {/* Nút tiếp tục */}
          <TouchableOpacity style={styles.buttonNext} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    marginBottom: 15,
    fontSize: 14,
    color: "#333",
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
});
