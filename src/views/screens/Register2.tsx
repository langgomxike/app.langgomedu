import { ScrollView, Text, View, StyleSheet, Image } from "react-native";
import MyIcon, { AppIcon } from "../components/MyIcon";
import InputRegister from "../components/Inputs/InputRegister";
import Button from "../components/Button";
import { useCallback, useContext, useState } from "react";
import { NavigationContext } from "@react-navigation/native";
import ScreenName from "../../constants/ScreenName";
import {
  useCameraPermissions,
  Camera,
  BarcodeScanningResult,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import SLog, { LogType } from "../../services/SLog";
import MyText from "../components/MyText";
import Ionicons from "@expo/vector-icons/Ionicons";
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";

export default function RegisterStep2Screen() {
  //contexts
  const navigation = useContext(NavigationContext);
  const [permission, requestPermission] = useCameraPermissions();

  //states
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [dayOfBirth, setDayOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");

  //handlers
  const goBack = useCallback(() => {
    navigation?.goBack();
    navigation?.goBack();
    navigation?.navigate(ScreenName.HOME);
  }, []);

  const onRegister = useCallback(() => {
    navigation?.navigate(ScreenName.HOME);
  }, []);

  function goToLogin(): void {
    navigation?.navigate(ScreenName.LOGIN);
  }

  const pickImage = useCallback(() => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    })
      .then((result) => {
        SLog.log(LogType.Info, "ImagePicker", "process result", result);

        if (!result.canceled) {
          return Camera.scanFromURLAsync(result.assets[0].uri);
        }
        return [];
      })
      .then((value: BarcodeScanningResult[]) => {
        SLog.log(
          LogType.Info,
          "BarcodeScanningResult",
          "process result",
          value
        );

        processResult(value.length > 0 ? value[0].data : "");
      });
  }, [permission]);

  const processResult = useCallback(
    (result: string) => {
      alert(result);

      const data = result.split("|");
      let id: string,
        name: string,
        dayOfBirth: string,
        gender: string,
        address: string;

      if (data.length > 1) {
        id = data[0];
        setId(id);
      }

      if (data.length > 3) {
        name = data[2];
        setName(name);
      }

      if (data.length > 4) {
        dayOfBirth = data[3];
        setDayOfBirth(dayOfBirth);
      }

      if (data.length > 5) {
        gender = data[4];
        setGender(gender);
      }

      if (data.length > 6) {
        address = data[5];
        setAddress(address);
      }
    },
    [permission]
  );

  return (
    <ScrollView style={styles.container}>
      {/* back button */}
      <Ionicons
        name="close"
        size={30}
        style={styles.backButton}
        onPress={goBack}
      />

      <View style={{height: 50}} />

      {/* illustration text*/}
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>Tạo tài khoản</Text>
          <Text style={styles.content}>
            Hãy cho chúng tôi biết thêm thông tin về bạn
          </Text>
        </View>
      </View>

      {/* pick citizen's id*/}
      <View>
        <View style={styles.row1}>
          {/* pick citizen image to scan */}
          <View style={styles.image}>
            <MyIcon
              icon={AppIcon.icon_image}
              size="50"
              onPress={pickImage}
            />
          </View>
        </View>

        {/* hint*/}
        <Text style={styles.hint}>
          Hãy tải minh chứng Căn cước công dân
        </Text>
      </View>

      {/* view name after pick citizen's id*/}
      <View style={styles.input}>
        <InputRegister
          label="Họ và tên"
          value={name}
          required={false}
          onChangeText={() => {}}
          placeholder="Họ và tên"
          type="phone"
          iconName="phone"
          editable={false}
        />
      </View>

      {/* view day of birth after pick email's id*/}
      <View style={styles.input}>
        <InputRegister
          label="Ngày tháng năm sinh"
          value={dayOfBirth}
          required={false}
          onChangeText={() => {}}
          placeholder="Ngày tháng năm sinh"
          type="text"
          iconName="email"
          editable={false}
        />
      </View>

      {/* view gender after pick citizen's id*/}
      <View style={styles.input}>
        <InputRegister
          label="Giới tính"
          value={gender}
          required={false}
          onChangeText={() => {}}
          placeholder="Giới tính"
          type="text"
          iconName="password"
          editable={false}
        />
      </View>

      {/* view address after pick citizen's id*/}
      <View style={styles.input}>
        <InputRegister
          label="Quê quán"
          value={address}
          required={false}
          onChangeText={() => {}}
          placeholder="Quê quán"
          editable={false}
          type="text"
          iconName="password"
        />
      </View>

      {/*avatar picker*/}
      <View>
        <Image
          style={styles.img}
          source={require("../../../assets/avatar/avatarTempt.png")}
        />
        <Text style={styles.textTaiAnh}>Hãy tải ảnh đại diện của bạn</Text>
      </View>

      {/*submit button*/}
      <View style={styles.button}>
        {/* submit button */}
        <Button
          title="Đăng nhập"
          textColor="white"
          backgroundColor={BackgroundColor.primary}
          onPress={onRegister}
        />

        {/* hint text */}
        <Text style={styles.link} onPress={goToLogin}>
          Bạn da có tài khoản? Hãy đăng nhap
        </Text>
      </View>

      <View style={{height: 50}} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },

  icon: {
    marginTop: "5%",
    marginLeft: "5%",
  },

  iconInput: {
    left: 10,
    top: 25,
    justifyContent: "center",
  },

  input: {
    top: "0%",
    height: 20,
    width: "90%",
    marginBottom: "17%",
    alignSelf: "center",
  },

  img: {
    width: 150,
    height: 150,
    marginTop: 50,
    borderRadius: 100,
    alignSelf: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: "5%",
  },

  content: {
    fontSize: 14,
    marginBottom: "20%",
  },

  test: {
    top: -10,
  },

  text: {
    top: 5,
    left: 90,
    marginBottom: "-15%",
  },

  link: {
    color: TextColor.sub_primary,
  },

  button: {
    marginTop: "10%",
    alignItems: "center",
  },

  row1: {
    flexDirection: "row", // Đặt các biểu tượng nằm trên cùng một hàng
    justifyContent: "center", // Cân đối khoảng cách giữa các biểu tượng
    marginBottom: 20, // Thêm khoảng cách dưới hàng icon
  },

  image: {
    marginHorizontal: 20,
    marginBottom: 10,
  },

  row: {
    // Đặt các biểu tượng nằm trên cùng một hàng
    marginLeft: "5%", // Cân đối khoảng cách giữa các biểu tượng
    marginBottom: " -12%", // Thêm khoảng cách dưới hàng icon
    justifyContent: "space-evenly",
  },

  textTaiAnh: {
    marginTop: 20,
    alignSelf: "center",
  },

  hint: {
    marginTop: "-10%",
    alignSelf: "center",
    marginBottom: "5%",
  },
});
