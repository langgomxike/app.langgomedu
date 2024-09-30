import { ScrollView, Text, View, StyleSheet, Image } from "react-native";
import MyIcon, { AppIcon } from "../components/MyIcon";
import InputRegister from "../components/Inputs/InputRegister";
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
      <View style={styles.row}>
        <View>
      <Text style={styles.title}> Đổi mật khẩu</Text>
      <Text style={styles.content}>Hãy ghi nhớ mật khẩu của bạn</Text>
      </View>
      <View></View>
      </View>
     
      <View style={styles.input}>
        <InputRegister
          label="Mật khẩu hiện tại của bạn"
          required={true}
          onChangeText={myEmptyFunction}
          placeholder="Mật khẩu hiện tại của bạn"
          type="password"
          iconName="password"
        ></InputRegister>
      </View>
      <View style={styles.input}>
        <InputRegister
          label="Mật khẩu mới của bạn"
          required={true}
          onChangeText={myEmptyFunction}
          placeholder="Mật khẩu mới của bạn"
          type="password"
          iconName="password"
        ></InputRegister>
      </View>
      <View style={styles.input}>
        <InputRegister
          label="Xác nhận mật khẩu mới của bạn"
          required={true}
          onChangeText={myEmptyFunction}
          placeholder="Xác nhận mật khẩu mới của bạn"
          type="password"
          iconName="password"
        ></InputRegister>
      </View>
      <View style={styles.row1}>
        <Text></Text>
        <View style={styles.testQuenMatKhau}>
        <Text>Mật khẩu phải từ 6 đến 24 kí tự</Text>
        </View>
      </View>
      <View style={styles.btn}>
      <Button  title="Xác nhận" textColor="white" backgroundColor="blue" onPress={myEmptyFunction}></Button>

      </View>
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
    marginTop: "12%",
    marginLeft: "-85%",
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
    left: 80,
    marginBottom: "20%",
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
  btn:{
    marginTop:'30%',

  }
});
