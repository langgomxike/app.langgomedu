import axios from "axios";
import SAsyncStorage, { AsyncStorageKeys } from "../services/SAsyncStorage";
import Config from "../configs/Config";
import SLog, { LogType } from "../services/SLog";
import User from "../models/User";

export default class AUser {
    private static BASE_URL = "/users";

    public static implicitLogin(onNext: (user: User | undefined) => void) {
        //prepare parameters
        const url = Config.API_BASE_URL + this.BASE_URL + "/login";

        //get token from storage    
        SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
            (token: string) => {

                if (!token) {
                    SLog.log(LogType.Error, "implicitLogin", "Login unsuccessfully. Token not found");
                    onNext(undefined);
                    return;
                }

                // process login with token
                axios.post(url, {}, {
                    headers: {
                        Authorization: "Bearer " + token,
                        Accept: "application/json"
                    }
                })
                    .then(response => {
                        SLog.log(LogType.Warning, "implicitLogin", "Login successfully", response.data);
                    })
                    .catch(error => {
                        SLog.log(LogType.Error, "implicitLogin", "Login with token failed", error);
                        onNext(undefined);
                        return;
                    });
            },
            (error) => {
                SLog.log(LogType.Error, "implicitLogin", "Login with token failed. Token not found", error);
                onNext(undefined);
                return;
            }
        )
    }

    public static login(email: string, phoneNumber: string, password: string, onNext: (user: User | undefined) => void) {
        //prepare parameters
        const url = Config.API_BASE_URL + this.BASE_URL + "/login";

        SLog.log(LogType.Warning, "Login", "check url", url); 

        //validate parameters
        if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            SLog.log(LogType.Error, "login", "Login unsuccessfully. Email is invalid");
            onNext(undefined);
            return;
        }

        if (phoneNumber && !/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(phoneNumber)) {
            SLog.log(LogType.Error, "login", "Login unsuccessfully. Phone number is invalid");
            onNext(undefined);
            return;
        }

        if (!/(?=^.{6,}$)(?=.*[0-9])(?=.*[A-Z]).*/.test(password)) {
            SLog.log(LogType.Error, "login", "Login unsuccessfully. Password is invalid");
            onNext(undefined);
            return;
        }

        //process login with parameters
        axios.post(url, {
            email: email,
            phone_number: phoneNumber,
            password: password
        }, {
            headers: {
                Accept: "application/json"
            },
        })
            .then(response => {
                SLog.log(LogType.Warning, "login", "Login successfully", response.data);
            })
            .catch(error => {
                SLog.log(LogType.Error, "login", "Login with parameters failed", error);
                onNext(undefined);
                return;
            });
    }
}