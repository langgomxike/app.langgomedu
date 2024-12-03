import axios from "axios";
import Response from "../models/Response";
import ReactAppUrl from "../configs/ConfigUrl";
import SLog, {LogType} from "../services/SLog";

export default class AUserReport {
  private static API_URL = ReactAppUrl.API_BASE_URL;

  //từ chối báo cáo
  public static performReport(
    id: number,
    reason: string,
    level: number,
    point: number,
    reporterId: string,
    reporteeId: string,
    onNext: (result: boolean) => void,
    onLoading: () => void
  ) {
    const url = `${this.API_URL}/reports/perform-report`;
    const data = {id, reason, level, point, reporter_id: reporterId, reportee_id: reporteeId};

    axios
      .post<Response>(url, data)
      .then((response) => {
        SLog.log(LogType.Info, "lockReport", response.data.message, response.data.status);
        onNext(response.data.status_code === 200);
      })
      .catch((error) => {
        SLog.log(LogType.Info, "lockReport", "found error", error);
        onNext(false);
      })
      .finally(onLoading);
  }

  //tạo báo cáo
  public static createReport(
    formdata: FormData,
    onNext: (response: any) => void,
    onLoading: (loading: boolean) => void
  ) {
    // Bắt đầu loading
    onLoading(true);
  
    console.log("formdata", JSON.stringify(formdata,null, 2));
    
  
    // Gửi request POST đến backend
    axios
      .post(`${this.API_URL}/reports/created_report`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // Nếu thành công, gọi callback `onNext` với kết quả từ BE
        onNext(response.data);
      })
      .catch((error) => {
        console.error("Error creating report:", error);
        onNext({ success: false, message: "Failed to create report." });
      })
      .finally(() => {
        // Kết thúc loading
        onLoading(false);
      });
  }
}
