import { ScrollView, Text, View, StyleSheet, Image } from "react-native";
import MyIcon, { AppIcon } from "../components/MyIcon";
import InputRegister from "../components/Inputs/InputRegister";
import MyText from "../components/MyText";
import Button from "../components/Button";
import { useCallback, useContext } from "react";
import { NavigationContext } from "@react-navigation/native";
import ScreenName from "../../constants/ScreenName";
export default function Register2Screen() {
  //contexts
  const navigation = useContext(NavigationContext);

  //handlers
  const goBack = useCallback(() => {
    navigation?.goBack();
    navigation?.navigate(ScreenName.REGISTER_1);
  }, []);

  const onRegister = useCallback(() => {
    navigation?.navigate(ScreenName.HOME);
  }, []);

  function myEmptyFunction(): void {
    // Hàm này không làm gì cả
  }
  // const navigation= useContext(NavigationContext)
  // function goBack(): void {
  //   navigation?.goBack();
  // }
  // function goToLogin(): void {
  //   navigation?.navigate(ScreenName.LOGIN);
  // };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.icon}>
        <MyIcon onPress={goBack} icon={AppIcon.ic_back_circle} />
      </View>
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>Tạo tài khoản</Text>
          <Text style={styles.content}>
            Hãy cho chúng tôi biết thêm thông tin về bạn
          </Text>
        </View>
        <View></View>
      </View>
      <View>
        <View style={styles.row1}>
          <View style={styles.image}>
            <MyIcon
              icon={AppIcon.icon_image}
              size="50"
              onPress={myEmptyFunction}
            ></MyIcon>
          </View>
          <View style={styles.image}>
            <MyIcon
              icon={AppIcon.ic_camera}
              size="50"
              onPress={myEmptyFunction}
            ></MyIcon>
          </View>
        </View>
        <Text style={styles.huongdan}>
          Hãy tải minh chứng Căn cước công dân
        </Text>
      </View>
      <View style={styles.input}>
        <InputRegister
          label="Họ và tên"
          required={false}
          onChangeText={myEmptyFunction}
          placeholder="Họ và tên"
          type="phone"
          iconName="phone"
          editable={false}
        ></InputRegister>
      </View>
      <View style={styles.input}>
        <InputRegister
          label="Ngày tháng năm sinh"
          required={false}
          onChangeText={myEmptyFunction}
          placeholder="Ngày tháng năm sinh"
          type="email"
          iconName="email"
          editable={false}
        ></InputRegister>
      </View>
      <View style={styles.input}>
        <InputRegister
          label="Giới tính"
          required={false}
          onChangeText={myEmptyFunction}
          placeholder="Giới tính"
          type="text"
          iconName="password"
          editable={false}
        ></InputRegister>
      </View>
      <View style={styles.input}>
        <InputRegister
          label="Địa chỉ thường trú"
          required={false}
          onChangeText={myEmptyFunction}
          placeholder="Địa chỉ thường trú"
          editable={false}
          type="text"
          iconName="password"
        ></InputRegister>
      </View>
      <View>
        <Image
          style={styles.img}
          source={require("../../../assets/avatar/avatarTempt.png")}
        ></Image>
        <Text style={styles.textTaiAnh}>Hãy tải ảnh đại diện của bạn</Text>
      </View>
      <View style={styles.button}>
        <Button
          title="Đăng ký"
          textColor="white"
          backgroundColor="blue"
          onPress={onRegister}
        ></Button>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
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
    width: 150,
    height: 150,
    marginTop: 50,
    borderRadius: 100,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: "5%",
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
  text: {
    top: 5,
    left: 90,
    marginBottom: "-15%",
  },
  button: {
    marginTop: "10%",
    alignSelf: "center",
  },
  dangky: {},

  row1: {
    flexDirection: "row", // Đặt các biểu tượng nằm trên cùng một hàng
    justifyContent: "center", // Cân đối khoảng cách giữa các biểu tượng
    marginBottom: 20, // Thêm khoảng cách dưới hàng icon
  },
  image: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  row: {
    // Đặt các biểu tượng nằm trên cùng một hàng
    marginLeft: "5%", // Cân đối khoảng cách giữa các biểu tượng
    marginBottom: " -12%", // Thêm khoảng cách dưới hàng icon
    justifyContent: "space-evenly",
  },
  textTaiAnh: {
    marginTop: 20,
    alignSelf: "center",
  },
  huongdan: {
    marginTop: "-10%",
    alignSelf: "center",
    marginBottom: "5%",
  },
});
