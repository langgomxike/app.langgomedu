import { ScrollView, Text, View, StyleSheet, Image, Alert } from "react-native";
import MyIcon, { AppIcon } from "../../components/MyIcon";
import InputRegister from "../../components/Inputs/InputRegister";
import Button from "../../components/Button";
import { useCallback, useContext, useState } from "react";
import { NavigationContext } from "@react-navigation/native";
import ScreenName from "../../../constants/ScreenName";
import MyText from "../../components/MyText";
import AUser from "../../../apis/AUser";
export default function CreateAccountAdmin() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // state để quản lý loading

  const navigation = useContext(NavigationContext);

  const handleNext = () => {
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
      // gọi hàm registerAdmin khi thông tin hợp lệ
      AUser.registerAdmin(phone, email, password, handleResponse, setLoading);
      return true;
    } else {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin");
      return false;
    }
  };

  // Hàm xử lý phản hồi từ API
  const handleResponse = (response: any) => {
    if (response.success) {
       Alert.alert("Thông báo", "Tạo tài khoản admin thành công", [
        {
          text: "OK",
          onPress: () => goBack(),
        },
      ]);
    } else {
      setErrorMessage(response.message || "Đã có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const goBack = () => {
    navigation?.goBack();
  };

  const goHome = () => {
    navigation?.navigate(ScreenName.HOME);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.icon}>
          <MyIcon icon={AppIcon.ic_back_circle} onPress={goBack} />
        </View>

        <Image
          style={styles.img}
          source={require('../../../../assets/images/illustrations/login.png')}
        />

        <View style={styles.row}>
          <View style={styles.slogan}>
            <Text style={styles.title}>Tạo tài khoản Admin</Text>
            <Text style={styles.content}>
              Hãy cho chúng tôi biết thêm thông tin về admin
            </Text>
          </View>
        </View>

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

        <View style={styles.row1}>
          <Text></Text>
          <View style={styles.text}>
            <Text>Mật khẩu phải từ 6 đến 24 kí tự</Text>
          </View>
        </View>

        {errorMessage ? (
          <Text style={{ color: "red" }}>{errorMessage}</Text>
        ) : null}

        <View style={styles.button}>
          <Button
            title={loading ? "Đang tạo tài khoản..." : "Đăng Ký"}
            textColor="white"
            backgroundColor="blue"
            onPress={handleNext}
          
          />
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
  },
  icon: {
    marginTop: "5%",
    marginLeft: "-80%",
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
    marginBottom: "12%",
    alignSelf: "center",
  },

  img: {
    width: 200,
    height: 200,
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
    // height: 50,
    // backgroundColor: "green",
  },
  text: {
    top: -25,
    left: 90,
    marginBottom: "-15%",
    
  },
  button: {
    marginTop: "10%",
    width:"100%",
    alignSelf: "center",
  },
  dangky: {},
  row1: {
    flexDirection: "row", // Đặt các biểu tượng nằm trên cùng một hàng
    justifyContent: "center", // Cân đối khoảng cách giữa các biểu tượng
    marginBottom: 20, // Thêm khoảng cách dưới hàng icon
  },
  row: {
    // Đặt các biểu tượng nằm trên cùng một hàng
    marginLeft: "5%", // Cân đối khoảng cách giữa các biểu tượng
    marginBottom: " -12%", // Thêm khoảng cách dưới hàng icon
  },
  lastText: {
    flexDirection: "row",
  },
  slogan:{
    marginLeft: "-25%",
    
  }
});
