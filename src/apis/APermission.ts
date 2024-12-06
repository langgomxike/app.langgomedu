import Permission from "../models/Permission";
import Role from "../models/Role";
import SAsyncStorage, {AsyncStorageKeys} from "../services/SAsyncStorage";
import axios from "axios";
import Response from "../models/Response";
import SLog, {LogType} from "../services/SLog";
import ReactAppUrl from "../configs/ConfigUrl";
import User from "../models/User";

const permission_txt = `[
  {
    "id": 1,
    "name": "VIEW_APP_COMMON_INFORMATION"
  },
  {
    "id": 2,
    "name": "UPDATE_APP_COMMON_INFORMATION"
  },
  {
    "id": 3,
    "name": "VIEW_MAJOR_LIST"
  },
  {
    "id": 4,
    "name": "CREATE_NEW_MAJOR"
  },
  {
    "id": 5,
    "name": "UPDATE_MAJOR"
  },
  {
    "id": 6,
    "name": "DELETE_MAJOR"
  },
  {
    "id": 7,
    "name": "VIEW_SKILL_LIST"
  },
  {
    "id": 8,
    "name": "CREATE_NEW_SKILL"
  },
  {
    "id": 9,
    "name": "UPDATE_SKILL"
  },
  {
    "id": 10,
    "name": "DELETE_SKILL"
  },
  {
    "id": 11,
    "name": "VIEW_CERTIFICATE_LIST"
  },
  {
    "id": 12,
    "name": "CREATE_NEW_CERTIFICATE"
  },
  {
    "id": 13,
    "name": "UPDATE_CERTIFICATE"
  },
  {
    "id": 14,
    "name": "DELETE_CERTIFICATE"
  },
  {
    "id": 15,
    "name": "VIEW_USER_INFORMATION_LIST"
  },
  {
    "id": 16,
    "name": "VIEW_USER_INFORMATION"
  },
  {
    "id": 17,
    "name": "CREATE_NEW_USER_INFORMATION"
  },
  {
    "id": 18,
    "name": "UPDATE_USER_INFORMATION"
  },
  {
    "id": 19,
    "name": "DELETE_USER_INFORMATION"
  },
  {
    "id": 20,
    "name": "VIEW_OTHER_USER_INFORMATION"
  },
  {
    "id": 21,
    "name": "CREATE_NEW_OTHER_USER_INFORMATION"
  },
  {
    "id": 22,
    "name": "UPDATE_OTHER_USER_INFORMATION"
  },
  {
    "id": 23,
    "name": "DELETE_OTHER_USER_INFORMATION"
  },
  {
    "id": 24,
    "name": "VIEW_REPORT_USER_LIST"
  },
  {
    "id": 25,
    "name": "VIEW_REPORT_USER"
  },
  {
    "id": 26,
    "name": "CREATE_NEW_REPORT_USER"
  },
  {
    "id": 27,
    "name": "UPDATE_REPORT_USER"
  },
  {
    "id": 28,
    "name": "DELETE_REPORT_USER"
  },
  {
    "id": 29,
    "name": "VIEW_REPORT_CLASS_LIST"
  },
  {
    "id": 30,
    "name": "VIEW_REPORT_CLASS"
  },
  {
    "id": 31,
    "name": "CREATE_NEW_REPORT_CLASS"
  },
  {
    "id": 32,
    "name": "UPDATE_REPORT_CLASS"
  },
  {
    "id": 33,
    "name": "DELETE_REPORT_CLASS"
  },
  {
    "id": 34,
    "name": "VIEW_REQUESTED_CLASS_LIST"
  },
  {
    "id": 35,
    "name": "VIEW_REQUESTED_CLASS"
  },
  {
    "id": 36,
    "name": "UPDATE_REQUESTED_CLASS"
  },
  {
    "id": 37,
    "name": "VIEW_PERSONAL_CLASS_LIST"
  },
  {
    "id": 38,
    "name": "VIEW_PERSONAL_CLASS"
  },
  {
    "id": 39,
    "name": "CREATE_NEW_PERSONAL_CLASS"
  },
  {
    "id": 40,
    "name": "UPDATE_PERSONAL_CLASS"
  },
  {
    "id": 41,
    "name": "DELETE_PERSONAL_CLASS"
  },
  {
    "id": 42,
    "name": "VIEW_OTHER_USER_CLASS_LIST"
  },
  {
    "id": 43,
    "name": "VIEW_OTHER_USER_CLASS"
  },
  {
    "id": 44,
    "name": "UPDATE_OTHER_USER_CLASS"
  },
  {
    "id": 45,
    "name": "DELETE_OTHER_USER_CLASS"
  },
  {
    "id": 46,
    "name": "VIEW_CV_LIST"
  },
  {
    "id": 47,
    "name": "VIEW_CV"
  },
  {
    "id": 48,
    "name": "CREATE_NEW_CV"
  },
  {
    "id": 49,
    "name": "UPDATE_CV"
  },
  {
    "id": 50,
    "name": "DELETE_CV"
  }
]`;

export default class APermission {
  private static BASE_URL = ReactAppUrl.API_BASE_URL + "/permissions";

  public static getAllPermissions(onNext: (permissions: Permission[]) => void, onComplete?: () => void) {
    const url = this.BASE_URL;

    const permissions = JSON.parse(permission_txt) as Permission[] ?? [];

    onNext(permissions);
    onComplete && onComplete();
    return;

    SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
      (token) => {
        axios.get<Response>(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
          .then(response => {
            const permissions = response.data.data as Permission[] ?? [];
            SLog.log(LogType.Error, "getAllPermissions", "get permissions successfully", permissions.length);
            onNext(permissions);
          })
          .catch(error => {
            SLog.log(LogType.Error, "getAllPermissions", "cannot get permissions", error);
            onNext([]);
          })
          .finally(onComplete)
      },
      (error) => {
        SLog.log(LogType.Error, "getAllPermissions", "cannot get permissions", error);
        onNext([]);
        onComplete && onComplete();
      }
    );
  }

  public static getPermissionsOfRole(role: Role, onNext: (permissions: Permission[]) => void, onComplete?: () => void) {
    const url = this.BASE_URL + "/of-role/" + role.id;

    SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
      (token) => {
        axios.get<Response>(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
          .then(response => {
            const permissions = response.data.data as Permission[] ?? [];
            SLog.log(LogType.Info, "getPermissionsOfRole", "get permissions successfully", permissions.length);
            onNext(permissions);
          })
          .catch(error => {
            SLog.log(LogType.Error, "getPermissionsOfRole", "cannot get permissions", error);
            onNext([]);
          })
          .finally(onComplete)
      },
      (error) => {
        SLog.log(LogType.Error, "getPermissionsOfRole", "cannot get permissions", error);
        onNext([]);
        onComplete && onComplete();
      }
    );
  }

  public static getPermissionsOfUser(user: User, onNext: (permissions: Permission[]) => void, onComplete?: () => void) {
    const url = this.BASE_URL + "/of-user";
    const data = {user};

    SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
      (token) => {
        axios.post<Response>(url,data, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
          .then(response => {
            const permissions = response.data.data as Permission[] ?? [];
            SLog.log(LogType.Info, "getPermissionsOfUser", "get permissions successfully", permissions.length);
            onNext(permissions);
          })
          .catch(error => {
            SLog.log(LogType.Error, "getPermissionsOfUser", "cannot get permissions", error);
            onNext([]);
          })
          .finally(onComplete)
      },
      (error) => {
        SLog.log(LogType.Error, "getPermissionsOfUser", "cannot get permissions", error);
        onNext([]);
        onComplete && onComplete();
      }
    );
  }
}