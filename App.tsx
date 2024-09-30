import { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import languages from "./languages.json";
import {
  LanguageContext,
  Languages,
  LanguageType,
} from "./src/configs/LanguageConfig";
import KhanhTestScreen from "./src/views/screens/KhanhTest";
import KhangTestScreen from "./src/views/screens/KhangTest";
import DuTestScreen from "./src/views/screens/DuTest";
import NhiTestScreen from "./src/views/screens/NhiTest";
import HoangTestScreen from "./src/views/screens/HoangTest";
import OtpScreen from "./src/views/screens/OTP";
import LoginSreen from "./src/views/screens/Login";
import RegisterScreen1 from "./src/views/screens/Register1";
import RegisterScreen2 from "./src/views/screens/Register2";
import ChangePasswordScreen from "./src/views/screens/ChangePassword";


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
      {/* <DuTestScreen /> */}
      <OtpScreen/>
      {/* oke roi */}
      {/* <LoginSreen/> */}
      {/* oke roi */}
      {/* <RegisterScreen1/> */}
      {/* <RegisterScreen2/> */}
      {/* oke roi */}
      {/* <ChangePasswordScreen/> */}

      {/* <HoangTestScreen />
      <KhangTestScreen />
      <KhanhTestScreen />

      <NhiTestScreen /> */}
    </LanguageContext.Provider>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
  course: {},
  container: {
    flex: 1,
    backgroundColor: "#0D99FF",
    alignItems: "center",
    justifyContent: 'flex-start',
    marginTop: 50,
  },

  languageSelector: {
    flexDirection: "row",
    justifyContent: "space-around", // Spread buttons evenly
    marginBottom: 20, // Add some space below the language selector
  },

  horizontalList: {
    marginBottom: 20, 
  },

  badge: {
    justifyContent: "center",
    marginTop: 20,
  },

  header: {
    backgroundColor: "orange",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  headerTest: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "600",
  },

  body: {
    paddingHorizontal: 10,
    marginTop: 10,
  },

  btnAdd: {
    backgroundColor: "#0D99FF",
    padding: 15,
    borderRadius: 7,
    marginTop: 50,
  },

  btnAddText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});