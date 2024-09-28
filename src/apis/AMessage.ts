import Chat from "../models/Chat";
import File from "../models/File";
import Message, { MessageType } from "../models/Message";
import User from "../models/User";

export default class AMessage {
    public static getContactsOfUser(userId: number, onNext: (users: User[]) => void) {
        const users = [];

        for (let i = 0; i < 10; i++) {
            const u = new User(i, "User " + i);
            u.email = "abc" + i + "@gmail.com";
            u.phoneNumber = "012345678" + i;
            users.push(u);
        }

        onNext(users);
    }

    public static getChatsOfUser(userId: number, onNext: (chats: Chat[]) => void) {
        const chats = [];

        for (let i = 0; i < 20; i++) {
            const chat = new Chat();

            chat.newestMessage = new Message(i, "Message  " + i, MessageType.TEXT);
            chat.newestMessage.toUserAsRead = Math.random() > 0.5;

            chat.user = new User(i, "User " + i);

            chats.push(chat);
        }

        onNext(chats);
    }

    public static getMessagesOfTowUsers(fromUserId: number, toUserId: number, onNext: (messages: Message[]) => void) {
        const messages = [];

        for (let i = 0; i < 20; i++) {
            const message = new Message(i, "Message " + i, MessageType.IMAGE);

            message.file = new File(i, "File " + i, "https://th.bing.com/th/id/OIP.GX7hC-bOWv5fybDQutnf-wHaDR?rs=1&pid=ImgDetMain", 100, 200);

            if (i % 3 === 1) {
                message.replyToMessage = new Message(i, "Reply Message " + i, MessageType.FILE);
                message.replyToMessage.file = new File(i, "File " + i, "https://th.bing.com/th/id/OIP.GX7hC-bOWv5fybDQutnf-wHaDR?rs=1&pid=ImgDetMain", 100, 200);
            }

            messages.push(message);
        }

        onNext(messages);
    }
}