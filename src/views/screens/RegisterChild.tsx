import {ScrollView, Text, View, StyleSheet, Image, Alert} from "react-native";
import MyIcon, {AppIcon} from "../components/MyIcon";
import InputRegister from "../components/Inputs/InputRegister";
import Button from "../components/Button";
import {useCallback, useContext, useState} from "react";
import {NavigationContext} from "@react-navigation/native";
import ScreenName from "../../constants/ScreenName";
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";
import {LanguageContext} from "../../configs/LanguageConfig";
import {OTPNavigationType, RegisterType} from "../../configs/NavigationRouteTypeConfig";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-simple-toast";
import AUser from "../../apis/AUser";
import {AccountContext} from "../../configs/AccountConfig";
import User from "../../models/User";
import BackLayout from "../layouts/Back";
import {AuthContext} from "../../configs/AuthContext";

export default function RegisterChildScreen() {
  //contexts, refs
  const navigation = useContext(NavigationContext);
  const languageContext = useContext(LanguageContext);
  const accountContext = useContext(AccountContext);
  const authContext = useContext(AuthContext);

  //states
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // kiem tra du lieu khi nhan nut tiep tuc
  const handleSubmit = useCallback((otp: number, onComplete: () => void) => {
    const child = new User();
    child.full_name = fullname;
    child.username = username;
    child.password = password;

    if (!accountContext.account) {
      Toast.show(languageContext.language.REGISTER_FAILED, 1000);
      return;
    }

    AUser.registerChild(otp, child, accountContext.account,
      (result) => {
        if (result) {
          Alert.alert(languageContext.language.REGISTER, languageContext.language.REGISTER_FOR_CHILD_SUCCESS, [
            {
              onPress: () => {
                navigation?.goBack();
              }
            }
          ]);
        } else {
          Toast.show(languageContext.language.REGISTER_FAILED, 1000);
        }
      },
      onComplete
    );

  }, [password, fullname, username, confirmPassword, accountContext.account]);

  const handleAuth = useCallback(() => {
    if (!fullname) {
      Alert.alert(languageContext.language.FULL_NAME, languageContext.language.INVALID_FULL_NAME);
      return;
    }

    if (!username) {
      Alert.alert(languageContext.language.USERNAME, languageContext.language.INVALID_USERNAME);
      return;
    }

    if (!password) {
      Alert.alert(languageContext.language.PASSWORD, languageContext.language.INVALID_PASSWORD);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(languageContext.language.CONFIRM_PASSWORD, languageContext.language.INVALID_CONFIRM_PASSWORD);
      return;
    }

    if (!accountContext.account) {
      Toast.show(languageContext.language.REGISTER_FAILED, 1000);
      return;
    }

    const data: OTPNavigationType = {
      phone_number: accountContext.account?.phone_number ?? "-1",
    }

    navigation?.navigate(ScreenName.OTP, data);
    authContext.setOnAfterAuth(() => handleSubmit);
  }, [password, fullname, username, confirmPassword, accountContext.account])

  return (
    <BackLayout>
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
              <Text style={styles.title}>{languageContext.language.REGISTER_FOR_CHILD}</Text>
              <Text style={styles.content}>{languageContext.language.REGISTER_FOR_CHILD_HINT}</Text>
            </View>
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

          <View style={styles.input}>
            <InputRegister
              label={languageContext.language.FULL_NAME}
              required={true}
              onChangeText={setFullname}
              value={fullname}
              placeholder={languageContext.language.FULL_NAME}
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
            <Text style={{color: "red"}}>{errorMessage}</Text>
          ) : null}
          <>
            {/* submit button */}
            <Button
              title={languageContext.language.SUBMIT}
              textColor="white"
              backgroundColor={BackgroundColor.primary}
              onPress={handleAuth}
            />
          </>
        </View>
      </ScrollView>
    </BackLayout>
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
    marginTop: 100,
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
