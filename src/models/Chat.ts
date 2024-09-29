import Message from "./Message";
import User from "./User";

export default class Chat {
    public user: User;
    public newestMessage: Message | null;

    constructor() {
        this.user = new User();
        this.newestMessage = new Message();
    }
}