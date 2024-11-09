import Class from "./Class";

export default class Lesson {
    public id: number;
    public class: Class | undefined;
    public day: number; //[note: "thứ, monday: 0, ..."]
    public started_at: Date;
    public duration: Date;
    public is_online: boolean;  //[note: "hình thức học, online: 1, offline: 0"]
    public note: string;

    constructor(id = -1, _class: Class | undefined = undefined, day = 0, startedAt = new Date(), duration = new Date(), isOnline = false, note = "") {
        this.id = id;
        this.class = _class;
        this.day = day;
        this.started_at = startedAt;
        this.duration = duration;
        this.is_online = isOnline;
        this.note = note;
    }
}