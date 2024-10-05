import Chat from "../models/Chat";
import File from "../models/File";
import Message from "../models/Message";
import MessageType from "../models/MessageType";
import User from "../models/User";

export default class AMessage {

  // updating....
  //   public static getContactsOfUser(userId: number, onNext: (users: User[]) => void) {
  //       const users = [];

  //       for (let i = 0; i < 10; i++) {
  //           const u = new User(i, "User " + i);
  //           u.email = "abc" + i + "@gmail.com";
  //           u.phoneNumber = "012345678" + i;
  //           users.push(u);
  //       }

  //       onNext(users);
  //   }

  //   public static getChatsOfUser(userId: number, onNext: (chats: Chat[]) => void) {
  //       const chats = [];

  //       for (let i = 0; i < 20; i++) {
  //           const chat = new Chat();

  //           chat.newestMessage = new Message(i, "Message  " + i, MessageType.TEXT);
  //           chat.newestMessage.toUserAsRead = Math.random() > 0.5;

  //           chat.user = new User(i, "User " + i);

  //           chats.push(chat);
  //       }

  //       onNext(chats);
  //   }

  //   public static getMessagesOfTowUsers(fromUserId: number, toUserId: number, onNext: (messages: Message[]) => void) {
  //       let messages = [];

  //       const a = `
  //       [{
  //   "id": 1,
  //   "fromUser": {
  //     "id": 1,
  //     "fullName": "Alice Johnson",
  //     "avatar": "alice_avatar.png",
  //     "email": "alice.johnson@example.com",
  //     "phoneNumber": "+1234567890"
  //   },
  //   "toUser": {
  //     "id": 2,
  //     "fullName": "Bob Smith",
  //     "avatar": "bob_avatar.png",
  //     "email": "bob.smith@example.com",
  //     "phoneNumber": "+0987654321"
  //   },
  //   "content": "Hey Bob, how are you?",
  //   "file": {
  //     "id": -1,
  //     "name": "",
  //     "path": "",
  //     "capacity": 0,
  //     "imageWith": 0,
  //     "imageHeight": 0
  //   },
  //   "messageType": "TEXT",
  //   "createdAt": 1695908415000,
  //   "replyToMessage": null,
  //   "fromUserStatus": true,
  //   "toUserStatus": true,
  //   "fromUserAsRead": false,
  //   "toUserAsRead": false
  // },
  // {
  //   "id": 2,
  //   "fromUser": {
  //     "id": 2,
  //     "fullName": "Bob Smith",
  //     "avatar": "bob_avatar.png",
  //     "email": "bob.smith@example.com",
  //     "phoneNumber": "+0987654321"
  //   },
  //   "toUser": {
  //     "id": 1,
  //     "fullName": "Alice Johnson",
  //     "avatar": "alice_avatar.png",
  //     "email": "alice.johnson@example.com",
  //     "phoneNumber": "+1234567890"
  //   },
  //   "content": "I'm doing well, Alice! What about you?",
  //   "file": {
  //     "id": -1,
  //     "name": "",
  //     "path": "",
  //     "capacity": 0,
  //     "imageWith": 0,
  //     "imageHeight": 0
  //   },
  //   "messageType": "TEXT",
  //   "createdAt": 1695908500000,
  //   "replyToMessage": {
  //     "id": 1
  //   },
  //   "fromUserStatus": true,
  //   "toUserStatus": true,
  //   "fromUserAsRead": false,
  //   "toUserAsRead": true
  // },
  // {
  //   "id": 3,
  //   "fromUser": {
  //     "id": 1,
  //     "fullName": "Alice Johnson",
  //     "avatar": "alice_avatar.png",
  //     "email": "alice.johnson@example.com",
  //     "phoneNumber": "+1234567890"
  //   },
  //   "toUser": {
  //     "id": 2,
  //     "fullName": "Bob Smith",
  //     "avatar": "bob_avatar.png",
  //     "email": "bob.smith@example.com",
  //     "phoneNumber": "+0987654321"
  //   },
  //   "content": "I'm good! Did you finish that report?",
  //   "file": {
  //     "id": -1,
  //     "name": "",
  //     "path": "",
  //     "capacity": 0,
  //     "imageWith": 0,
  //     "imageHeight": 0
  //   },
  //   "messageType": "TEXT",
  //   "createdAt": 1695908600000,
  //   "replyToMessage": null,
  //   "fromUserStatus": true,
  //   "toUserStatus": true,
  //   "fromUserAsRead": false,
  //   "toUserAsRead": false
  // },
  // {
  //   "id": 4,
  //   "fromUser": {
  //     "id": 2,
  //     "fullName": "Bob Smith",
  //     "avatar": "bob_avatar.png",
  //     "email": "bob.smith@example.com",
  //     "phoneNumber": "+0987654321"
  //   },
  //   "toUser": {
  //     "id": 1,
  //     "fullName": "Alice Johnson",
  //     "avatar": "alice_avatar.png",
  //     "email": "alice.johnson@example.com",
  //     "phoneNumber": "+1234567890"
  //   },
  //   "content": "Yes, I sent it yesterday.",
  //   "file": {
  //     "id": -1,
  //     "name": "",
  //     "path": "",
  //     "capacity": 0,
  //     "imageWith": 0,
  //     "imageHeight": 0
  //   },
  //   "messageType": "TEXT",
  //   "createdAt": 1695908700000,
  //   "replyToMessage": {
  //     "id": 3
  //   },
  //   "fromUserStatus": true,
  //   "toUserStatus": true,
  //   "fromUserAsRead": false,
  //   "toUserAsRead": false
  // },
  // {
  //   "id": 5,
  //   "fromUser": {
  //     "id": 1,
  //     "fullName": "Alice Johnson",
  //     "avatar": "alice_avatar.png",
  //     "email": "alice.johnson@example.com",
  //     "phoneNumber": "+1234567890"
  //   },
  //   "toUser": {
  //     "id": 2,
  //     "fullName": "Bob Smith",
  //     "avatar": "bob_avatar.png",
  //     "email": "bob.smith@example.com",
  //     "phoneNumber": "+0987654321"
  //   },
  //   "content": "Great! I'll review it now.",
  //   "file": {
  //     "id": -1,
  //     "name": "",
  //     "path": "",
  //     "capacity": 0,
  //     "imageWith": 0,
  //     "imageHeight": 0
  //   },
  //   "messageType": "TEXT",
  //   "createdAt": 1695908800000,
  //   "replyToMessage": null,
  //   "fromUserStatus": true,
  //   "toUserStatus": true,
  //   "fromUserAsRead": false,
  //   "toUserAsRead": false
  // },
  // {
  //   "id": 6,
  //   "fromUser": {
  //     "id": 3,
  //     "fullName": "Charlie Brown",
  //     "avatar": "charlie_avatar.png",
  //     "email": "charlie.brown@example.com",
  //     "phoneNumber": "+1222333444"
  //   },
  //   "toUser": {
  //     "id": 1,
  //     "fullName": "Alice Johnson",
  //     "avatar": "alice_avatar.png",
  //     "email": "alice.johnson@example.com",
  //     "phoneNumber": "+1234567890"
  //   },
  //   "content": "Can you check the new files I uploaded?",
  //   "file": {
  //     "id": 1,
  //     "name": "report.pdf",
  //     "path": "/uploads/report.pdf",
  //     "capacity": 2048,
  //     "imageWith": 0,
  //     "imageHeight": 0
  //   },
  //   "messageType": "FILE",
  //   "createdAt": 1695908900000,
  //   "replyToMessage": null,
  //   "fromUserStatus": true,
  //   "toUserStatus": true,
  //   "fromUserAsRead": false,
  //   "toUserAsRead": false
  // },
  // {
  //   "id": 7,
  //   "fromUser": {
  //     "id": 1,
  //     "fullName": "Alice Johnson",
  //     "avatar": "alice_avatar.png",
  //     "email": "alice.johnson@example.com",
  //     "phoneNumber": "+1234567890"
  //   },
  //   "toUser": {
  //     "id": 3,
  //     "fullName": "Charlie Brown",
  //     "avatar": "charlie_avatar.png",
  //     "email": "charlie.brown@example.com",
  //     "phoneNumber": "+1222333444"
  //   },
  //   "content": "Sure, I'll look at them today.",
  //   "file": {
  //     "id": -1,
  //     "name": "",
  //     "path": "",
  //     "capacity": 0,
  //     "imageWith": 0,
  //     "imageHeight": 0
  //   },
  //   "messageType": "TEXT",
  //   "createdAt": 1695909000000,
  //   "replyToMessage": {
  //     "id": 6
  //   },
  //   "fromUserStatus": true,
  //   "toUserStatus": true,
  //   "fromUserAsRead": false,
  //   "toUserAsRead": false
  //   }]
  //       `;


  //       // for (let i = 1; i < 20; i++) {
  //       //     const message = new Message(i, "Message " + i, MessageType.TEXT);

  //       //     message.file = new File(i, "File " + i, "https://th.bing.com/th/id/OIP.GX7hC-bOWv5fybDQutnf-wHaDR?rs=1&pid=ImgDetMain", 100, 200);

  //       //     messages.push(message);
  //       // }

  //       // for (let i = 1; i < 15; i += 3) {
  //       //     messages[i + 2].file = new File(i, "File " + i, "https://th.bing.com/th/id/OIP.GX7hC-bOWv5fybDQutnf-wHaDR?rs=1&pid=ImgDetMain", 100, 200);
  //       //     messages[i].replyToMessage = messages[i + 2];
  //       // }

  //       messages = JSON.parse(a) as Message[];

  //       onNext(messages);
  //   }
}