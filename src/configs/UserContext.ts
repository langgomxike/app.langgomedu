import { createContext } from "react";

export enum UserType {
    "TUTOR" = 1,
    "LEANER" = 2,
}

export type UserDataType = {
    ID: string;
    TYPE: number;
}

 type UserContextType = {
    user: UserDataType;
    setUser: (user: UserDataType) => void;
    refresh: boolean;
    setRefresh: (refresh: boolean) => void;
}

// Khởi tạo UserContext với giá trị mặc định
export const UserContext = createContext<UserContextType>({
    user: { ID: "", TYPE: -1 },
    setUser: () => {},
    refresh: false,
    setRefresh: () => {},
});