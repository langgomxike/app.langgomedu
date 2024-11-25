import ReactAppUrl from "../configs/ConfigUrl";
import axios from "axios";
import Response from "../models/Response";
import SLog, {LogType} from "../services/SLog";

export default class AOTP {
  private static BASE_URL = ReactAppUrl.API_BASE_URL +"/otps";

  public static auth(requestCode: number, onNext: (result: boolean) => void, onComplete: () => void) {
    const url = this.BASE_URL + "/check";
    const data = {
      code: requestCode
    }

    axios.post<Response>(url, data)
      .then(response => {
        SLog.log(LogType.Info, "auth", response.data.message, response.data.status);
        onNext(response.data.status_code === 200);
      })
      .catch(error => {
        SLog.log(LogType.Info, "auth", "found error", error);
        onNext(false);
      })
      .finally(onComplete);
  }
}