import Class from "./Class";
import User from "./User";

export default class Message {
    public id: number;
    public sender: User | undefined;
    public reciever: User | undefined;
    public content: string;
    public ratio: number;
    public class: Class | undefined;
    public created_at: number;
    public as_read: boolean;
    public is_active: boolean;

    constructor(
        id = 0,
        sender: User | undefined = undefined,
        reciever: User | undefined = undefined,
        content = "",
        ratio = 0,
        classObj: Class | undefined = undefined,
        created_at = 0,
        as_read = false,
        is_active = true
    ) {
        this.id = id;
        this.sender = sender;
        this.reciever = reciever;
        this.content = content;
        this.ratio = ratio;
        this.class = classObj;
        this.created_at = created_at;
        this.as_read = as_read;
        this.is_active = is_active;
    }
}
