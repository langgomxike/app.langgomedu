import React, { useState, useRef, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Image,
} from "react-native";
import MyIcon, { AppIcon } from "../components/MyIcon";
import { NavigationContext } from "@react-navigation/native";

export default function OTPScreen() {
  //context
  const navigation = useContext(NavigationContext);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  // Tạo ref cho từng ô nhập OTP
  const otpInputs = useRef<TextInput[]>([]);

  //handlers
  const goBack = useCallback(() => {
    navigation?.goBack();
  }, []);

  const handleChangeText = (text: string, index: number) => {
    const newOtp = [...otp];

    // Nếu ô đầu tiên chưa được nhập thì focus vào ô đầu tiên
    if (otp[0] === "" && index !== 0) {
      otpInputs.current[0]?.focus();
      return;
    }

    // Không cho phép nhập vào ô sau khi các ô trước đó chưa điền
    for (let i = 1; i <= index; i++) {
      if (newOtp[i - 1] === "") {
        otpInputs.current[i - 1]?.focus();
        return;
      }
    }
    newOtp[index] = text;
    setOtp(newOtp);

    // Tự động chuyển sang ô tiếp theo nếu có số được nhập
    if (index < 5 && text) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  // Xử lý khi nhấn nút xóa
  const handleKeyPress = (e: any, index: number) => {
    const newOtp = [...otp];

    // Nếu ô hiện tại trống và người dùng nhấn Backspace
    if (e.nativeEvent.key === "Backspace") {
      if (newOtp[index] === "" && index > 0) {
        // Xóa giá trị của ô trước đó
        newOtp[index - 1] = "";
        setOtp(newOtp);

        // Focus về ô trước
        otpInputs.current[index - 1]?.focus();
      } else {
        // Xóa giá trị của ô hiện tại
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleVerifyOtp = () => {
    const validOtp = "123456"; // Thay thế bằng OTP thực tế của bạn
    if (otp.join("") === validOtp) {
      Alert.alert("Xác Nhận Thành Công", "OTP hợp lệ!");
      // Chuyển hướng đến màn hình tiếp theo (Home, Dashboard, v.v.)
    } else {
      Alert.alert("Lỗi", "OTP không hợp lệ. Vui lòng thử lại.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.ic}>
        <MyIcon onPress={goBack} icon={AppIcon.ic_back_circle} />
      </View>

      <Text style={styles.title}>Xác Nhận OTP</Text>
      <Image
        style={styles.img}
        source={require("../../../assets/images/ illustration/Mobile login-rafiki.png")}
      />
      <Text style={styles.instructions}>
        Nhập mã OTP đã gửi đến điện thoại của bạn
      </Text>
      <View style={styles.otpContainer}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            ref={(input) => (otpInputs.current[index] = input!)} // Lưu ref vào mảng
            style={styles.input}
            placeholder="0"
            keyboardType="numeric"
            value={value}
            onChangeText={(text) => handleChangeText(text, index)}
            maxLength={1} // Chỉ cho phép 1 ký tự
          />
        ))}
      </View>
      <Button title="Xác Nhận" onPress={handleVerifyOtp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  img: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  input: {
    width: 50,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    textAlign: "center",
    fontSize: 20,
  },
  ic: {
    marginTop: "-90%",
    marginLeft: "-90%",
  },
});
