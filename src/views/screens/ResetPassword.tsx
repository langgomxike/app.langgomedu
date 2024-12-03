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
import Toast from "react-native-simple-toast";

export default function ResetPasswordScreen() {
  //contexts
  const navigation = useContext(NavigationContext);
  const languageContext = useContext(LanguageContext);
  const authContext = useContext(AuthContext);

  //states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //handlers
  const goBack = useCallback(() => {
    navigation?.goBack();
  }, []);

  const handleSubmit = useCallback((otp: number, onComplete: () => void) => {
    AUser.resetPassword(phoneNumber, newPassword, otp,
      (result) => {
        if (result) {
          Toast.show(languageContext.language.PASSWORD_RESET_ALREADY, 1000);
          navigation?.reset({
            index: 0,
            routes: [{name: ScreenName.LOGIN}],
          });
        } else {
          Alert.alert(languageContext.language.RESET_PASSWORD, languageContext.language.INVALID_RESET_PASSWORD);
        }
      },
      onComplete
    );
  }, [newPassword, phoneNumber, authContext.onAfterAuth]);

  const handleAuth = useCallback(() => {
    if (!phoneNumber) {
      Alert.alert(languageContext.language.PHONE_NUMBER, languageContext.language.INVALID_PHONE_NUMBER);
      return;
    }

    if (!newPassword) {
      Alert.alert(languageContext.language.NEW_PASSWORD, languageContext.language.INVALID_PASSWORD);
      return;
    }

    if (!confirmPassword || newPassword !== confirmPassword) {
      Alert.alert(languageContext.language.CONFIRM_PASSWORD, languageContext.language.INVALID_CONFIRM_PASSWORD);
      return;
    }

    const data: OTPNavigationType = {
      phone_number:phoneNumber,
    }
    navigation?.navigate(ScreenName.OTP, data);

    authContext.setOnAfterAuth(() => handleSubmit);
  }, [handleSubmit, newPassword, confirmPassword, phoneNumber]);

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
        <Text style={styles.title}>{languageContext.language.RESET_PASSWORD}</Text>
        <Text style={styles.content}>{languageContext.language.RESET_PASSWORD_HINT}</Text>
      </View>

      {/* current password*/}
      <View style={styles.input}>
        <InputRegister
          label={languageContext.language.PHONE_NUMBER}
          required={true}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder={languageContext.language.PHONE_NUMBER}
          type="phone"
          iconName="phone"
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
        <Button title={languageContext.language.RESET_PASSWORD} textColor={TextColor.white}
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
