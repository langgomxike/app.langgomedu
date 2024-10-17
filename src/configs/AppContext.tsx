import {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { LanguageContext, Languages, LanguageType } from "./LanguageConfig";
import languages from "../../languages.json";
import User from "../models/User";
import { AccountContext } from "./AccountConfig";
import { NavigationContext } from "@react-navigation/native";

export default function AppContext({ children }: PropsWithChildren) {
  //states
  const navigation = useContext(NavigationContext);
  const [language, setLanguage] = useState<LanguageType>(languages.VN);
  const [account, setAccount] = useState<User | undefined>(undefined);
  const [inboxes, setInboxes] = useState<any[]>([]);

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

  return (
    <LanguageContext.Provider
      value={{ language: language, setLanguage: setLanguageContext }}
    >
      <AccountContext.Provider
        value={{ account: account, setAccount: setAccount }}
      >
        {children}
      </AccountContext.Provider>
    </LanguageContext.Provider>
  );
}
