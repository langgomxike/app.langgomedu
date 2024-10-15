import axios from "axios";
import Major from "../models/Major";
import ReactAppUrl from "../configs/ConfigUrl";

export default class AMajor {


  public static getAllMajors(
    onNext: (majors: Major[]) => void,
    onLoading: (loading: boolean) => void
  ) {

    console.log("API_BASR_URL", ReactAppUrl.API_BASE_URL);
    

    onLoading(true);
    axios
      .get(`${ReactAppUrl.API_BASE_URL}/majors`, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {

        onNext(response.data);
        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
        onNext([]);
        onLoading(false);
      });
  }
}
