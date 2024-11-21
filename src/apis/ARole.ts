import Role from "../models/Role";
import ReactAppUrl from "../configs/ConfigUrl";
import axios from "axios";
import Response from "../models/Response";
import SAsyncStorage, {AsyncStorageKeys} from "../services/SAsyncStorage";
import SLog, {LogType} from "../services/SLog";
import Permission from "../models/Permission";


const role_txt = `[
  {
    "id": 1,
    "name": "SUPER_ADMIN"
  },
  {
    "id": 2,
    "name": "ADMIN"
  },
  {
    "id": 3,
    "name": "USER"
  },
  {
    "id": 4,
    "name": "TUTOR"
  },
  {
    "id": 5,
    "name": "PARENT"
  },
  {
    "id": 6,
    "name": "CHILD"
  },
  {
    "id": 7,
    "name": "BANNED_USER"
  }
]`;

export default class ARole {
  private static BASE_URL = ReactAppUrl.API_BASE_URL + "/roles";

  public static getAllRoles(onNext: (roles: Role[]) => void, onComplete?: () => void) {
    const url = this.BASE_URL;

    SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
      (token) => {
        axios.get<Response>(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
          .then(response => {
            const roles = response.data.data as Role[] ?? [];
            SLog.log(LogType.Error, "setAllRoles", "get roles successfully", roles.length);
            onNext(roles);
          })
          .catch(error => {
            SLog.log(LogType.Error, "setAllRoles", "cannot get roles", error);
            onNext([]);
          })
          .finally(onComplete)
      },
      (error) => {
        SLog.log(LogType.Error, "setAllRoles", "cannot get roles", error);
        onNext([]);
        onComplete && onComplete();
      }
    );
  }

  public static addNewRole(role: Role, onNext: (result: boolean) => void, onComplete?: () => void) {
    const url = this.BASE_URL;
    const data = {
      role
    }

    SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
      (token) => {
        axios.post<Response>(url, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
          .then(response => {
            const result = response.data.status === "OK";
            SLog.log(LogType.Error, "addNewRole", "add new role successfully", result);
            onNext(result);
          })
          .catch(error => {
            SLog.log(LogType.Error, "addNewRole", "cannot add new role", error);
            onNext(false);
          })
          .finally(onComplete);
      },
      (error) => {
        SLog.log(LogType.Error, "addNewRole", "cannot add new role", error);
        onNext(false);
        onComplete && onComplete();
      }
    );
  }

  public static deleteNewRole(role: Role, onNext: (result: boolean) => void, onComplete?: () => void) {
    const url = this.BASE_URL + "/" + role.id;

    SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
      (token) => {
        axios.delete<Response>(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
          .then(response => {
            const result = response.data.status === "OK";
            SLog.log(LogType.Error, "deleteNewRole", "delete role successfully", result);
            onNext(result);
          })
          .catch(error => {
            SLog.log(LogType.Error, "deleteNewRole", "cannot delete role", error);
            onNext(false);
          })
          .finally(onComplete);
      },
      (error) => {
        SLog.log(LogType.Error, "deleteNewRole", "cannot delete role", error);
        onNext(false);
        onComplete && onComplete();
      }
    );
  }

  public static updatePermissionsOfRole(role: Role, permissions: number[], onNext: (result: boolean) => void, onComplete?: () => void) {
    const url = this.BASE_URL + "/permissions";
    const data = {
      role,
      permissions
    }

    SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
      (token) => {
        axios.put<Response>(url, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
          .then(response => {
            const result = response.data.status === "OK";
            SLog.log(LogType.Error, "updatePermissionsOfRole", "update permissions of role successfully", result);
            onNext(result);
          })
          .catch(error => {
            SLog.log(LogType.Error, "updatePermissionsOfRole", "cannot update permissions of role", error);
            onNext(false);
          })
          .finally(onComplete);
      },
      (error) => {
        SLog.log(LogType.Error, "updatePermissionsOfRole", "cannot update permissions of role", error);
        onNext(false);
        onComplete && onComplete();
      }
    );
  }
}