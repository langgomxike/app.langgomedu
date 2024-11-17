import React, { useState, useRef, useCallback, useContext } from "react";
import { View, Text, StyleSheet, TextInput, Alert, Image } from "react-native";
import { NavigationContext } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Button from "../components/Button";
import { BackgroundColor } from "../../configs/ColorConfig";

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

  const handleChangeText = useCallback((text: string, index: number) => {
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
  }, [otp, otpInputs]);

  const handleVerifyOtp = useCallback(() => {
    const validOtp = "123456"; // Thay thế bằng OTP thực tế của bạn
    if (otp.join("") === validOtp) {
      Alert.alert("Xác Nhận Thành Công", "OTP hợp lệ!");
      // Chuyển hướng đến màn hình tiếp theo (Home, Dashboard, v.v.)
    } else {
      Alert.alert("Lỗi", "OTP không hợp lệ. Vui lòng thử lại.");
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* back button*/}
      <Ionicons
        name="close"
        size={30}
        style={styles.backButton}
        onPress={goBack}
      />

      {/* illustration image*/}
      <Image
        style={styles.img}
        source={require("../../../assets/images/ illustration/Mobile login-rafiki.png")}
      />

      {/* screen title */}
      <Text style={styles.title}>Xác Thực OTP</Text>

      <Text style={styles.instructions}>
        Nhập mã OTP đã gửi đến điện thoại của bạn
      </Text>

      {/* inputs */}
      <View style={styles.otpContainer}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            ref={(input) => (otpInputs.current[index] = input!)} // Lưu ref vào mảng
            style={styles.otpInput}
            keyboardType="numeric"
            value={value}
            onChangeText={(text) => handleChangeText(text, index)}
            maxLength={1} // Chỉ cho phép 1 ký tự
          />
        ))}
      </View>

      {/* submit button */}
      <Button
        title="Xác thực"
        textColor="white"
        backgroundColor={
          otp.join("").length == 6
            ? BackgroundColor.primary
            : BackgroundColor.sub_primary
        }
        onPress={otp.join("").length == 6 ? handleVerifyOtp : () => {}}
      />
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

  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
  },

  img: {
    width: 200,
    height: 200,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 5,
  },

  instructions: {
    fontSize: 16,
    marginVertical: 15,
    textAlign: "center",
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    marginBottom: 40,
  },

  otpInput: {
    borderWidth: 1,
    borderColor: BackgroundColor.sub_primary,
    borderRadius: 5,
    padding: 10,
    textAlign: "center",
    fontSize: 20,
    width: 45,
    height: 60,
  },
});
