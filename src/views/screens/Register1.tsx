import {ScrollView, Text, View, StyleSheet, Image} from "react-native";
import MyIcon, {AppIcon} from "../components/MyIcon";
import InputRegister from "../components/Inputs/InputRegister";
import Button from "../components/Button";
import {useCallback, useContext, useState} from "react";
import {NavigationContext} from "@react-navigation/native";
import ScreenName from "../../constants/ScreenName";
import MyText from "../components/MyText";
import Ionicons from "@expo/vector-icons/Ionicons";
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";

export default function RegisterStep1Screen() {
  //contexts, refs
  const navigation = useContext(NavigationContext);

  //states
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // kiem tra du lieu khi nhan nut tiep tuc
  const handleNext = useCallback(() => {
    if (password.length < 6 || password.length > 24) {
      setErrorMessage("Mật khẩu phải từ 6 đến 24 ký tự!!!");
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp!");
      return false;
    }

    if (phone && email && password) {
      setErrorMessage("");
      return true;
    } else {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin");
      return false;
    }
  }, [password, email, confirmPassword, phone]);

  //handlers
  const handleForward = useCallback(() => {
    if (handleNext()) {
      navigation?.navigate(ScreenName.REGISTER_STEP_2);
    }
  }, [handleNext]);

  const goToLogin = useCallback(() => {
    navigation?.goBack();
    navigation?.navigate(ScreenName.LOGIN);
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* illustration image*/}
        <Image
          style={styles.img}
          source={require("../../../assets/images/illustrations/login.png")}
        />

        {/* screen title */}
        <View style={styles.row}>
          <View>
            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.content}>
              Hãy cho chúng tôi biết thêm thông tin về bạn
            </Text>
          </View>
        </View>

        {/* phone numver */}
        <View style={styles.input}>
          <InputRegister
            label="Số điện thoại"
            required={true}
            onChangeText={setPhone}
            value={phone}
            placeholder="Số điện thoại"
            type="phone"
            iconName="phone"
          />
        </View>

        {/* email */}
        <View style={styles.input}>
          <InputRegister
            label="Email"
            required={true}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            type="email"
            iconName="email"
          />
        </View>

        {/*password*/}
        <View style={styles.input}>
          <InputRegister
            label="Mật khẩu"
            required={true}
            onChangeText={setPassword}
            value={password}
            placeholder="Nhập mật khẩu của bạn"
            type="password"
            iconName="password"
          />
        </View>

        {/*confirm password */}
        <View style={styles.input}>
          <InputRegister
            label="Xác nhận lại mật khẩu của bạn"
            required={true}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            placeholder="Xác nhận lại mật khẩu của bạn"
            type="password"
            iconName="password"
          />
        </View>

        {errorMessage ? (
          <Text style={{color: "red"}}>{errorMessage}</Text>
        ) : null}
        <>
          {/* submit button */}
          <Button
            title="Tiep tuc"
            textColor="white"
            backgroundColor={BackgroundColor.primary}
            onPress={handleForward}
          />

          {/* hint text */}
          <Text style={styles.link} onPress={goToLogin}>
            Bạn da có tài khoản? Hãy đăng nhap
          </Text>
        </>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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
    width: 200,
    height: 200,
    marginTop: 40,
    alignSelf: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: "-6%",
  },

  content: {
    fontSize: 14,
    marginBottom: "20%",
  },

  test: {
    marginTop: -20,
  },

  text: {
    top: -25,
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

  row: {
    marginLeft: "5%", // Cân đối khoảng cách giữa các biểu tượng
    marginBottom: " -12%", // Thêm khoảng cách dưới hàng icon
  },

  lastText: {
    flexDirection: "row",
  },
});
