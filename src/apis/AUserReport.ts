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
}