import Message from "../models/Message";
import Response from "../models/Response";
import User from "../models/User";
import axios from "axios";
import SAsyncStorage, {AsyncStorageKeys} from "../services/SAsyncStorage";
import SLog, {LogType} from "../services/SLog";
import ReactAppUrl from "../configs/ConfigUrl";
import Inbox from "../models/Inbox";
import ClassInbox from "../models/ClassInbox";

export default class AMessage {
  private static BASE_URL = ReactAppUrl.API_BASE_URL + '/messages';

  public static getContactsOfUser(onNext: (users: User[]) => void) {
    const url = this.BASE_URL + "/contacts";

    SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
      (token) => {
        axios.get<Response>(url, {
          headers: {
            Accept: "application/json",
            Authorization: token
          }
        },)
          .then(response => {
            SLog.log(LogType.Warning, "getContactsOfUser", response.data?.message || "", response.data.status);
            const contacts: User[] = response.data.data as any[];
            onNext(contacts);
          })
          .catch(error => {
            SLog.log(LogType.Error, "getContactsOfUser", "cannot get contacts of user", error)
            onNext([]);
          })
      }, (error) => {
        SLog.log(LogType.Error, "getContactsOfUser", "cannot get contacts of user", error)
        onNext([]);
      });
  }

  public static getNotificationsOfUser(onNext: (notis: Message[]) => void) {
    const url = this.BASE_URL + "/notifications";

    SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
      (token) => {
        axios.get<Response>(url, {
          headers: {
            Accept: "application/json",
            Authorization: token
          }
        },)
          .then(response => {
            SLog.log(LogType.Warning, "getNotificationsOfUser", response.data?.message || "", response.data.status);
            const notis: Message[] = response.data.data as Message[] ?? [];
            onNext(notis);
          })
          .catch(error => {
            SLog.log(LogType.Error, "getNotificationsOfUser", "cannot get notifications of user", error)
            onNext([]);
          })
      }, (error) => {
        SLog.log(LogType.Error, "getNotificationsOfUser", "cannot get notifications of user", error)
        onNext([]);
      });
  }

  public static deleteNotification(id: number, onNext: (result: boolean) => void, onComplete: () => void) {
    const url = this.BASE_URL + "/notifications/" + id;

    SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
      (token) => {
        axios.delete<Response>(url, {
          headers: {
            Accept: "application/json",
            Authorization: token
          }
        },)
          .then(response => {
            SLog.log(LogType.Warning, "deleteNotification", response.data?.message || "", response.data.status);
            onNext(response.data.status_code === 200);
          })
          .catch(error => {
            SLog.log(LogType.Error, "deleteNotification", "cannot delete notification", error);
            onNext(false);
          })
          .finally(onComplete);
      }, (error) => {
        SLog.log(LogType.Error, "deleteNotification", "cannot delete notification", error);
        onNext(false);
        onComplete();
      });
  }

  public static getChatsOfUser(onNext: (chats: Inbox[]) => void) {
    const url = this.BASE_URL + "/inboxes";

    SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
      (token) => {
        axios.get<Response>(url, {
          headers: {
            Accept: "application/json",
            Authorization: token
          }
        },)
          .then(response => {
            SLog.log(LogType.Warning, "getChatsOfUser", response.data?.message || "", response.data.status);
            const chats: Inbox[] = response.data.data as Inbox[] ?? [];
            onNext(chats);
          })
          .catch(error => {
            SLog.log(LogType.Error, "getChatsOfUser", "cannot get inboxes of user", error);
            onNext([]);
          })
      }, (error) => {
        SLog.log(LogType.Error, "getChatsOfUser", "cannot get inboxes of user", error);
        onNext([]);
      });
  }

  public static getClassChatsOfUser(onNext: (chats: ClassInbox[]) => void) {
    const url = this.BASE_URL + "/inboxes/group";

    SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
      (token) => {
        axios.get<Response>(url, {
          headers: {
            Accept: "application/json",
            Authorization: token
          }
        },)
          .then(response => {
            SLog.log(LogType.Warning, "getClassChatsOfUser", response.data?.message || "", response.data.status);
            const chats: ClassInbox[] = response.data.data as ClassInbox[] ?? [];
            onNext(chats);
          })
          .catch(error => {
            SLog.log(LogType.Error, "getClassChatsOfUser", "cannot get inboxes of class", error);
            onNext([]);
          })
      }, (error) => {
        SLog.log(LogType.Error, "getClassChatsOfUser", "cannot get inboxes of class", error);
        onNext([]);
      });
  }

  public static getMessagesOfTowUsers(fromUserId: string, toUserId: string, onNext: (messages: Message[]) => void) {
    const url = this.BASE_URL + "/two-users";

    SLog.log(LogType.Warning, "getMessagesOfTowUsers", "check ids", {fromUserId, toUserId});

    SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
      (token) => {
        axios.post<Response>(url,
          {
            from_user: {
              id: fromUserId
            },
            to_user: {
              id: toUserId
            }
          },
          {
            headers: {
              Accept: "application/json",
              Authorization: token
            }
          },)
          .then(response => {
            SLog.log(LogType.Warning, "getMessagesOfTowUsers", response.data?.message || "", response.data.status);
            const messages: Message[] = response.data.data as any[];
            onNext(messages);
          })
          .catch(error => {
            SLog.log(LogType.Error, "getMessagesOfTowUsers", "cannot get messages of 2 users", error);
            onNext([]);
          })
      }, (error) => {
        SLog.log(LogType.Error, "getMessagesOfTowUsers", "cannot get messages of 2 users", error);
        onNext([]);
      });
  }

  public static getMessagesOfGroup(classId: number, onNext: (messages: Message[]) => void) {
    const url = this.BASE_URL + "/group/" + classId;

    SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
      (token) => {
        axios.get<Response>(url,
          {
            headers: {
              Accept: "application/json",
              Authorization: token
            }
          },)
          .then(response => {
            SLog.log(LogType.Warning, "getMessagesOfGroup", response.data?.message || "", response.data.status);
            const messages: Message[] = response.data.data as any[];
            onNext(messages);
          })
          .catch(error => {
            SLog.log(LogType.Error, "getMessagesOfGroup", "cannot get messages of group", error);
            onNext([]);
          })
      }, (error) => {
        SLog.log(LogType.Error, "getMessagesOfGroup", "cannot get messages of group", error);
        onNext([]);
      });
  }

  public static sendMessage(message: Message, onNext: (result: boolean) => void, onComplete?: () => void, inGroup?: boolean) {
    const url = this.BASE_URL + (inGroup ? "/group": "");

    SLog.log(LogType.Info, "sendMessage", "check url", url);

    SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
      (token) => {
        axios.post<Response>(url, {
          message: message
        }, {
          headers: {
            Accept: "application/json",
            Authorization: token
          }
        })
          .then(response => {
            SLog.log(LogType.Info, "sendMessage", response.data.message, response.data.status);
            onNext(response.data.status_code === 200);
          })
          .catch(error => {
            SLog.log(LogType.Error, "sendMessage", "cannot send message", error);
            onNext(false);
          })
          .finally(onComplete);
      }, (error) => {
        SLog.log(LogType.Error, "sendMessage", "cannot send message", error);
        onNext(false);
        onComplete && onComplete();
      });
  }

  public static sendImageMessage(uri: string, onNext: (path: string) => void, onComplete?: () => void) {
    const url = this.BASE_URL + "/image";

    const formData = new FormData();
    formData.append("file", {
      uri: uri,
      name: "image.jpg",
      type: "image/jpg"
    } as any);

    SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
      (token) => {
        axios.post<Response>(url, formData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: token
          }
        })
          .then(response => {
            SLog.log(LogType.Info, "sendImageMessage", response.data.message, response.data.status);

            SLog.log(LogType.Warning, "sendImageMessage", "path", (response.data.data as any)?.path ?? "");
            onNext((response.data.data as any)?.path ?? "");
          })
          .catch(error => {
            SLog.log(LogType.Error, "sendImageMessage", "cannot send message", error);
            onNext("");
          })
          .finally(onComplete);
      }, (error) => {
        SLog.log(LogType.Error, "sendImageMessage", "cannot send message", error);
        onNext("");
        onComplete && onComplete();
      });
  }

  public static markAsRead(fromUserId: string, toUserId: string, onNext: () => void) {
    const url = this.BASE_URL + "/two-users/mark-as-read";

    SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
      (token) => {
        axios.put<Response>(url, {
          sender: {
            id: fromUserId
          },
          receiver: {
            id: toUserId
          }
        }, {
          headers: {
            Accept: "application/json",
            Authorization: token
          }
        })
          .then(response => {
            SLog.log(LogType.Info, "markAsRead", response.data.message, response.data.status);
          })
          .catch(error => {
            SLog.log(LogType.Error, "markAsRead", "cannot mark as read messages", error);
          })
          .finally(onNext);
      }, (error) => {
        SLog.log(LogType.Error, "markAsRead", "cannot mark as read messages", error);
        onNext();
      });
  }

  public static markAsReadInGroup(userId: string, classId: number, onNext: () => void) {
    const url = this.BASE_URL + "/group/mark-as-read";

    SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
      (token) => {
        axios.put<Response>(url, {
          class: {
            id: classId
          },
          receiver: {
            id: userId
          },
        }, {
          headers: {
            Accept: "application/json",
            Authorization: token
          }
        })
          .then(response => {
            SLog.log(LogType.Info, "markAsReadInGroup", response.data.message, response.data.status);
          })
          .catch(error => {
            SLog.log(LogType.Error, "markAsReadInGroup", "cannot mark as read messages", error);
          })
          .finally(onNext);
      }, (error) => {
        SLog.log(LogType.Error, "markAsReadInGroup", "cannot mark as read messages", error);
        onNext();
      });
  }

  public static markAsReadNotifications(onNext: () => void) {
    const url = this.BASE_URL + "/notifications/mark-as-read";

    SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
      (token) => {
        axios.put<Response>(url, {}, {
          headers: {
            Accept: "application/json",
            Authorization: token
          }
        })
          .then(response => {
            SLog.log(LogType.Info, "markAsRead", response.data.message, response.data.status);
          })
          .catch(error => {
            SLog.log(LogType.Error, "markAsRead", "cannot mark as read messages", error);
          })
          .finally(onNext);
      }, (error) => {
        SLog.log(LogType.Error, "markAsRead", "cannot mark as read messages", error);
        onNext();
      });
  }

  public static deleteMessage(message: Message, onNext: (result: boolean) => void, onComplete?: () => void, inGroup? : boolean) {
    const url = this.BASE_URL + (inGroup ? "/group": "");

    const data = {message};

    SLog.log(LogType.Info, "deleteMessage", "check data", {data, url});

    SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
      (token) => {
        axios.put<Response>(url, data, {
          headers: {
            Accept: "application/json",
            Authorization: token
          }
        })
          .then(response => {
            SLog.log(LogType.Info, "deleteMessage", response.data.message, response.data.status);
            onNext(response.data.status_code === 200);
          })
          .catch(error => {
            SLog.log(LogType.Error, "deleteMessage", "cannot delete message", error);
            onNext(false);
          })
          .finally(onComplete);
      }, (error) => {
        SLog.log(LogType.Error, "deleteMessage", "cannot delete message", error);
        onComplete && onComplete();
      });
  }
}