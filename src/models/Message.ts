import MessageDTO from "../dtos/MessageDTO";
import File from "./File";
import MessageType from "./MessageType";
import User from "./User";

export default class Message {
    public id: number;
    public fromUser: User | undefined;
    public toUser: User | undefined;
    public content: string;
    public file: File | undefined;
    public type: MessageType | undefined;
    public createdAt: Date;
    public replyToMessage: Message | undefined;
    public fromUserStatus: boolean;
    public toUserStatus: boolean;
    public asRead: boolean;


    constructor(id = -1, fromUser: User | undefined = undefined, toUser: User | undefined = undefined, content = "", file: File | undefined, type: MessageType | undefined, createdAt = new Date(), replyToMessage: Message | undefined, fromUserStatus = true, toUserStatus = true, asRead = false) {
        this.id = id;
        this.content = content;
        this.type = type;
        this.createdAt = createdAt;
        this.file = file;
        this.fromUser = fromUser;
        this.toUser = toUser;
        this.replyToMessage = replyToMessage;
        this.fromUserStatus = fromUserStatus;
        this.toUserStatus = toUserStatus;
        this.asRead = asRead;
    }

    fromDTO(messageDTO: MessageDTO): void {
        this.id = messageDTO.id;
        this.content = messageDTO.content;
        this.type = messageDTO.type && new MessageType().fromDTO(messageDTO.type) || undefined;
        this.createdAt = new Date(messageDTO.created_at);
        this.file = messageDTO.file && new File().fromDTO(messageDTO.file) || undefined;
        this.fromUser = messageDTO.from_user && new User().fromDTO(messageDTO.from_user) || undefined;
        this.toUser = messageDTO.to_user && new User().fromDTO(messageDTO.to_user) || undefined;
        this.replyToMessage = messageDTO.reply_to_message && new Message(-1, undefined, undefined, "", undefined, undefined, new Date(), undefined).fromDTO(messageDTO.reply_to_message) || undefined;
        this.fromUserStatus = messageDTO.from_user_status;
        this.toUserStatus = messageDTO.to_user_status;
        this.asRead = messageDTO.as_read;
    }
}