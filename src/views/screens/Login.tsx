import { ScrollView, Text, View, StyleSheet, Image } from "react-native";
import MyIcon, { AppIcon } from "../components/MyIcon";
import InputRegister from '../components/Inputs/InputRegister';
import MyText from "../components/MyText";
import Button from "../components/Button";
export default function DuTestScreen() {
  function myEmptyFunction(): void {
    // Hàm này không làm gì cả
  }
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <MyIcon icon={AppIcon.ic_back_circle} />
      </View>

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
          onChangeText={myEmptyFunction}
          placeholder="Emal hoặc số điện thoại"
          type="phone"
          iconName="phone"
        ></InputRegister>
      </View>
      <View style={styles.input}>
        <InputRegister
          label="Mật khẩu của bạn"
          required={true}
          onChangeText={myEmptyFunction}
          placeholder="Mật khẩu của bạn"
          type="password"
          iconName="password"
        ></InputRegister>
      </View>
      <View style={styles.row1}>
        <Text></Text>
        <View style={styles.testQuenMatKhau}>
        <Text>Bạn quên mật khẩu?</Text>
        </View>
      </View>
      <Button title="Đăng nhập" textColor="white" backgroundColor="blue" onPress={myEmptyFunction}></Button>
      <Text>Bạn chưa có tài khoản? Hãy đăng ký</Text>
    </View>
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
    top: -10,
    width: 250,
    height: 250,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight:'bold',
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
    marginTop: '10%',
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
    marginLeft:'-40%', // Cân đối khoảng cách giữa các biểu tượng
    marginBottom:' -12%', // Thêm khoảng cách dưới hàng icon
  },
});
