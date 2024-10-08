import { useCallback, useState } from "react";
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
import TutorAttendance from "./src/views/screens/TutorAttendance";
import LeanerAttendance from "./src/views/screens/LeanerAttendance";
import History from "./src/views/screens/History";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();
const SCREEN_PADDING_TOP = 50;
const SCREEN_PADDING_HORIZONTAL = 0;

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

  // jxs
  return (
    <LanguageContext.Provider
      value={{ language: language, setLanguage: setLanguageContext }}
    >
       <GestureHandlerRootView>
      {/* <NavigationContainer>
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
                padding: 0
              },
              headerStyle: {
                backgroundColor: BackgroundColor.primary
              },
              headerTintColor: '#fff',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer> */}
      {/* <LeanerAttendance></LeanerAttendance> */}
      {/* <TutorAttendance></TutorAttendance> */}
      {/* <LeanerAttendance></LeanerAttendance> */}
      <History/>
      </GestureHandlerRootView>
    </LanguageContext.Provider>
  );
}