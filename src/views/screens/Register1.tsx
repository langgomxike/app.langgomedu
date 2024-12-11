import {ScrollView, Text, View, StyleSheet, Image, Alert, Pressable} from "react-native";
import MyIcon, { AppIcon } from "../components/MyIcon";
import InputRegister from "../components/Inputs/InputRegister";
import Button from "../components/Button";
import { useCallback, useContext, useState } from "react";
import { NavigationContext } from "@react-navigation/native";
import ScreenName from "../../constants/ScreenName";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";
import { LanguageContext } from "../../configs/LanguageConfig";
import { RegisterType } from "../../configs/NavigationRouteTypeConfig";
import en from "../../../languages/en.json";
import vn from "../../../languages/vn.json";
import ja from "../../../languages/ja.json";

export default function RegisterStep1Screen() {
  //contexts, refs
  const navigation = useContext(NavigationContext);
  const languageContext = useContext(LanguageContext);

  //states
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // kiem tra du lieu khi nhan nut tiep tuc
  const handleNext = useCallback(() => {
    // regex username và password
    const usernameRegex = /^[a-zA-Z0-9_]{6,20}$/;
    const passwordRegex = /^.{6,20}$/;
    const phoneRegex = /^\d{10}$/;

    if (!phone) {
      Alert.alert(
        languageContext.language.PHONE_NUMBER,
        languageContext.language.INVALID_PHONE_NUMBER,
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ]
      );
      return false;
    }

    if (!phoneRegex.test(phone)) {
      Alert.alert(
        languageContext.language.PHONE_NUMBER,
        languageContext.language.INVALID_PHONE_FORMAT, // Hiển thị lỗi định dạng
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ]
      );
      return false;
    }

    if (!username) {
      Alert.alert(
        languageContext.language.USERNAME,
        languageContext.language.INVALID_USERNAME,
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ]
      );
      return false;
    }

    // kiểm tra regex với username nhập vào
    if (!usernameRegex.test(username)) {
      Alert.alert(
        languageContext.language.USERNAME,
        languageContext.language.USERNAME_INVALID_FORMAT,
        [{ text: "OK" }]
      );
      return false;
    }

    if (!password) {
      Alert.alert(
        languageContext.language.PASSWORD,
        languageContext.language.INVALID_PASSWORD,
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ]
      );
      return false;
    }

    // kiểm tra regex với username nhập vào
    if (!passwordRegex.test(password)) {
      Alert.alert(
        languageContext.language.PASSWORD,
        languageContext.language.PASSWORD_INVALID_FORMAT,
        [{ text: "OK" }]
      );
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        languageContext.language.CONFIRM_PASSWORD,
        languageContext.language.INVALID_CONFIRM_PASSWORD,
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ]
      );
      return false;
    }

    return true;
  }, [password, username, confirmPassword, phone]);

  //handlers
  const handleForward = useCallback(() => {
    if (handleNext()) {
      const data: RegisterType = {
        password: password,
        phone_number: phone,
        username: username,
      };
      navigation?.navigate(ScreenName.REGISTER_STEP_2, data);
    }
  }, [handleNext]);

  const goToLogin = useCallback(() => {
    navigation?.goBack();
    navigation?.navigate(ScreenName.LOGIN);
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* illustration image*/}
        <Image
          style={styles.img}
          source={require("../../../assets/images/illustrations/login.png")}
        />

        {/* screen title */}
        <View style={styles.row}>
          <View>
            <Text style={styles.title}>
              {languageContext.language.REGISTER}
            </Text>
            <Text style={styles.content}>
              {languageContext.language.REGISTER_HINT}
            </Text>
          </View>
        </View>

        {/* phone numver */}
        <View style={styles.input}>
          <InputRegister
            label={languageContext.language.PHONE_NUMBER}
            required={true}
            onChangeText={setPhone}
            value={phone}
            placeholder={languageContext.language.PHONE_NUMBER}
            type="phone"
            iconName="phone"
          />
        </View>

        {/* username */}
        <View style={styles.input}>
          <InputRegister
            label={languageContext.language.USERNAME}
            required={true}
            onChangeText={setUsername}
            value={username}
            placeholder={languageContext.language.USERNAME}
            type="text"
            iconName="user"
          />
        </View>

        {/*password*/}
        <View style={styles.input}>
          <InputRegister
            label={languageContext.language.PASSWORD}
            required={true}
            onChangeText={setPassword}
            value={password}
            placeholder={languageContext.language.PASSWORD}
            type="password"
            iconName="password"
          />
        </View>

        {/*confirm password */}
        <View style={styles.input}>
          <InputRegister
            label={languageContext.language.CONFIRM_PASSWORD}
            required={true}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            placeholder={languageContext.language.CONFIRM_PASSWORD}
            type="password"
            iconName="password"
          />
        </View>

        {errorMessage ? (
          <Text style={{ color: "red" }}>{errorMessage}</Text>
        ) : null}
        <>
          {/* submit button */}
          <Button
            title={languageContext.language.REGISTER_STEP_1}
            textColor="white"
            backgroundColor={BackgroundColor.primary}
            onPress={handleForward}
          />

          {/* hint text */}
          <Text style={styles.link} onPress={goToLogin}>
            {languageContext.language.NOT_HAVE_ACCOUNT_YET}
          </Text>
        </>
      </View>

      <View
        style={{
          flexDirection: "row",
          flex: 1,
          gap: 25,
          justifyContent: "center",
          marginVertical: 30,
          alignItems: "center"
        }}>
        <Pressable style={styles.languageItemContainer} onPress={() => languageContext.setLanguage(en)}>
          <Image style={[styles.languageItem, languageContext.language.TYPE === "en" && styles.languageItemActive]}
                 source={require("../../../assets/languages/en.png")}/>
        </Pressable>

        <Pressable style={styles.languageItemContainer} onPress={() => languageContext.setLanguage(vn)}>
          <Image style={[styles.languageItem, languageContext.language.TYPE === "vi" && styles.languageItemActive]}
                 source={require("../../../assets/languages/vn.png")}/>
        </Pressable>

        <Pressable style={styles.languageItemContainer} onPress={() => languageContext.setLanguage(ja)}>
          <Image style={[styles.languageItem, languageContext.language.TYPE === "ja" && styles.languageItemActive]}
                 source={require("../../../assets/languages/ja.png")}/>
        </Pressable>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  languageItem: {
    width: 20,
    height: 20,
  },

  languageItemContainer: {
    borderRadius: 1000,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },

  languageItemActive: {
    width: 35,
    height: 35,
  },

  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
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
    width: 200,
    height: 200,
    marginTop: 40,
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
  },

  text: {
    top: -25,
    left: 90,
    marginBottom: "-15%",
  },

  link: {
    color: TextColor.sub_primary,
  },

  button: {
    marginTop: "10%",
    alignItems: "center",
  },

  row1: {
    flexDirection: "row", // Đặt các biểu tượng nằm trên cùng một hàng
    justifyContent: "center", // Cân đối khoảng cách giữa các biểu tượng
    marginBottom: 20, // Thêm khoảng cách dưới hàng icon
  },

  row: {
    marginLeft: "5%", // Cân đối khoảng cách giữa các biểu tượng
    marginBottom: " -12%", // Thêm khoảng cách dưới hàng icon
  },

  lastText: {
    flexDirection: "row",
  },
});
