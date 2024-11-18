import axios from "axios";
import Report from "../models/Report";
import Response from "../models/Response";
import ReactAppUrl from "../configs/ConfigUrl";
import SLog, {LogType} from "../services/SLog";

export default class AUserReport {
  private static API_URL = ReactAppUrl.API_BASE_URL + "/reports";

  public static getUserReportById(
    userReportId: string,
    onNext: (report: Report | undefined) => void,
    onLoading: (loading: boolean) => void
  ) {
    axios.get<Response>(`${this.API_URL}/user/${userReportId}`)
      .then((response) => {
        const report: Report | undefined = response.data.data as Report ?? undefined;

        onNext(report);
        onLoading(false);
      })
      .catch((err) => {
        SLog.log(LogType.Warning, "getUserReportById", "", err)
        onLoading(true);
      });
  }

  //từ chối báo cáo
  public static denyUserReport(
    id: string,
    onNext: (result: boolean) => void,
    onLoading: (loading: boolean) => void
  ) {
    // Bắt đầu loading
    onLoading(true);

    // Gửi request POST đến BE với ID
    axios.post(`${this.API_URL}/lockUserReport`, {reportId: id})
      .then((response) => {
        SLog.log(LogType.Info, "denyUserReport", "Done");
        onNext(response.data.status_code === 200);
      })
      .catch((error) => {
        SLog.log(LogType.Error, "denyUserReport", "Cannot deny user", error);
        onNext(false);
      })
      .finally(() => {
        // Kết thúc loading
        onLoading(false);
      });
  }
}