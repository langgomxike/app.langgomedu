import File from "./File";
import User from "./User";

export enum MessageType {
    TEXT = "TEXT",
    FILE = "FILE",
    IMAGE = "IMAGE",
}

export default class Message {
    public id: number;
    public fromUser: User;
    public toUser: User;
    public content: string;
    public file: File;
    public messageType: string;
    public createdAt: number;
    public replyToMessage: Message | undefined;
    public fromUserStatus: boolean;
    public toUserStatus: boolean;
    public fromUserAsRead: boolean;
    public toUserAsRead: boolean;

    constructor(id = -1, content = "", messageType = "", createdAt = new Date().getTime(), fromUserStatus = true, toUserStatus = true) {
        this.id = id;
        this.content = content;
        this.messageType = messageType;
        this.createdAt = createdAt;
        this.fromUserStatus = fromUserStatus;
        this.toUserStatus = toUserStatus;
        this.file = new File();
        this.fromUser = new User();
        this.toUser = new User();
        this.replyToMessage = undefined;
        this.fromUserAsRead = false;
        this.toUserAsRead = false;
    }
}