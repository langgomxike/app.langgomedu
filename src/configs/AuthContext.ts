import {createContext} from "react";

type AuthConfigType = {
  onAfterAuth: (otp: number, onComplete: () => void) => void;
  setOnAfterAuth: (func: (otp: number, onComplete: () => void) => void) => void;
}

export const AuthContext = createContext<AuthConfigType>({
  onAfterAuth: () => {},
  setOnAfterAuth: () => {}
});