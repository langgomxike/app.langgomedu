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
        
          <Text style={styles.title}>Tạo tài khoản</Text>
          <Text style={styles.content}>
            Hãy cho chúng tôi biết thêm thông tin về bạn
          </Text>
          <Text style={styles.content1}>
            Tải hình ảnh hoặc scan căn cước công dân
          </Text>
          <View style={styles.test}>
          <View style={styles.iconRow}>
          <MyIcon icon={AppIcon.ic_camera} />
          <MyIcon icon={AppIcon.ic_camera} />
        </View>
            <View>
              <InputRegister
                style={styles.input}
                label="Nhập mật khẩu hiện tại"
                required={true}
                placeholder="Nhập mật khẩu hiện tại"
                type="password"
                iconName="password"
                onChangeText={myEmptyFunction}
              />
            </View>
            <View>
              <InputRegister
                style={styles.input}
                label="Nhập mật khẩu hiện tại"
                required={true}
                placeholder="Nhập mật khẩu hiện tại"
                type="password"
                iconName="password"
                onChangeText={myEmptyFunction}
              />
            </View>
            <View>
              <InputRegister
                style={styles.input}
                label="Nhập mật khẩu hiện tại"
                required={true}
                placeholder="Nhập mật khẩu hiện tại"
                type="password"
                iconName="password"
                onChangeText={myEmptyFunction}
              />
            </View>
            <View>
              <InputRegister
                style={styles.input}
                label="Nhập mật khẩu hiện tại"
                required={true}
                placeholder="Nhập mật khẩu hiện tại"
                type="password"
                iconName="password"
                onChangeText={myEmptyFunction}
              />
            </View>
          </View>
        </View>
        <Image style={styles.avatar} source={require('../../../assets/avatar/avatarTempt.png')}></Image>
        <Button
              title="Dang nhap"
              textColor="white"
              backgroundColor="blue"
              onPress={myEmptyFunction}
            />
      </View>
    
  );
}
// transform: [{ scale: 2 }],
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    top: 30,
    left: 10,
  },
  input: {
    width: 370,
  },
  img: {
    top: -10,
    width: 200,
    height: 200,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 14,
    marginBottom: 40,
  },
  content1: {
    fontSize: 14,
    marginBottom: 40,
    textAlign:'center',
  },
  test: {
    top: -10,
    // height: 50,
    // backgroundColor: "green",
  },
  luuy: {
    top: -10,
    left: 50,
  },
  button: {
    top: 120,
    alignItems: "center",
  },
  dangky: {
    top: 120,
  },
  avatar:{
    height:200,
    width:200,
    borderRadius:200,

  },
  iconRow: {
    flexDirection: "row", // Đặt các biểu tượng nằm trên cùng một hàng
    justifyContent:'space-around', // Cân đối khoảng cách giữa các biểu tượng
    marginBottom: 20, // Thêm khoảng cách dưới hàng icon
  },
});
