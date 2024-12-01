import axios from "axios";
import ReactAppUrl from "../configs/ConfigUrl";
import Gender from "../models/Gender";

const BASE_URL = ReactAppUrl.API_BASE_URL + "/genders";

export default class AGender {
    public static getAllGenders(onNext: (genders: Gender[]) => void) {
        axios
          .get(BASE_URL)
          .then((response) => {
            const genders = response.data.data

            onNext(genders);
            
          })
          .catch((error) => {
            console.log("error ", error);
            onNext([]);
          });
      }
}