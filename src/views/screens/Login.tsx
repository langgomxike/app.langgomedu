import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import InputRegister from "../components/Inputs/InputRegister";
import Button from "../components/Button";
import { useCallback, useContext, useState } from "react";
import { NavigationContext } from "@react-navigation/native";
import ScreenName from "../../constants/ScreenName";
import AUser from "../../apis/AUser";
import { AccountContext } from "../../configs/AccountConfig";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";
import SAsyncStorage, { AsyncStorageKeys } from "../../services/SAsyncStorage";
import Toast from "react-native-simple-toast";
import { RoleList } from "../../models/Role";
import { LanguageContext } from "../../configs/LanguageConfig";
import Spinner from "react-native-loading-spinner-overlay";
import SLog, { LogType } from "../../services/SLog";

const REGEX_PHONE_NUMBER =
  /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
const REGEX_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function LoginScreen() {
  //contexts
  const navigation = useContext(NavigationContext);
  const accountContext = useContext(AccountContext);
  const languageContext = useContext(LanguageContext);

    // Đường dẫn tạm đếm admin
    // navigation?.navigate(ScreenName.PROFILE);

  //states
  const [usernameOrPhoneNumber, setUsernameOrPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  //handlers
  const handleForgettingPassword = useCallback(() => {
    navigation?.navigate(ScreenName.RESET_PASSWORD);
  }, []);

  const goToRegister = useCallback(() => {
    navigation?.navigate(ScreenName.REGISTER_STEP_1);
  }, []);

  const handleLogin = useCallback(() => {

    // Kiểm tra username và password: dài từ 6 đến 20 ký tự, username không chứa ký tự đặc biệt
    const usernameRegex = /^[a-zA-Z0-9]{6,20}$/;
    const passwordRegex = /^.{6,20}$/;

    if (!usernameOrPhoneNumber) {
      Alert.alert(
        languageContext.language.USERNAME_OR_PHONE_NUMBER,
        languageContext.language.INVALID_USERNAME_OR_PHONE_NUMBER,
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ]
      );
      return;
    }

    if (
      !/^[0-9]+$/.test(usernameOrPhoneNumber) &&
      !usernameRegex.test(usernameOrPhoneNumber)
    ) {
      Alert.alert(
        languageContext.language.USERNAME,
        languageContext.language.USERNAME_INVALID_FORMAT,
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ]
      );
      return;
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
      return;
    }

    // Kiểm tra mật khẩu: dài từ 6 đến 20 ký tự
    if (!passwordRegex.test(password)) {
      Alert.alert(
        languageContext.language.PASSWORD,
        languageContext.language.PASSWORD_INVALID_FORMAT,
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ]
      );
      return;
    }

    // xử lý đăng nhập kế tiếp
    const username = !/^[0-9]+$/.test(usernameOrPhoneNumber)
      ? usernameOrPhoneNumber
      : "";

    const phoneNumber =
      /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(
        usernameOrPhoneNumber
      )
        ? usernameOrPhoneNumber
        : "";

    setLoading(true);
    const timeId = setTimeout(() => {
      setLoading(false);
      Alert.alert(
        languageContext.language.LOGIN,
        languageContext.language.LOGIN_FAILED,
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ]
      );
    }, 10000);

    AUser.login(
      username,
      phoneNumber,
      password,
      (user) => {
        if (!user) {
          Alert.alert(
            languageContext.language.LOGIN,
            languageContext.language.LOGIN_FAILED,
            [
              {
                text: "OK",
                onPress: () => {},
              },
            ]
          );
          return;
        }

        if (accountContext.setAccount) {
          //save to global context
          accountContext.setAccount(user);

          //save into storage
          SAsyncStorage.setData(
            AsyncStorageKeys.TOKEN,
            user.token,
            () => {
              SLog.log(LogType.Info, "store token", "stored token", user.token);
              //check if admin/superadmin or not
              if (
                user.roles?.map((role) => role.id).includes(RoleList.ADMIN) ||
                user.roles
                  ?.map((role) => role.id)
                  .includes(RoleList.SUPER_ADMIN)
              ) {
                navigation?.reset({
                  index: 0,
                  routes: [{ name: ScreenName.HOME_ADMIN }],
                });
                navigation?.navigate(ScreenName.HOME_ADMIN);
              } else {
                navigation?.reset({
                  index: 0,
                  routes: [{ name: ScreenName.NAV_BAR }],
                });
                navigation?.navigate(ScreenName.HOME);
              }
              Toast.show(
                `${languageContext.language.WELCOME} ${user.full_name}`,
                2000
              );
            },
            (error) => {
              SLog.log(LogType.Error, "login", "cannot store token", error);
              Alert.alert(
                languageContext.language.LOGIN,
                languageContext.language.LOGIN_FAILED,
                [
                  {
                    text: "OK",
                    onPress: () => {},
                  },
                ]
              );
              return;
            }
          );
        }
      },
      () => {
        setLoading(false);
        clearTimeout(timeId);
      }
    );
  }, [
    usernameOrPhoneNumber,
    password,
    accountContext.account,
    accountContext.setAccount,
  ]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Spinner visible={loading} />

        {/* illustration image */}
        <Image
          style={styles.img}
          source={require("../../../assets/images/illustrations/login.png")}
        />

        {/* screen title */}
        <View>
          <Text style={styles.title}>{languageContext.language.LOGIN}</Text>
          <Text style={styles.content}>
            {languageContext.language.LOGIN_HINT}
          </Text>
        </View>

        {/* input email or phone number */}
        <View style={styles.input}>
          <InputRegister
            label={languageContext.language.USERNAME_OR_PHONE_NUMBER}
            required={true}
            placeholder={languageContext.language.USERNAME_OR_PHONE_NUMBER}
            type="text"
            onChangeText={setUsernameOrPhoneNumber}
            iconName="phone"
            value={usernameOrPhoneNumber}
          />
        </View>

        {/* input password */}
        <View style={styles.input}>
          <InputRegister
            label={languageContext.language.PASSWORD}
            required={true}
            placeholder={languageContext.language.PASSWORD}
            type="password"
            iconName="password"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* forgot password */}
        <Text
          style={[styles.forgotPassword, styles.link]}
          onPress={handleForgettingPassword}
        >
          {languageContext.language.FORGOT_PASSWORD}
        </Text>

        {/* submit button */}
        <Button
          title={languageContext.language.LOGIN}
          textColor="white"
          backgroundColor={BackgroundColor.primary}
          onPress={handleLogin}
        />

        {/* hint text */}
        <Text style={styles.link} onPress={goToRegister}>
          {languageContext.language.ALREADY_HAVE_ACCOUNT}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  input: {
    top: "0%",
    height: 20,
    width: "90%",
    marginBottom: "15%",
  },

  img: {
    top: 30,
    width: 250,
    height: 250,
    alignItems: "center",
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
  },

  content: {
    fontSize: 14,
    marginBottom: "20%",
  },

  forgotPassword: {
    top: -10,
    left: 100,
    marginBottom: "20%",
  },

  link: {
    color: TextColor.sub_primary,
  },

  button: {
    marginTop: "10%",
    alignItems: "center",
  },

  row: {
    // Đặt các biểu tượng nằm trên cùng một hàng
    marginLeft: "-40%", // Cân đối khoảng cách giữa các biểu tượng
    marginBottom: " -12%", // Thêm khoảng cách dưới hàng icon
  },
});
