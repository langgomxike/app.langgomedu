import { PropsWithChildren, useCallback, useState } from "react";
import { LanguageContext, Languages, LanguageType } from "./LanguageConfig";
import languages from "../../languages.json";
import User from "../models/User";
import { AccountContext } from "./AccountConfig";

export default function AppContext({ children }: PropsWithChildren) {
  //states
  const [language, setLanguage] = useState<LanguageType>(languages.VN);
  const [account, setAccount] = useState<User | undefined>(undefined);

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

  const implicitLogin = useCallback(() => {
    
  }, []);

  return (
    <LanguageContext.Provider
      value={{ language: language, setLanguage: setLanguageContext }}
    >
      <AccountContext.Provider value={{ account: account }}>
        {children}
      </AccountContext.Provider>
    </LanguageContext.Provider>
  );
}
