import { createContext } from "react";
import vn from "../../languages/vn.json";

type LanguageConfigType = {
    language: typeof vn,
    setLanguage: (language: typeof vn) => void,
}

export const LanguageContext = createContext<LanguageConfigType>({
    language: vn,
    setLanguage: () => { }
});