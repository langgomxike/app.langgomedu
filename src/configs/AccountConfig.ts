import { createContext } from "react";
import User from "../models/User";

type AccountConfigType = {
    account: User | undefined
}

export const AccountContext = createContext<AccountConfigType>({ account: undefined });