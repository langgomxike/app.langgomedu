import Lesson from "../models/Lesson";
import ClassDTO from "./ClassDTO";

export default class LessonDTO {
    public id: number;
    public class: ClassDTO | undefined;
    public day: number; //[note: "thứ, monday: 0, ..."]
    public started_at: number
    public duration: number;
    public type: boolean;  //[note: "hình thức học, online: 1, offline: 0"]
    public note: string;

    constructor(lesson: Lesson) {
        this.id = lesson.id;
        this.class = lesson.class && new ClassDTO(lesson.class) || undefined;
        this.day = lesson.day;
        this.started_at = lesson.startedAt.getTime();
        this.duration = lesson.duration.getTime();
        this.type = lesson.type;
        this.note = lesson.note;
    }
}