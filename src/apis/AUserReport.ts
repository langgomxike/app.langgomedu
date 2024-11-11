import axios from "axios";
import UserReport from "../models/UserReport";
import ReactAppUrl from "../configs/ConfigUrl";

export default class AUserReport {
    private static API_URL = ReactAppUrl.API_BASE_URL;
    public static getUserReportById(
        userReportId: string,
        onNext: (report: UserReport) => void,
        onLoading: (loading: boolean) => void
    ) {
        axios.get(`${this.API_URL}/reports/user/${userReportId}`)
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
    public static deneyUserReport(
        id: string,
        onNext: (response: any) => void,
        onLoading: (loading: boolean) => void
    ) {
        // Bắt đầu loading
        onLoading(true);
    
        // Gửi request POST đến BE với ID
        axios.post(`${this.API_URL}/reports/lockUserReport`, { reportId: id })
            .then((response) => {
                // Nếu thành công, gọi callback `onNext` với kết quả từ BE
                onNext(response.data);
            })
            .catch((error) => {
                console.error("Error denying user report:", error);
                onNext({ success: false, message: "Failed to deny user report." });
            })
            .finally(() => {
                // Kết thúc loading
                onLoading(false);
            });
    }

}