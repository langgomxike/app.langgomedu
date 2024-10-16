import React, { useState, useRef } from "react";
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

export default function OTPScreen() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  // Tạo ref cho từng ô nhập OTP
  const otpInputs = useRef<TextInput[]>([]);

  const handleChangeText = (text: string, index: number) => {
    const newOtp = [...otp];

    // Kiểm tra nếu ô đầu tiên rỗng và người dùng bắt đầu nhập ở ô khác
    if (!otp[0] && index > 0) {
      otpInputs.current[0].focus(); // Chuyển focus về ô đầu tiên
      return;
    }

    newOtp[index] = text;

    // Tự động chuyển đến ô tiếp theo khi người dùng nhập
    if (text && index < 5) {
      otpInputs.current[index + 1].focus(); // Chuyển sang ô tiếp theo
    }

    setOtp(newOtp);
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
        <MyIcon icon={AppIcon.ic_back_circle} />
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
