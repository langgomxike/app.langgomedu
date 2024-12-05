import SAsyncStorage, {AsyncStorageKeys} from "../services/SAsyncStorage";
import SLog, {LogType} from "../services/SLog";
import User from "../models/User";
import Response from "../models/Response";
import ReactAppUrl from "../configs/ConfigUrl";
import axios from "axios";
import Address from "../models/Address";

export default class AUser {
  private static BASE_URL = ReactAppUrl.API_BASE_URL + "/users";

  public static auth(phoneNumber: string, onComplete: () => void) {
    const url = this.BASE_URL + "/auth";
    const data = {
      user: {
        phone_number: phoneNumber,
      }
    }

    axios.post<Response>(url, data)
      .then(response => {
        if (response.data.status_code === 200) {
          SLog.log(LogType.Error, "auth", "send otp successfully", response.data.status);
        } else {
          SLog.log(LogType.Error, "auth", "cannot send otp", response.data.message);
        }
      })
      .catch(error => {
        SLog.log(LogType.Error, "auth", "cannot send otp", error);
      })
      .finally(onComplete);
  }

  public static getUserAddress(userId: string, onNext: (address: Address| undefined) => void) {
    const url = this.BASE_URL + "/address";
    const data = {
      user_id: userId,
    }

    axios.post<Response>(url, data)
      .then(response => {
        SLog.log(LogType.Info, "getUserAddress", response.data.message, response.data.status);
        onNext(response.data.data as Address ?? undefined);
      })
      .catch(error => {
        SLog.log(LogType.Error, "getUserAddress", "cannot get user address", error);
        onNext(undefined);
      });
  }

  public static getUserById(id: string, onNext: (user: User | undefined) => void) {
    const url = this.BASE_URL + "/" + id;

    axios.get<Response>(url)
      .then(response => {
        if (response.data.status_code === 200) {
          SLog.log(LogType.Error, "getUserById", "get user successfully", response.data.status);
          onNext(response.data.data as User ?? undefined);
        } else {
          SLog.log(LogType.Error, "getUserById", "cannot get user", response.data.message);
          onNext(undefined);
        }
      })
      .catch(error => {
        SLog.log(LogType.Error, "getUserById", "cannot get user", error);
        onNext(undefined);
      });
  }

  public static implicitLogin(onNext: (user: User | undefined) => void) {
    //prepare parameters
    const url = this.BASE_URL + "/login/implicit";

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

        SLog.log(
          LogType.Info,
          "implicitLogin",
          "check token",
          token
        );

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

    // process login with parameters
    axios.post<Response>(url, data)
      .then((response) => {
        const user: User | undefined = response.data.data as User || undefined;

        SLog.log(LogType.Warning, "login", "Login with parameters successfully", user?.full_name);
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

    SLog.log(LogType.Info, "register", "check url, check params", {url, data});

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

  public static registerChild(
    otp: number,
    user: User,
    parent: User,
    onNext: (result: boolean) => void,
    onComplete?: () => void,
  ) {
    //prepare parameters
    const url = this.BASE_URL + "/register/child";
    const data = {user, parent, otp};

    //process login with parameters
    axios.post<Response>(url, data)
      .then((response) => {
        SLog.log(LogType.Info, "registerChild", response.data.message, response.data.status);
        onNext(response.data.status_code === 200);
      })
      .catch((error) => {
        SLog.log(LogType.Info, "registerChild", "Found error", error);
        onNext(false);
      })
      .finally(onComplete);
  }

  public static updateRolesOfUser(userId: string, roles: number[], onNext: (result: boolean) => void, onComplete?: () => void) {
    const url = this.BASE_URL + "/roles";

    const data = {
      user: {
        id: userId,
      },
      roles
    }

    axios.put<Response>(url, data)
      .then(response => {
        SLog.log(LogType.Info, "updateRolesOfUser", response.data.message, response.data.status);
        onNext(response.data.status_code === 200);
      })
      .catch(error => {
        SLog.log(LogType.Info, "updateRolesOfUser", "Found error", error);
        onNext(false);
      })
      .finally(onComplete);
  }

  public static changePassword(
    userId: string,
    phoneNumber: string,
    newPassword: string,
    otp: number,
    onNext: (result: boolean) => void,
    onComplete?: () => void,
  ) {
    //prepare parameters
    const url = this.BASE_URL + "/change-password";
    const data = {
      user: {
        id: userId,
        phone_number: phoneNumber,
      },
      new_password: newPassword,
      otp
    };

    //process login with parameters
    axios.put<Response>(url, data)
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

  public static resetPassword(
    phoneNumber: string,
    newPassword: string,
    otp: number,
    onNext: (result: boolean) => void,
    onComplete?: () => void,
  ) {
    //prepare parameters
    const url = this.BASE_URL + "/reset-password";
    const data = {
      user: {
        phone_number: phoneNumber,
      },
      new_password: newPassword,
      otp
    };

    //process login with parameters
    axios.put<Response>(url, data)
      .then((response) => {
        SLog.log(LogType.Info, "resetPassword", response.data.message, response.data.status);
        onNext(response.data.status_code === 200);
      })
      .catch((error) => {
        SLog.log(LogType.Info, "resetPassword", "Found error", error);
        onNext(false);
      })
      .finally(onComplete);
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

    const url = `${this.BASE_URL}/reports/minusUserPoints`;

    // Gửi request POST đến BE với user_id, số điểm cần trừ và report_id
    console.log("Sending request to subtract points:", {user_id, point, report_id});

    axios
      .post(url, {user_id, point, report_id})
      .then((response) => {
        // Nếu thành công, gọi callback onNext với kết quả từ BE
        if (response.data.success) {
          onNext({success: true, message: "Points subtracted successfully."});
        } else {
          onNext({success: false, message: response.data.message || "Failed to subtract points."});
        }
      })
      .catch((error) => {
        console.error("Error subtracting points:", error);
        onNext({success: false, message: "Failed to subtract points due to server error."});
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

    const url = `${this.BASE_URL}/reports/lockUserAccount`;

    console.log(`Gửi request để khóa tài khoản cho user_id: ${user_id} và report_id: ${report_id}`);
    console.log(url);

    // Gửi request POST đến BE với user_id, report_id và permissionIds
    axios
      .post(url, {
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
        onNext({success: false, message: "Failed to lock user account."});
      })
      .finally(() => {
        // Kết thúc loading
        onLoading(false);
      });
  }
}