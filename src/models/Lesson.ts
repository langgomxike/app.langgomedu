import LessonDTO from "../dtos/LessonDTO";
import Class from "./Class";

export default class Lesson {
    public id: number;
    public class: Class | undefined;
    public day: number; //[note: "thứ, monday: 0, ..."]
    public startedAt: Date;
    public duration: Date;
    public isOnline: boolean;  //[note: "hình thức học, online: 1, offline: 0"]
    public note: string;

    constructor(id = -1, _class: Class | undefined = undefined, day = 0, startedAt = new Date(), duration = new Date(), isOnline = false, note = "") {
        this.id = id;
        this.class = _class;
        this.day = day;
        this.startedAt = startedAt;
        this.duration = duration;
        this.isOnline = isOnline;
        this.note = note;
    }

    fromDTO(lessonDTO: LessonDTO): void {
        this.id = lessonDTO.id;
        this.class = lessonDTO.class && new Class().fromDTO(lessonDTO.class) || undefined;
        this.day = lessonDTO.day;
        this.startedAt = new Date(lessonDTO.started_at);
        this.duration = new Date(lessonDTO.duration);
        this.isOnline = lessonDTO.isOnline;
        this.note = lessonDTO.note;
    }
}