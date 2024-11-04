import axios from "axios";
import User from "../../models/User";
import ReactAppUrl from "../../configs/ConfigUrl";

export default class AUserAdmin {
  private static BASE_URL = `${ReactAppUrl.API_BASE_URL}/admin`;

  public static getAllUsers(
    onNext: (users: User[]) => void,
    onLoading: (loading: boolean) => void
  ) {
    console.log(">>>users: ", `${this.BASE_URL}/users`);

    axios
      .get(`${this.BASE_URL}/users`)
      .then((response) => {
        onNext(response.data.data);
      })
      .catch((err) => {
        console.log("Error: ", err);
        onNext([]);
        onLoading(true);
      });
  }
}
