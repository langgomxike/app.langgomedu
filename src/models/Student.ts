
import Gender from "./Gender";
import User from "./User";

export default class Student {
    public id: number;
    public full_name: string;
    public learning_capacity: string;
    public gender: Gender | undefined;
    public note: string;
    public user: User | undefined;

    constructor(id = -1, full_name = "", learning_capacity = "", gender: Gender | undefined = undefined, note = "", user: User | undefined = undefined) {
        this.id = id;
        this.full_name = full_name;
        this.learning_capacity = learning_capacity;
        this.gender = gender;
        this.note = note;
        this.user = user;
    }
}