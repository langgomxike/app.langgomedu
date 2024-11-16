
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
  //từ chối báo cáo lớp học
  // từ chối báo cáo lớp học
public static denyClassReport(
  reportId: number,
  onNext: (response: any) => void,
  onLoading: (loading: boolean) => void
) {
  // Bắt đầu loading
  onLoading(true);

  // Gửi request POST đến BE với reportId
  axios.post(`${this.API_URL}/reports/lockClassReport`, { reportId })
      .then((response) => {
          // Nếu thành công, gọi callback `onNext` với kết quả từ BE
          onNext(response.data);
      })
      .catch((error) => {
          console.error("Error denying class report:", error);
          onNext({ success: false, message: "Failed to deny class report." });
      })
      .finally(() => {
          // Kết thúc loading
          onLoading(false);
      });
}

}
