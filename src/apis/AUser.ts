import SAsyncStorage, {AsyncStorageKeys} from "../services/SAsyncStorage";
import Config from "../configs/Config";
import SLog, {LogType} from "../services/SLog";
import User from "../models/User";
import Response from "../models/Response";
import ReactAppUrl from "../configs/ConfigUrl";
import axios from "axios";

export default class AUser {
  private static BASE_URL = ReactAppUrl.API_BASE_URL + "/users";

  public static implicitLogin(onNext: (user: User | undefined) => void) {
    //prepare parameters
    const url = Config.API_BASE_URL + this.BASE_URL + "/login/implicit";

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
              error.message
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
    username: string,
    phoneNumber: string,
    password: string,
    onNext: (user: User | undefined) => void,
    onComplete?: () => void,
  ) {
    //prepare parameters
    const url = this.BASE_URL + "/login";
    const data = {
      username: username,
      phone_number: phoneNumber,
      password: password,
    }

    // SLog.log(LogType.Info,"login", "check url, check params", {url, data});

    //process login with parameters
    axios.post<Response>(url, data)
      .then((response) => {
        const user: User | undefined = response.data.data as User || undefined;
        onNext(user);
      })
      .catch((error) => {
        SLog.log(LogType.Error, "login", "Login with parameters failed", error);
        onNext(undefined);
      })
      .finally(onComplete);
  }

  public static register(
    user: User,
    requestCode: number,
    onNext: (user: User | undefined) => void,
    onComplete?: () => void,
  ) {
    //prepare parameters
    const url = this.BASE_URL + "/register";
    const data = {user, code: requestCode};

    // SLog.log(LogType.Info,"register", "check url, check params", {url, data});

    //process login with parameters
    axios.post<Response>(url, data)
      .then((response) => {
        SLog.log(LogType.Info, "Register", response.data.message, response.data.status);
        const user = response.data.data as User ?? undefined;
        onNext(user);
      })
      .catch((error) => {
        SLog.log(LogType.Info, "Register", "Found error", error);
        onNext(undefined);
      })
      .finally(onComplete);
  }

  public static changePassword(
    oldPassword: string,
    newPassword: string,
    onNext: (result: boolean) => void,
    onComplete?: () => void,
  ) {
    //prepare parameters
    const url = this.BASE_URL + "/change-password";
    const data = {old_password: oldPassword, new_password: newPassword};

    // SLog.log(LogType.Info,"register", "check url, check params", {url, data});

    //process login with parameters
    axios.post<Response>(url, data)
      .then((response) => {
        SLog.log(LogType.Info, "changePassword", response.data.message, response.data.status);
        onNext(response.data.status_code === 200);
      })
      .catch((error) => {
        SLog.log(LogType.Info, "changePassword", "Found error", error);
        onNext(false);
      })
      .finally(onComplete);
  }

  //trừ điểm uy tín
  public static minusUserPoints(
    user_id: string,
    point: number,
    onNext: (response: any) => void,
    onLoading: (loading: boolean) => void
  ) {
    // Bắt đầu loading
    onLoading(true);

    const url = this.BASE_URL + "/reports/minusUserPoints";

    // Gửi request POST đến BE với user_id và số điểm cần trừ
    axios
      .post(`${url}`, {user_id, point: point})
      .then((response) => {
        onNext(response.data);
      })
      .catch((error) => {
        SLog.log(LogType.Error, "minusUserPoints", "Cannot minus", error);
        onNext({success: false, message: "Failed to subtract points."});
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
    onNext: (response: any) => void,
    onLoading: (loading: boolean) => void
  ) {
    // Bắt đầu loading
    onLoading(true);
    const url = `${this.BASE_URL}/reports/lockUserAccount`;

    // Gửi request POST đến BE với user_id
    axios
      .post(url, {user_id})
      .then((response) => {
        // Nếu thành công, gọi callback `onNext` với kết quả từ BE
        onNext(response.data);
      })
      .catch((error) => {
        console.error("Error locking user account:", error);
        onNext({success: false, message: "Failed to lock user account."});
      })
      .finally(() => {
        // Kết thúc loading
        onLoading(false);
      });
  }

  //tạo tài khoản admin
  public static registerAdmin(
    phone: string,
    email: string,
    password: string,
    onNext: (response: any) => void,
    onLoading: (loading: boolean) => void
  ) {
    // Bắt đầu loading
    onLoading(true);
    const url = `${this.BASE_URL}/users/register/admin`;

    // Gửi request POST đến BE với thông tin cần thiết để tạo tài khoản admin
    axios
      .post(url, {
        phone,
        email,
        password,
      })
      .then((response) => {
        // Nếu thành công, gọi callback `onNext` với kết quả từ BE
        onNext(response.data);
      })
      .catch((error) => {
        console.error("Error creating admin account:", error);
        onNext({success: false, message: "Failed to create admin account."});
      })
      .finally(() => {
        // Kết thúc loading
        onLoading(false);
      });
  }
}