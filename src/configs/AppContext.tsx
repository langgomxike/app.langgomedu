import {
  PropsWithChildren,
  useCallback,
  useState,
  useEffect,
  createContext,
} from "react";
import { LanguageContext } from "./LanguageConfig";
import vn from "../../languages/vn.json";
import User from "../models/User";
import { AccountContext } from "./AccountConfig";
import { UserContext, UserDataType, UserType } from "./UserContext";
import Major from "../models/Major";
import { MajorsLevelsContext } from "./MajorsLevelsContext";
import ClassLevel from "../models/ClassLevel";
import general_infos from "../constants/general_infos.json";
import { AppInfoContext } from "./AppInfoContext";
import Gender from "../models/Gender";
import { GenderContext } from "./GenderContext";
import { AuthContext } from "./AuthContext";

export const ChatTabContext = createContext<number[]>([0, 0, 0]);
export const SearchContext = createContext("");

const authFunc = (otp: number, onComplete: () => void) => {};

export default function AppContext({ children }: PropsWithChildren) {
  //states
  const [language, setLanguage] = useState<typeof vn>(vn);
  const [account, setAccount] = useState<User | undefined>(undefined);
  const [user, setUser] = useState<UserDataType>({
    ID: "",
    TYPE: UserType.LEANER,
  });
  const [refresh, setRefresh] = useState(false);
  const [appInfos, setAppInfos] = useState<typeof general_infos>(general_infos);

  const [majors, setMajors] = useState<Major[]>([]);
  const [classLevels, setClassLevels] = useState<ClassLevel[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [func, setFunc] =
    useState<(otp: number, onComplete: () => void) => void>(authFunc);

  //handlers
  const setLanguageContext = useCallback((language: typeof vn) => {
    setLanguage(language);
  }, []);

  return (
    <LanguageContext.Provider
      value={{ language: language, setLanguage: setLanguageContext }}
    >
      <AccountContext.Provider
        value={{ account: account, setAccount: setAccount }}
      >
        <UserContext.Provider value={{ user, setUser, refresh, setRefresh }}>
          <AppInfoContext.Provider
            value={{ setAppInfo: setAppInfos, infos: appInfos }}
          >
            <MajorsLevelsContext.Provider value={{ majors, setMajors, classLevels, setClassLevels }}>
              <GenderContext.Provider value={{ genders, setGenders }}>
                <AuthContext.Provider  value={{ onAfterAuth: func, setOnAfterAuth: setFunc }}>
                  {children}
                </AuthContext.Provider>
              </GenderContext.Provider>
            </MajorsLevelsContext.Provider>
          </AppInfoContext.Provider>
        </UserContext.Provider>
      </AccountContext.Provider>
    </LanguageContext.Provider>
  );
}
