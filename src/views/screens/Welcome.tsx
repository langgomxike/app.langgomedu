import {Image, Linking, StyleSheet, Text, View} from "react-native";
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";
import {useCallback, useContext, useEffect} from "react";
import {LanguageContext} from "../../configs/LanguageConfig";
import {NavigationContext} from "@react-navigation/native";
import {AppInfoContext} from "../../configs/AppInfoContext";
import SFirebase from "../../services/SFirebase";
import SAsyncStorage, {AsyncStorageKeys} from "../../services/SAsyncStorage";
import vn from "../../../languages/vn.json";
import en from "../../../languages/en.json";
import ja from "../../../languages/ja.json";
import AUser from "../../apis/AUser";
import ScreenName from "../../constants/ScreenName";
import {AccountContext} from "../../configs/AccountConfig";
import {UserContext, UserType} from "../../configs/UserContext";
import {RoleList} from "../../models/Role";
import Toast from "react-native-simple-toast";
import {ProgressBar} from "@react-native-community/progress-bar-android";

export default function WelcomeScreen() {
  // context
  const languageContext = useContext(LanguageContext);
  const navigation = useContext(NavigationContext);
  const appInfoContext = useContext(AppInfoContext);
  const accountContext = useContext(AccountContext);
  const {user, setUser} = useContext(UserContext);

  //handlers
  const openLink = useCallback((link: string) => {
    Linking.openURL(link);
  }, []);

  //effects
  //get all information
  useEffect(() => {
    SFirebase.getAppInfos((infos) => {
      appInfoContext.setAppInfo && appInfoContext.setAppInfo(infos);
    });
  }, [appInfoContext.setAppInfo]);

  //set up multilanguage
  useEffect(() => {
    SAsyncStorage.getData(AsyncStorageKeys.LANGUAGE, (language) => {
      switch (language) {
        case "vi": // vn
          languageContext.setLanguage &&
          languageContext.setLanguage(vn);
          break;
        case "en": // en
          languageContext.setLanguage &&
          languageContext.setLanguage(en);
          break;
        case "ja": //ja
          languageContext.setLanguage &&
          languageContext.setLanguage(ja);
          break;
      }
    });
  }, []);

  //set up login
  useEffect(() => {
    const timeId = setTimeout(() => {
      AUser.implicitLogin((user) => {
        if (!user) {
          navigation?.reset({
            index: 0,
            routes: [{ name: ScreenName.LOGIN }],
          });
        } else {
          //store new token into async storage
          SAsyncStorage.setData(AsyncStorageKeys.TOKEN, user.token);

          if (accountContext.setAccount) {
            accountContext.setAccount(user);
            setUser({ID: user.id, TYPE: UserType.LEANER});

            //check if admin/superadmin or not
            if (user.roles?.map(role => role.id).includes(RoleList.ADMIN) || user.roles?.map(role => role.id).includes(RoleList.SUPER_ADMIN)) {
              navigation?.reset({
                index: 0,
                routes: [{ name: ScreenName.HOME_ADMIN }],
              });
            } else {
              navigation?.reset({
                index: 0,
                routes: [{ name: ScreenName.NAV_BAR }],
                // routes: [{ name: ScreenName.RATING }],
              });
            }

            Toast.show(languageContext.language.WELCOME + " " + user.full_name, 2000);
          }
        }
      });
    }, 5000);

    return () => {
      clearTimeout(timeId);
    }
  }, [accountContext.setAccount]);

  return(
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../../../assets/logo.png")} />
      <Text style={styles.appName}>{appInfoContext.infos.app_name}</Text>

      <Text style={styles.text}>Welcome to {appInfoContext.infos.app_name} 👋</Text>

      <Image source={require("../../../assets/loading_animation.gif")}/>
      <Text style={{color: TextColor.white, opacity: 0.8}}>Loading...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 200,
    height: 200,
    backgroundColor: BackgroundColor.white,
    borderRadius: 100,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: BackgroundColor.white,
    shadowColor: BackgroundColor.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },

  appName: {
    marginVertical: 10,
    fontWeight: "bold",
    fontSize: 30,
    color: TextColor.white,
  },

  text: {
    color: TextColor.white,
    fontStyle: "italic",
    marginBottom: 50,
    fontSize: 16,
  },

  link: {
   fontSize: 14,
   color: TextColor.sub_primary,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    textDecorationLine: "underline",
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    fontWeight: "bold",
  }
});