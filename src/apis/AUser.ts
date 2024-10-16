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
                        SLog.log(LogType.Error, "implicitLogin", "Login successfully", response.data);
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
}