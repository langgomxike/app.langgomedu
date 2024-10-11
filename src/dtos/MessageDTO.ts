import Message from "../models/Message";
import FileDTO from "./FileDTO";
import MessageTypeDTO from "./MessageTypeDTO";
import UserDTO from "./UserDTO";

export default class MessageDTO {
    public id: number;
    public from_user: UserDTO | undefined;
    public to_user: UserDTO | undefined;
    public content: string;
    public file: FileDTO | undefined;
    public isImage: boolean;
    public created_at: number;
    public reply_to_message: MessageDTO | undefined;
    public from_user_status: boolean;
    public to_user_status: boolean;
    public as_read: boolean;


    constructor(message: Message) {
        this.id = message.id;
        this.content = message.content;
        this.isImage = message.isImage;
        this.created_at = message.createdAt.getTime();
        this.from_user_status = message.fromUserStatus;
        this.to_user_status = message.toUserStatus;
        this.file = message.file && new FileDTO(message.file) || undefined;
        this.from_user = message.fromUser && new UserDTO(message.fromUser) || undefined;
        this.to_user = message.toUser && new UserDTO(message.toUser) || undefined;
        this.reply_to_message = message.replyToMessage && new MessageDTO(message.replyToMessage) || undefined;
        this.from_user_status = message.fromUserStatus;
        this.to_user_status = message.toUserStatus;
        this.as_read = message.asRead;
    }
}