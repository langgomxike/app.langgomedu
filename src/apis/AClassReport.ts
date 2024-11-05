
import axios from "axios";
import ClassReport from "../models/ClassReport";
import ReactAppUrl from "../configs/ConfigUrl";

export default class AClassReport {
  private static API_URL = ReactAppUrl.API_BASE_URL;
  public static getClassReportById(
    classReportId: string,
    onNext: (report: ClassReport) => void,
    onLoading: (loading: boolean) => void
  ) {
    axios
      .get(`${this.API_URL}/reports/class/${classReportId}`)
      .then((response) => {
        // console.log("Full Response du lieu lay tu axios:", response.data); // Kiểm tra dữ liệu trả về từ API
        const data = response.data.data;
        onNext(data);
        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
        onLoading(true);
      });
  }
}
