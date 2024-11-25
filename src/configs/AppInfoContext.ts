import { createContext } from "react";
import general_infors from "../constants/general_infos.json";

type AppInfoConfigType = {
  infos: typeof general_infors,
  setAppInfo?: (infos: typeof general_infors) => void
}

export const AppInfoContext = createContext<AppInfoConfigType>({ infos: general_infors, setAppInfo: () => {} });