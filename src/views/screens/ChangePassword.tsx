import {ScrollView, Text, View, StyleSheet, Image} from "react-native";
import MyIcon, {AppIcon} from "../components/MyIcon";
import InputRegister from "../components/Inputs/InputRegister";
import MyText from "../components/MyText";
import Button from "../components/Button";
import {useCallback, useContext, useState} from "react";
import {NavigationContext} from "@react-navigation/native";
import ScreenName from "../../constants/ScreenName";

export default function ChangePasswordScreen() {
  //contexts
  const navigation = useContext(NavigationContext);

  //states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //handlers
  const goBack = useCallback(() => {
    navigation?.goBack();
  }, []);

  const handleSubmit = useCallback(() => {
    alert("call api to change password");

    navigation?.goBack();
    navigation?.navigate(ScreenName.LOGIN);
  }, []);

  return (
    <View style={styles.container}>
      {/* babk button*/}
      <View style={styles.icon}>
        <MyIcon icon={AppIcon.back_button} onPress={goBack}/>
      </View>

      {/* screen title */}
      <View style={styles.row}>
        <View>
          <Text style={styles.title}> Đổi mật khẩu</Text>
          <Text style={styles.content}>Hãy ghi nhớ mật khẩu của bạn</Text>
        </View>
      </View>

      {/* current password*/}
      <View style={styles.input}>
        <InputRegister
          label="Mật khẩu hiện tại của bạn"
          required={true}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Mật khẩu hiện tại của bạn"
          type="password"
          iconName="password"
        />
      </View>

      {/* new password*/}
      <View style={styles.input}>
        <InputRegister
          label="Mật khẩu mới của bạn"
          required={true}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Mật khẩu mới của bạn"
          type="password"
          iconName="password"
        />
      </View>

      {/* confirm password*/}
      <View style={styles.input}>
        <InputRegister
          label="Xác nhận mật khẩu mới của bạn"
          required={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Xác nhận mật khẩu mới của bạn"
          type="password"
          iconName="password"
        />
      </View>

      {/* password requirement*/}
      <View style={styles.row1}>
        <Text></Text>
        <View style={styles.testQuenMatKhau}>
          <Text>Mật khẩu phải từ 6 đến 24 kí tự</Text>
        </View>
      </View>

      {/* submit button*/}
      <View style={styles.btn}>
        <Button title="Xác nhận" textColor="white" backgroundColor="#0D99FF" onPress={handleSubmit}/>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  icon: {
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
    fontWeight: 'bold',
  },

  content: {
    fontSize: 14,
    marginBottom: "20%",
  },

  test: {
    top: -10,
  },

  testQuenMatKhau: {
    top: -10,
    left: 80,
    marginBottom: "20%",
  },

  row1: {
    flexDirection: "row", // Đặt các biểu tượng nằm trên cùng một hàng
    justifyContent: "space-evenly", // Cân đối khoảng cách giữa các biểu tượng
    marginBottom: 20, // Thêm khoảng cách dưới hàng icon
  },

  row: {
    // Đặt các biểu tượng nằm trên cùng một hàng
    marginLeft: '-40%', // Cân đối khoảng cách giữa các biểu tượng
    marginBottom: ' -12%', // Thêm khoảng cách dưới hàng icon
  },

  btn: {
    marginTop: '40%',
    width: '100%',
  }
});
