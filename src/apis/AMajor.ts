import axios from "axios";
import Major from "../models/Major";
import Response from "../models/Response";
import ReactAppUrl from "../configs/ConfigUrl";
import SLog, {LogType} from "../services/SLog";

export default class AMajor {
  private static BASE_URL = ReactAppUrl.API_BASE_URL + "/majors";

  public static getAllMajors(
    onNext: (majors: Major[]) => void,
    onLoading: (loading: boolean) => void
  ) {
    
    onLoading(true);
    axios
      .get(`${ReactAppUrl.API_BASE_URL}/majors`)
      .then((response) => {

        onNext(response.data);
        // console.log("data == ", response.data);
        
        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
        onNext([]);
        onLoading(false);
      });
  }

  public static getInterestedMajors(userId: string, onNext: (majors: Major[])=> void) {
    const url = this.BASE_URL + "/interested";

    const data = {user_id: userId};

    axios.post<Response>(url, data)
      .then(response => {
        SLog.log(LogType.Error, "getInterestedMajors", response.data.message, response.data.status);
        onNext(response.data.data as Major[] ?? []);
      })
      .catch(error => {
        SLog.log(LogType.Error, "getInterestedMajors", "found error", error);
        onNext([]);
      });
  }
}
