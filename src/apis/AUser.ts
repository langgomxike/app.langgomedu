import axios from "axios";
import SAsyncStorage, { AsyncStorageKeys } from "../services/SAsyncStorage";
import Config from "../configs/Config";
import SLog, { LogType } from "../services/SLog";
import User from "../models/User";
import Response from "../models/Response";
import ReactAppUrl from "../configs/ConfigUrl";

export default class AUser {
  private static API_URL = ReactAppUrl.API_BASE_URL;
  private static BASE_URL = "/users";

  public static implicitLogin(onNext: (user: User | undefined) => void) {
    //prepare parameters
    const url = Config.API_BASE_URL + this.BASE_URL + "/login";

    // done
    // SLog.log(LogType.Warning, "login url", "", url);

    //get token from storage
    SAsyncStorage.getData(
      AsyncStorageKeys.TOKEN,
      (token: string) => {
        if (!token) {
          SLog.log(
            LogType.Error,
            "implicitLogin",
            "Login unsuccessfully. Token not found"
          );
          onNext(undefined);
          return;
        }

        // process login with token
        axios
          .post<Response>(
            url,
            {},
            {
              headers: {
                Authorization: "Bearer " + token,
                Accept: "application/json",
              },
            }
          )
          .then((response) => {
            const user = (response.data.data as User) ?? undefined;
            SLog.log(
              LogType.Warning,
              "implicitLogin",
              "Login successfully",
              response.data
            );
            onNext(user);
            return;
          })
          .catch((error) => {
            SLog.log(
              LogType.Error,
              "implicitLogin",
              "Login with token failed",
              error
            );
            onNext(undefined);
            return;
          });
      },
      (error) => {
        SLog.log(
          LogType.Error,
          "implicitLogin",
          "Login with token failed. Token not found",
          error
        );
        onNext(undefined);
        return;
      }
    );
  }

  public static login(
    email: string,
    phoneNumber: string,
    password: string,
    onNext: (user: User | undefined) => void
  ) {
    //prepare parameters
    const url = Config.API_BASE_URL + this.BASE_URL + "/login";

    // done
    // SLog.log(LogType.Warning, "Login", "check url", url);

    //validate parameters
    if (
      email &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      SLog.log(
        LogType.Error,
        "login",
        "Login unsuccessfully. Email is invalid"
      );
      onNext(undefined);
      return;
    }

    if (
      phoneNumber &&
      !/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(
        phoneNumber
      )
    ) {
      SLog.log(
        LogType.Error,
        "login",
        "Login unsuccessfully. Phone number is invalid"
      );
      onNext(undefined);
      return;
    }

    if (!/(?=^.{6,}$)(?=.*[0-9])(?=.*[A-Z]).*/.test(password)) {
      SLog.log(
        LogType.Error,
        "login",
        "Login unsuccessfully. Password is invalid"
      );
      onNext(undefined);
      return;
    }

    //process login with parameters
    axios
      .post<Response>(
        url,
        {
          email: email,
          phone_number: phoneNumber,
          password: password,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        SLog.log(LogType.Warning, "login", "Login successfully", response.data);
        onNext((response.data.data as User) ?? undefined);
        return;
      })
      .catch((error) => {
        SLog.log(LogType.Error, "login", "Login with parameters failed", error);
        onNext(undefined);
        return;
      });
  }
  //trừ điểm uy tín
  public static minusUserPoints(
    user_id: string,
    point: number,
    report_id: string,  // Thêm tham số report_id
    onNext: (response: any) => void,
    onLoading: (loading: boolean) => void
  ) {
    // Bắt đầu loading
    onLoading(true);
    
    // Gửi request POST đến BE với user_id, số điểm cần trừ và report_id
    console.log("Sending request to subtract points:", { user_id, point, report_id });
  
    axios
      .post(`${this.API_URL}/reports/minusUserPoints`, { user_id, point, report_id })
      .then((response) => {
        // Nếu thành công, gọi callback onNext với kết quả từ BE
        if (response.data.success) {
          onNext({ success: true, message: "Points subtracted successfully." });
        } else {
          onNext({ success: false, message: response.data.message || "Failed to subtract points." });
        }
      })
      .catch((error) => {
        console.error("Error subtracting points:", error);
        onNext({ success: false, message: "Failed to subtract points due to server error." });
      })
      .finally(() => {
        // Kết thúc loading
        onLoading(false);
      });
  }

  //khoá tài khoản
  // Khóa tài khoản người dùng
  public static lockUserAccount(
    user_id: string,
    report_id: string, // Thêm tham số report_id
    permissionIds: string[], // Mảng quyền
    onNext: (response: any) => void,
    onLoading: (loading: boolean) => void
  ) {
    // Bắt đầu loading
    onLoading(true);
    console.log(`Gửi request để khóa tài khoản cho user_id: ${user_id} và report_id: ${report_id}`);
    console.log(`${this.API_URL}/reports/lockUserAccount`);
  
    // Gửi request POST đến BE với user_id, report_id và permissionIds
    axios
      .post(`${this.API_URL}/reports/lockUserAccount`, {
        user_id,
        report_id, // Truyền thêm report_id
        permission_ids: permissionIds,
      })
      .then((response) => {
        // Nếu thành công, gọi callback `onNext` với kết quả từ BE
        onNext(response.data);
      })
      .catch((error) => {
        console.error("Error locking user account:", error);
        onNext({ success: false, message: "Failed to lock user account." });
      })
      .finally(() => {
        // Kết thúc loading
        onLoading(false);
      });
  }
}
