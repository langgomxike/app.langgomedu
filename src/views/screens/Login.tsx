import { ScrollView, Text, View, StyleSheet, Image, Alert } from "react-native";
import MyIcon, { AppIcon } from "../components/MyIcon";
import axios from 'axios';
import InputRegister from '../components/Inputs/InputRegister';
import MyText from "../components/MyText";
import Button from "../components/Button";
import { useCallback, useState,useContext } from "react";
import { NavigationContext } from "@react-navigation/native";
import ScreenName from "../../constants/ScreenName";

export default function LoginScreen() {

  const navigation = useContext(NavigationContext);
 
  function goToRegisterScreen(): void {
    navigation?.navigate(ScreenName.REGISTER1);
  }
  function goToOTPScreen():void {
    navigation?.navigate(ScreenName.OTP);
  }
  function goHomeScreen():void {
    navigation?.navigate(ScreenName.HOME);
  }
  function handleInputChange(value: string): void {
    console.log(value);
  }
  function emty() {
    alert('ban da nhay');
  }
  function goBack()
  {
    navigation?.goBack();
  }
 // State để lưu giá trị input
 const [emailOrPhone, setEmailOrPhone] = useState("");
 const [password, setPassword] = useState("");
  // Hàm xử lý thay đổi input
  function handleInputChangeEmailOrPhone(value: string): void {
    setEmailOrPhone(value); // Lưu giá trị của email hoặc số điện thoại vào state
  }

  function handleInputChangePassword(value: string): void {
    setPassword(value); // Lưu giá trị của mật khẩu vào state
  }

  // Hàm xử lý sự kiện khi nhấn nút Đăng nhập
  async function handleLogin() {
    // Kiểm tra xem các trường input có được điền đầy đủ không
    if (!emailOrPhone || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    // Kiểm tra định dạng email hoặc số điện thoại
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!emailRegex.test(emailOrPhone) && !phoneRegex.test(emailOrPhone)) {
      Alert.alert('Lỗi', 'Vui lòng nhập email hoặc số điện thoại hợp lệ!');
      return;
    }

    try {
      // Gửi yêu cầu đăng nhập tới server
      const response = await axios.post('10.0.2.2/login', {
        phoneOrEmail: emailOrPhone,
        password: password,
      });

      // Kiểm tra kết quả trả về từ server
      if (response.status === 200) {
        console.log('Đăng nhập thành công!', response.data);
        // Điều hướng tới màn hình home nếu đăng nhập thành công
        goHomeScreen();
      } else {
        Alert.alert('Lỗi', 'Thông tin đăng nhập không chính xác!');
      }
    } catch (error) {
      console.error('Đã có lỗi xảy ra:', error);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra trong quá trình đăng nhập!');
    }
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
      <View></View>
      </View>
      <View style={styles.input}>
          <InputRegister
            label="Email hoặc số điện thoại"
            required={true}
            onChangeText={handleInputChangeEmailOrPhone} // Hàm cập nhật state khi nhập
            placeholder="Email hoặc số điện thoại"
            type="phone"
            iconName="phone"
          />
        </View>
      <View style={styles.input}>
        <InputRegister
          label="Mật khẩu của bạn"
          required={true}
          onChangeText={handleInputChange}
          placeholder="Mật khẩu của bạn"
          type="password"
          iconName="password"
        ></InputRegister>
      </View>
      <View style={styles.row1}>
        <Text></Text>
        <View style={styles.testQuenMatKhau}>
        <MyText text='Bạn quên mật khẩu?' onPress={goToOTPScreen}></MyText>
        </View>
      </View>
      <Button title="Đăng nhập" textColor="white" backgroundColor="blue" onPress={emty}></Button>
      <View style={styles.lastText}>
  
      <Text>Bạn chưa có tài khoản? </Text>
      <MyText text='Hãy đăng ký' onPress={goToRegisterScreen}></MyText>
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
    // height: 50,
    // backgroundColor: "green",
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
    flexDirection: "row", // Đặt các biểu tượng nằm trên cùng một hàng
    justifyContent: "space-evenly", // Cân đối khoảng cách giữa các biểu tượng
    marginBottom: 20, // Thêm khoảng cách dưới hàng icon
  },
  row: {
    // Đặt các biểu tượng nằm trên cùng một hàng
    marginLeft: "-40%", // Cân đối khoảng cách giữa các biểu tượng
    marginBottom: " -12%", // Thêm khoảng cách dưới hàng icon
  },
  lastText:{
    flexDirection: 'row',
  }
});
