import Chat from "../models/Chat";
import Message from "../models/Message";
import Response from "../models/Response";
import User from "../models/User";
import Config from "../configs/Config";
import axios from "axios";
import SAsyncStorage, {AsyncStorageKeys} from "../services/SAsyncStorage";
import SLog, {LogType} from "../services/SLog";

export default class AMessage {
    private static BASE_URL = '/messages';

    public static getContactsOfUser(onNext: (users: User[]) => void) {
        const url = Config.API_BASE_URL + this.BASE_URL + "/contacts";

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

    public static getChatsOfUser(onNext: (chats: Chat[]) => void) {
        const url = Config.API_BASE_URL + this.BASE_URL + "/inboxes";

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
                        const chats: Chat[] = response.data.data as any[];
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

    public static getMessagesOfTowUsers(fromUserId: string, toUserId: string, onNext: (messages: Message[]) => void) {
        const url = Config.API_BASE_URL + this.BASE_URL + "/two-users";

        // SLog.log(LogType.Warning, "getMessagesOfTowUsers", "check ids", {fromUserId, toUserId});

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

    public static sendMessage(message: Message, onNext: (result: boolean) => void) {
        const url = Config.API_BASE_URL + this.BASE_URL;

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
            }, (error) => {
                SLog.log(LogType.Error, "sendMessage", "cannot send message", error);
                onNext(false);
            });
    }

    public static markAsRead(fromUserId: string, toUserId: string, messages: Message[], onNext: () => void) {
        const url = Config.API_BASE_URL + this.BASE_URL + "/two-users/mark-as-read";

        SAsyncStorage.getData(AsyncStorageKeys.TOKEN,
            (token) => {
                axios.put<Response>(url, {
                    messages: messages,
                    from_user: {
                        id: fromUserId
                    },
                    to_user: {
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

    public static replyMessage(message: Message, onNext: (result: boolean) => void) {
        const url = Config.API_BASE_URL + this.BASE_URL + "/reply";
    }

    public static deleteMessage(message: Message, onNext: (result: boolean) => void) {
        const url = Config.API_BASE_URL + this.BASE_URL + "/delete";

    }
}