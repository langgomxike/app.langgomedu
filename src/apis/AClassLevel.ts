import axios from "axios";
import ClassLevel from "../models/ClassLevel";
import ReactAppUrl from "../configs/ConfigUrl";

const BASE_URL = ReactAppUrl.API_BASE_URL + "/class-levels";

export default class AClassLevel {
  public static getAllClassLevels(onNext: (classLevels: ClassLevel[]) => void) {
    axios
      .get(BASE_URL)
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
}
