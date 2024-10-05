import { useCallback, useEffect, useState } from "react";
import languages from "./languages.json";
import {
  LanguageContext,
  Languages,
  LanguageType,
} from "./src/configs/LanguageConfig";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ScreenName from "./src/constants/ScreenName";
import ButtonNavBar from "./src/views/components/ButtonNavBar";
import MessageScreen from "./src/views/screens/Message";
import ProfileScreen from "./src/views/screens/Profile";
import ClassDetail from "./src/views/screens/ClassDetail";
import { BackgroundColor } from "./src/configs/ColorConfig";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Filter from "./src/views/components/Filter";
import LoginScreen from "./src/views/screens/Login";
import Register1Screen from "./src/views/screens/Register1";
import Register2Screen from "./src/views/screens/Register2";
import OTPScreen from "./src/views/screens/OTP";
import ChangePasswordScreen from "./src/views/screens/ChangePassword";
import CVList from "./src/views/screens/CVList";
import OtpScreen from "./src/views/screens/OTP";
import SLog, { LogType } from "./src/services/SLog";
import SAsyncStorage, { AsyncStorageKeys } from "./src/services/SAsyncStorage";
import AppContext from "./src/configs/AppContext";

const Stack = createNativeStackNavigator();
const SCREEN_PADDING_TOP = 50;
const SCREEN_PADDING_HORIZONTAL = 0;

const Drawer = createDrawerNavigator();

export default function App() {
  // states
  const [language, setLanguage] = useState<LanguageType>(languages.VN);

  //handlers
  const setLanguageContext = useCallback((language: Languages) => {
    switch (language) {
      case Languages.VN:
        setLanguage(languages.VN);
        break;

      case Languages.EN:
        setLanguage(languages.EN);
        break;

      //Return View
      case Languages.JA:
        setLanguage(languages.JA);
        break;
    }
  }, []);

  //effects
  useEffect(() => {
    const getKey = () => {
      SAsyncStorage.getData(
        AsyncStorageKeys.TOKEN,
        (value) => {
          SLog.log(LogType.Info, "AD", "get token", value);
        },
        (error) => {
          SLog.log(LogType.Info, "AD", "save token", error);
        },
        () => {
          SLog.log(LogType.Info, "AD", "get token");
        }
      );
    };

    getKey();

    SAsyncStorage.removeData(
      AsyncStorageKeys.TOKEN,
      () => {
        SLog.log(LogType.Info, "AD", "remove token", true);
      },
      (error) => {
        SLog.log(LogType.Info, "AD", "remove token", error);
      },
      () => {
        SLog.log(LogType.Info, "AD", "remove token");
        getKey();
      }
    );
  }, []);

  // jxs
  return (
    <AppContext>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: {
              paddingTop: SCREEN_PADDING_TOP,
              paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
              backgroundColor: "#fff",
            },
          }}
        >
          <Stack.Screen name={ScreenName.NAV_BAR} component={ButtonNavBar} />
          <Stack.Screen name={ScreenName.MESSAGE} component={MessageScreen} />
          <Stack.Screen
            name={ScreenName.PROFILE}
            component={ProfileScreen}
            options={{ title: "Overview", headerShown: true }}
          />
          <Stack.Screen
            name={ScreenName.DETAIL_CLASS}
            component={ClassDetail}
            options={{
              title: "Chi tiết lớp học",
              headerShown: true,
              contentStyle: {
                padding: 0,
              },
              headerStyle: {
                backgroundColor: BackgroundColor.primary,
              },
              headerTintColor: "#fff",
            }}
          />

          <Stack.Screen name={ScreenName.CV_LIST} component={CVList} />
          <Stack.Screen name={ScreenName.OTP} component={OtpScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext>
  );
}
