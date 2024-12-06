import SAsyncStorage, { AsyncStorageKeys } from "../services/SAsyncStorage";
import SLog, { LogType } from "../services/SLog";
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

    axios
      .get<Response>(url)
      .then((response) => {
        if (response.data.status_code === 200) {
          SLog.log(
            LogType.Error,
            "getUserById",
            "get user successfully",
            response.data.status
          );
          onNext((response.data.data as User) ?? undefined);
        } else {
          SLog.log(
            LogType.Error,
            "getUserById",
            "cannot get user",
            response.data.message
          );
          onNext(undefined);
        }
      })
      .catch((error) => {
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

        SLog.log(LogType.Info, "implicitLogin", "check token", token);

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
    onComplete?: () => void
  ) {
    //prepare parameters
    const url = this.BASE_URL + "/login";
    const data = {
      username: username,
      phone_number: phoneNumber,
      password: password,
    };

    // process login with parameters
    axios
      .post<Response>(url, data)
      .then((response) => {
        const user: User | undefined =
          (response.data.data as User) || undefined;

        SLog.log(
          LogType.Warning,
          "login",
          "Login with parameters successfully",
          user?.full_name
        );
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
    onComplete?: () => void
  ) {
    //prepare parameters
    const url = this.BASE_URL + "/register";
    const data = { user, code: requestCode };

    SLog.log(LogType.Info, "register", "check url, check params", {url, data});

    //process login with parameters
    axios
      .post<Response>(url, data)
      .then((response) => {
        SLog.log(
          LogType.Info,
          "Register",
          response.data.message,
          response.data.status
        );
        const user = (response.data.data as User) ?? undefined;
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
        SLog.log(
          LogType.Info,
          "changePassword",
          response.data.message,
          response.data.status
        );
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
    report_id: string, // Thêm tham số report_id
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
        onNext({ success: false, message: "Failed to lock user account." });
      })
      .finally(() => {
        // Kết thúc loading
        onLoading(false);
      });
  }

  //lấy profile của User
  public static getUserProfileById(
    userId: string,
    onNext: (user: User) => void, // Hàm callback khi lấy được dữ liệu
    onLoading: (loading: boolean) => void // Hàm callback để thay đổi trạng thái loading
  ) {
    axios
      .get(`${ReactAppUrl.API_BASE_URL}/users/profile/${userId}`) // URL API để lấy thông tin người dùng
      .then((response) => {
        const data = response.data.data; // Giả sử API trả về dữ liệu trong `data`
        if (data) {
          onNext(data); // Trả về thông tin người dùng nếu có
        } else {
          onNext(new User()); // Trường hợp không có dữ liệu, trả về đối tượng User mặc định
        }
        onLoading(false); // Đổi trạng thái loading thành false
      })
      .catch((err) => {
        console.log("Error: ", err); // Log lỗi nếu có
        onLoading(false); // Đổi trạng thái loading thành false ngay cả khi lỗi
      });
  }

  // Hàm cập nhật thông tin người dùng (bao gồm cả avatar)
  // public static updateUserProfile(
  //   userId: string,
  //   formData: FormData, // Dữ liệu bao gồm các trường thông tin người dùng và avatar
  //   onNext: (response: any) => void, // Callback khi nhận được phản hồi từ server
  //   onLoading: (loading: boolean) => void // Callback để thay đổi trạng thái loading
  // ) {
  //   // Bắt đầu trạng thái loading
  //   onLoading(true);

  //   // Log formData để kiểm tra (nếu cần)
  //   console.log("Form data to update profile:", formData);

  //   // Gửi yêu cầu POST đến API để cập nhật thông tin người dùng
  //   axios
  //     .post(`${ReactAppUrl.API_BASE_URL}/users/update_profile`, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data", // Đảm bảo gửi file dưới dạng multipart
  //       },
  //     })
  //     .then((response) => {
  //       // Nếu yêu cầu thành công, gọi callback với dữ liệu phản hồi từ server
  //       onNext(response.data);
  //     })
  //     .catch((error) => {
  //       // Log lỗi nếu có
  //       console.error("Error updating profile:", error);
  //       onNext({ success: false, message: "Failed to update profile." });
  //     })
  //     .finally(() => {
  //       // Kết thúc trạng thái loading
  //       onLoading(false);
  //     });
  // }
  public static updateUserProfile(
    userId: string,
    formData: FormData,
    onNext: (response: any) => void,
    onLoading: (loading: boolean) => void
  ) {
    // console.log('abcd',formData);
    // Kiểm tra nếu userId không có giá trị hoặc không hợp lệ
    if (!userId) {
      console.error("User ID is required but not provided");
      onNext({ success: false, message: "User ID is missing" });
      return; // Dừng việc gửi yêu cầu nếu không có userId
    }
    onLoading(true);
    console.log("URL", JSON.stringify(formData, null, 2));
    console.log("da goi den axxios");
    
    axios
      .post(
        `${ReactAppUrl.API_BASE_URL}/users/update_profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        onNext(response.data); // Gọi callback với dữ liệu phản hồi
      })
      .catch((error) => {
        console.error("Error updating profile:", error.message);
        onNext({ success: false, message: "Failed to update profile." });
      })
      .finally(() => {
        onLoading(false); // Kết thúc trạng thái loading
      });
  }
  public static updateAvatar(
    userId: string,
    formData: FormData,
    onNext: (response: any) => void,
    onLoading: (loading: boolean) => void
  ) {
    // Kiểm tra nếu userId không có giá trị hoặc không hợp lệ
    if (!userId) {
      console.error("User ID is required but not provided");
      onNext({ success: false, message: "User ID is missing" });
      return; // Dừng việc gửi yêu cầu nếu không có userId
    }

    // Thêm userId vào formData nếu nó chưa có trong đó
    formData.append("user_id", userId);

    // Bắt đầu trạng thái loading
    onLoading(true);
    console.log("URL", JSON.stringify(formData, null, 2));

    // Gửi yêu cầu POST đến API để cập nhật thông tin người dùng và avatar
    axios
      .post(
        `${ReactAppUrl.API_BASE_URL}/users/update_avatar/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        onNext(response.data); // Gọi callback với dữ liệu phản hồi
      })
      .catch((error) => {
        console.error("Error updating avatar:", error.message);
        onNext({ success: false, message: "Failed to update avatar." });
      })
      .finally(() => {
        onLoading(false); // Kết thúc trạng thái loading
      });
  }
}
