import Message from "./Message";
import User from "./User";

export default class Chat {
    public user: User | undefined;
    public newest_message: Message | undefined;

    constructor(user: User | undefined, message: Message | undefined) {
        this.user = user;
        this.newest_message = message;
    }
}