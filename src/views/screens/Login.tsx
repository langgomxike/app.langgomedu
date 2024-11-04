import { ScrollView, Text, View, StyleSheet, Image, Alert } from "react-native";
import MyIcon, { AppIcon } from "../components/MyIcon";
import axios from "axios";
import InputRegister from "../components/Inputs/InputRegister";
import Button from "../components/Button";
import { useCallback, useState, useContext } from "react";
import { NavigationContext } from "@react-navigation/native";
import ScreenName from "../../constants/ScreenName";
import AUser from "../../apis/AUser";
import { AccountContext } from "./../../configs/AccountConfig";

export default function DuTestScreen() {
  //contexts
  const navigation = useContext(NavigationContext);
  const accountContext = useContext(AccountContext);

  //states
  const [emailOrPhoneNumber, setEmailOrPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  //handlers
  const handleForgettingPassword = useCallback(() => {
    navigation?.goBack();
    navigation?.navigate(ScreenName.OTP);
  }, []);

  const goBack = useCallback(() => {
    navigation?.goBack();
  }, []);

  const goToRegister = useCallback(() => {
    navigation?.goBack();
    navigation?.navigate(ScreenName.REGISTER_1);
  }, []);

  const handleLogin = useCallback(() => {
    //validate
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        emailOrPhoneNumber
      ) &&
      !/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(
        emailOrPhoneNumber
      )
    ) {
      alert(
        "Email hoặc số điện thoại không đúng định dạng.\nVui lòng thử lại."
      );
      return;
    }

    if (!/(?=^.{6,}$)(?=.*[0-9])(?=.*[A-Z]).*/.test(password)) {
      alert(
        "Mật khẩu không đúng định dạng:\n\t\t- Từ 6 đến 25 kí tự \n\t\t- Chứa ít nhất 1 số\nVui lòng thử lại."
      );
      return;
    }

    const email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      emailOrPhoneNumber
    )
      ? emailOrPhoneNumber
      : "";

    const phoneNumber =
      /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(
        emailOrPhoneNumber
      )
        ? emailOrPhoneNumber
        : "";

    AUser.login(email, phoneNumber, password, (user) => {
      if (!user) {
        alert("Đăng nhập thất bại");
        return;
      }

      accountContext.setAccount && accountContext.setAccount(user);

      navigation?.goBack();
      navigation?.navigate(ScreenName.HOME);
    });
  }, [emailOrPhoneNumber, password, accountContext.account]);

  // State để lưu giá trị input
  const [emailOrPhone, setEmailOrPhone] = useState("");

  // Hàm xử lý thay đổi input
  function handleInputChangeEmailOrPhone(value: string): void {
    setEmailOrPhone(value); // Lưu giá trị của email hoặc số điện thoại vào state
  }

  function handleInputChangePassword(value: string): void {
    setPassword(value); // Lưu giá trị của mật khẩu vào state
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image
          style={styles.img}
          source={require("../../../assets/images/ illustration/Mobile login-rafiki.png")}
        ></Image>
        <View style={styles.row}>
          <View>
            <Text style={styles.title}> Đăng nhập</Text>
            <Text style={styles.content}>Hãy nhập thông tin để đăng nhập</Text>
          </View>
        </View>
        <View style={styles.input}>
          <InputRegister
            label="Email hoặc số điện thoại"
            required={true}
            placeholder="Emal hoặc số điện thoại"
            type="text"
            onChangeText={handleInputChangeEmailOrPhone} // Hàm cập nhật state khi nhập
            iconName="phone"
            value={emailOrPhoneNumber}
          />
        </View>

        <View style={styles.input}>
          <InputRegister
            label="Mật khẩu của bạn"
            required={true}
            placeholder="Mật khẩu của bạn"
            type="password"
            iconName="password"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.row1}>
          <View style={styles.testQuenMatKhau}>
            <Text onPress={handleForgettingPassword}>Bạn quên mật khẩu?</Text>
          </View>
        </View>

        <Button
          title="Đăng nhập"
          textColor="white"
          backgroundColor="blue"
          onPress={handleLogin}
        ></Button>
        <Text onPress={goToRegister}>Bạn chưa có tài khoản? Hãy đăng ký</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  icon: {
    marginTop: "10%",
    marginLeft: "-90%",
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
    marginBottom: "20%",
  },

  img: {
    top: 30,
    width: 250,
    height: 250,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    fontSize: 14,
    marginBottom: "20%",
  },
  test: {
    top: -10,
  },
  testQuenMatKhau: {
    top: -10,
    left: 100,
    marginBottom: "20%",
  },
  button: {
    marginTop: "10%",
    alignItems: "center",
  },
  dangky: {},
  row1: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  row: {
    marginLeft: "-40%",
    marginBottom: "-12%",
  },
  lastText: {
    flexDirection: "row",
  },
});
