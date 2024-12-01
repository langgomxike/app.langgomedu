import axios from "axios";
import User from "../../models/User";
import ReactAppUrl from "../../configs/ConfigUrl";
import Pagination from "../../models/Pagination";

export default class AUserAdmin {
  private static BASE_URL = `${ReactAppUrl.API_BASE_URL}/admin`;

  // Lấy tất cả người dùng
  public static getAllUsers(
    searchKey: string,
    action: string,
    page:number, perPage:number,
    onNext: (users: User[], pagination: Pagination) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);
    axios
      .get(`${this.BASE_URL}/users?search=${searchKey}&action=${action}&page=${page}&perPage=${perPage}`)
      .then((response) => {
        const users = response.data.data.users;
        const pagination = response.data.data.pagination;
        onNext(users, pagination);
        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
        onNext([], new Pagination);
        onLoading(true);
      });
  }

  // Lấy những người dùng bị báo cáo
  public static getAllReportedUsers(
    searchKey: string,
    page:number, perPage:number,
    onNext: (users: User[], pagination: Pagination) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);
    axios
      .get(`${this.BASE_URL}/users/reports?search=${searchKey}&page=${page}&perPage=${perPage}`)
      .then((response) => {
        const users = response.data.data.users;
        const pagination = response.data.data.pagination;
        onNext(users, pagination);
        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
        onNext([], new Pagination);
        onLoading(true);
      });
  }
}
