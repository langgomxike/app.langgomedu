import { createContext } from "react";
import languages from "../../languages.json";

export enum Languages {
    "VN",
    "EN",
    "JA"
}

export type LanguageType = {
    VIEW_ALL: string;
    SHOWING_PAGE: string;
    SEARCH: string
}

type LanguageConfigType = {
    language: LanguageType,
    setLanguage: (language: Languages) => void,
}

export const LanguageContext = createContext<LanguageConfigType>({
    language: languages.VN,
    setLanguage: () => { }
});