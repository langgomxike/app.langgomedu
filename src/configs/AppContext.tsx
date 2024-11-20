import {
  PropsWithChildren,
  useCallback,
  useState,
  useEffect
} from "react";
import {LanguageContext} from "./LanguageConfig";
import vn from "../../languages/vn.json";
import User from "../models/User";
import {AccountContext} from "./AccountConfig";
import {UserContext, UserDataType, UserType} from "./UserContext";
import general_infos from "../constants/general_infos.json";
import {AppInfoContext} from "./AppInfoContext";

export default function AppContext({children}: PropsWithChildren) {
  //states
  const [language, setLanguage] = useState<typeof vn>(vn);
  const [account, setAccount] = useState<User | undefined>(undefined);
  const [user, setUser] = useState<UserDataType>({
    ID: "",
    TYPE: UserType.LEANER,
  });
  const [appInfos, setAppInfos] = useState<typeof general_infos>(general_infos);

  //handlers
  const setLanguageContext = useCallback((language: typeof vn) => {
    setLanguage(language);
  }, []);

  //effects
  useEffect(() => {
  }, []);

  return (
    <LanguageContext.Provider
      value={{language: language, setLanguage: setLanguageContext}}
    >
      <AccountContext.Provider
        value={{account: account, setAccount: setAccount}}
      >
        <UserContext.Provider value={{user, setUser}}>
          <AppInfoContext.Provider value={{setAppInfo: setAppInfos, infos: appInfos}}>
            {children}
          </AppInfoContext.Provider>
        </UserContext.Provider>
      </AccountContext.Provider>
    </LanguageContext.Provider>
  );
}
