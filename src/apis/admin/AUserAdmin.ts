import axios from "axios";
import User from "../../models/User";
import ReactAppUrl from "../../configs/ConfigUrl";
import Pagination from "../../models/Pagination";
import Response from "../../models/Response";
import SLog, {LogType} from "../../services/SLog";
import Report from "../../models/Report";

export default class AUserAdmin {
  private static BASE_URL = `${ReactAppUrl.API_BASE_URL}/admin`;

  // Lấy tất cả người dùng
  public static getAllUsers(
    searchKey: string,
    action: string,
    page: number, perPage: number,
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
    page: number, perPage: number,
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

  public static getReportsOfUser(user: User, onNext: (reports: Report[]) => void) {
    const url = `${this.BASE_URL}/users/reports`;

    const data = {user};

    axios.post<Response>(url, data)
      .then(response => {
        SLog.log(LogType.Info, "getReportsOfUser", "get reports successfully", response.data.status);
        onNext(response.data.data as Report[]);
      })
      .catch(error => {
        SLog.log(LogType.Error, "getReportsOfUser", "cannot get reports", error);
        onNext([]);
      });
  }

  public static getReportById(id: number, onNext: (report: Report| undefined) => void) {
    const url = `${this.BASE_URL}/users/reports/${id}`;

    axios.get<Response>(url)
      .then(response => {
        SLog.log(LogType.Info, "getReportById", "get report successfully", response.data.status);
        onNext(response.data.data as Report);
      })
      .catch(error => {
        SLog.log(LogType.Error, "getReportById", "cannot get report", error);
        onNext(undefined);
      });
  }

  public static getReportEvidenceById(id: number, onNext: (evidences: string[]) => void) {
    const url = `${this.BASE_URL}/users/reports/evidences/${id}`;

    axios.get<Response>(url)
      .then(response => {
        SLog.log(LogType.Info, "getReportEvidenceById", "get evidences successfully", response.data.status);
        onNext(response.data.data as string[]);
      })
      .catch(error => {
        SLog.log(LogType.Error, "getReportEvidenceById", "cannot get report", error);
        onNext([]);
      });
  }
}
