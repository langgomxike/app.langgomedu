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
      <Text style={styles.title}>Thay đổi mật khẩu</Text>
      <Text style={styles.content}>Mật khẩu phải tối thiểu 6 kí tự</Text>
      <View style={styles.test}>
        <View style={styles.input}>
          <InputRegister
            label="Nhập mật khẩu hiện tại"
            required={true}
            placeholder="Nhập mật khẩu hiện tại"
            type="password"
            iconName="password"
            onChangeText={myEmptyFunction}
          />
        </View>
        <View style={styles.input}>
          <InputRegister
            label="Nhập mật khẩu mới"
            required={true}
            placeholder="Nhập mật khẩu mới"
            type="password"
            iconName="password"
            onChangeText={myEmptyFunction}
          />
        </View>
        <View style={styles.input}>
          <InputRegister
            label="Xác nhận lại mật khẩu"
            required={true}
            placeholder="Xác nhận lại mật khẩu"
            type="password"
            iconName="password"
            onChangeText={myEmptyFunction}
          />
        </View>
      </View>

      <View style={styles.button}>
        <Button
          title="Xác nhận thay đổi"
          textColor="white"
          backgroundColor="blue"
          onPress={myEmptyFunction}
        />
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
    top: 30,
    left: '-45%',
  },

  input: {
    marginBottom: "7%",
    width: 380,
  },
  img: {
    top: -10,
    width: 200,
    height: 200,
    alignItems: "center",
  },
  title: {
    marginTop: "10%",
    fontSize: 20,
    left: "-25%",
    fontWeight: "bold",
  },
  content: {
    fontSize: 14,
    marginBottom: 40,
    left: "-22%",
  },
  test: {
    // height: 50,
    // backgroundColor: "green",
  },
  luuy: {
    top: -10,
    left: 50,
  },
  button: {
    top: "35%",
    alignItems: "center",
  },
  dangky: {
    top: 120,
  },
});
