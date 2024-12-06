import axios from "axios";
import ClassLevel from "../models/ClassLevel";
import Response from "../models/Response";
import ReactAppUrl from "../configs/ConfigUrl";
import SLog, {LogType} from "../services/SLog";

export default class AClassLevel {
  private static BASE_URL = ReactAppUrl.API_BASE_URL + "/class-levels"
  public static getAllClassLevels(onNext: (classLevels: ClassLevel[]) => void) {
    axios
      .get(this.BASE_URL)
      .then((response) => {
        const classLevelDatas = response.data.data as ClassLevel[];
        // console.log("res ", response.data.message);
        
        onNext(classLevelDatas);
      })
      .catch((error) => {
        console.log("error ", error);
        onNext([]);
      });
  }

  public static getInterestedClassLevels(userId: string, onNext: (classLevels: ClassLevel[]) => void) {
    const url = this.BASE_URL + "/interested";
    const data = {user_id: userId};

    axios.post<Response>(url, data)
     .then(response => {
       SLog.log(LogType.Error, "getInterestedClassLevels", response.data.message, response.data.status);
        onNext(response.data.data as ClassLevel[] ?? []);
      })
     .catch(error => {
       SLog.log(LogType.Error, "getInterestedClassLevels", "found error", error);
       onNext([]);
      });
  }
}
