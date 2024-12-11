import Rating from "../models/Rating";
import ReactAppUrl from "../configs/ConfigUrl";
import axios from "axios";
import SAsyncStorage, {AsyncStorageKeys} from "../services/SAsyncStorage";
import Response from "../models/Response";
import SLog, {LogType} from "../services/SLog";

export default class ARating {
  private static BASE_URL = ReactAppUrl.API_BASE_URL + "/ratings";

  public static sendRating(rating: Rating, onNext: (result: boolean) => void, onComplete: () => void) {
    const url = this.BASE_URL;
    const data = {rating}

    SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
      (token) => {
        axios.post<Response>(url, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
          .then(response => {
            const result = response.data.status_code === 200;
            SLog.log(LogType.Error, "sendRating", "send rating successfully", result);
            onNext(result);
          })
          .catch(error => {
            SLog.log(LogType.Error, "sendRating", "cannot send rating", error);
            onNext(false);
          })
          .finally(onComplete);
      },
      (error) => {
        SLog.log(LogType.Error, "sendRating", "cannot send rating", error);
        onNext(false);
        onComplete && onComplete();
      }
    );
  }

  public static getAllRatingsOfUser(userId: string, onNext: (ratings: Rating[]) => void) {
      const url = this.BASE_URL + `/users/` + userId;

      axios.get<Response>(url)
        .then(response => {
          const ratings: Rating[] = response.data.data as Rating[] ?? [];

          SLog.log(LogType.Info, "getAllRatingsOfUser", response.data.message, response.data.status);
          onNext(ratings);
        })
        .catch(error => {
          SLog.log(LogType.Error, "getAllRatingsOfUser", "cannot get ratings of user", error);
          onNext([]);
        });
  }
}