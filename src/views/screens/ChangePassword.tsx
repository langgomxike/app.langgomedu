import {ScrollView, Text, View, StyleSheet, Image, Alert} from "react-native";
import MyIcon, {AppIcon} from "../components/MyIcon";
import InputRegister from "../components/Inputs/InputRegister";
import MyText from "../components/MyText";
import Button from "../components/Button";
import React, {useCallback, useContext, useState} from "react";
import {NavigationContext} from "@react-navigation/native";
import ScreenName from "../../constants/ScreenName";
import {LanguageContext} from "../../configs/LanguageConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import AUser from "../../apis/AUser";
import SAsyncStorage, {AsyncStorageKeys} from "../../services/SAsyncStorage";
import {AuthType, IdNavigationType, OTPNavigationType} from "../../configs/NavigationRouteTypeConfig";
import Spinner from "react-native-loading-spinner-overlay";
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";
import {AuthContext} from "../../configs/AuthContext";
import {AccountContext} from "../../configs/AccountConfig";

export default function ChangePasswordScreen() {
  //contexts
  const navigation = useContext(NavigationContext);
  const languageContext = useContext(LanguageContext);
  const authContext = useContext(AuthContext);
  const accountContext = useContext(AccountContext);

  //states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //handlers
  const goBack = useCallback(() => {
    navigation?.goBack();
  }, []);

  const handleSubmit = useCallback((otp: number, onComplete: () => void) => {
    AUser.changePassword(accountContext.account?.id ?? "-1", accountContext.account?.phone_number ?? "-1", newPassword, otp,
      (result) => {
        if (result) {
          navigation?.reset({
            index: 0,
            routes: [{name: ScreenName.LOGIN}],
          });
        } else {
          Alert.alert(languageContext.language.CHANGE_PASSWORD, languageContext.language.INVALID_CHANGE_PASSWORD);
        }
      },
      onComplete
    );
  }, [newPassword, authContext.onAfterAuth, accountContext.account]);

  const handleAuth = useCallback(() => {

    // kiểm tra mật khẩu
    const passwordRegex = /^.{6,20}$/;
    if (!currentPassword || !passwordRegex.test(currentPassword)) {
      Alert.alert(languageContext.language.OLD_PASSWORD, languageContext.language.INVALID_PASSWORD);
      return;
    }

    if (!newPassword || !passwordRegex.test(newPassword) || newPassword === currentPassword) {
      Alert.alert(
        languageContext.language.NEW_PASSWORD,
        newPassword === currentPassword
          ? languageContext.language.NEW_PASSWORD_MUST_BE_DIFFERENT
          : languageContext.language.PASSWORD_INVALID_FORMAT
      );
      return;
    }

    if (!confirmPassword || newPassword !== confirmPassword) {
      Alert.alert(languageContext.language.CONFIRM_PASSWORD, languageContext.language.INVALID_CONFIRM_PASSWORD);
      return;
    }

    const data: OTPNavigationType = {
      phone_number: accountContext.account?.phone_number?? "",
    }
    navigation?.navigate(ScreenName.OTP, data);

    authContext.setOnAfterAuth(() => handleSubmit);
  }, [handleSubmit, newPassword, confirmPassword, currentPassword, accountContext.account]);

  return (
    <View style={styles.container}>
      {/* back button*/}
      <Ionicons
        name="close"
        size={30}
        style={styles.backButton}
        onPress={goBack}
      />

      <View style={{height: 100}}/>

      {/* screen title */}
      <View>
        <Text style={styles.title}>{languageContext.language.CHANGE_PASSWORD}</Text>
        <Text style={styles.content}>{languageContext.language.CHANGE_PASSWORD_HINT}</Text>
      </View>

      {/* current password*/}
      <View style={styles.input}>
        <InputRegister
          label={languageContext.language.OLD_PASSWORD}
          required={true}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder={languageContext.language.OLD_PASSWORD}
          type="password"
          iconName="password"
        />
      </View>

      {/* new password*/}
      <View style={styles.input}>
        <InputRegister
          label={languageContext.language.NEW_PASSWORD}
          required={true}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder={languageContext.language.NEW_PASSWORD}
          type="password"
          iconName="password"
        />
      </View>

      {/* confirm password*/}
      <View style={styles.input}>
        <InputRegister
          label={languageContext.language.CONFIRM_PASSWORD}
          required={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={languageContext.language.CONFIRM_PASSWORD}
          type="password"
          iconName="password"
        />
      </View>

      {/* submit button*/}
      <View style={styles.btn}>
        <Button title={languageContext.language.CHANGE_PASSWORD} textColor={TextColor.white}
                backgroundColor={BackgroundColor.primary} onPress={handleAuth}/>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
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
