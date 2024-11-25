import axios from "axios";
import UserReport from "../models/UserReport";
import ReactAppUrl from "../configs/ConfigUrl";
import { jsiConfigureProps } from "react-native-reanimated/lib/typescript/reanimated2/core";

export default class AUserReport {
  private static API_URL = ReactAppUrl.API_BASE_URL;
  public static getUserReportById(
    userReportId: string,
    onNext: (report: UserReport) => void,
    onLoading: (loading: boolean) => void
  ) {
    axios
      .get(`${this.API_URL}/reports/user/${userReportId}`)
      .then((response) => {
        const data = response.data.data;
        if (data.length > 0) {
          onNext(data[0].report); // Truyền report đầu tiên
        } else {
          onNext(new UserReport()); // Trường hợp không có dữ liệu
        }
        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
        onLoading(true);
      });
  }
  //từ chối báo cáo
  public static lockReport(
    id: string,
    reason: string,
    onNext: (response: any) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);

    axios
      .post(`${this.API_URL}/reports/lockReport`, { reportId: id, reason })
      .then((response) => {
        onNext(response.data);
      })
      .catch((error) => {
        console.error("Error locking user report:", error);

        if (error.response) {
          // Lỗi từ server
          onNext({
            success: false,
            message: error.response.data?.message || "Unknown error occurred.",
          });
        } else {
          // Lỗi kết nối
          onNext({
            success: false,
            message: "Failed to connect to the server.",
          });
        }
      })
      .finally(() => {
        onLoading(false);
      });
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
