import { createContext } from "react";
import User from "../models/User";

type AccountConfigType = {
    account: User | undefined,
    setAccount?: (account: User | undefined) => void
}

export const AccountContext = createContext<AccountConfigType>({ account: undefined });