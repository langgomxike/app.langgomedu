import axios from "axios";
import SAsyncStorage, { AsyncStorageKeys } from "../services/SAsyncStorage";
import Config from "../configs/Config";

export default class AUser {
    public static implicitLogin() {
        //prepare parameters
        const url = Config.API_BASE_URL + "/login"

        SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
            (token: string) => {
                axios.post(url, )
            },
            (error) => {

            },
            () => {

            }
        )
    }
}