import Class from "../models/Class";
import ClassLevelDTO from "./ClassLevelDTO";
import MajorDTO from "./MajorDTO";
import UserDTO from "./UserDTO";

export default class ClassDTO {
    public id: number;
    public title: string;
    public description: string;
    public major: MajorDTO | undefined;
    public tutor: UserDTO | undefined;
    public author: UserDTO | undefined;
    public price: number;
    public class_creation_fee: number;
    public class_level: ClassLevelDTO | undefined;
    public max_learners: number;
    public started_at: number;
    public ended_at: number;
    public created_at: number;
    public updated_at: number;

    constructor(_class: Class) {
        this.id = _class.id;
        this.title = _class.title;
        this.description = _class.description;
        this.major = _class.major && new MajorDTO(_class.major) || undefined;
        this.tutor = _class.tutor && new UserDTO(_class.tutor) || undefined;
        this.author = _class.author && new UserDTO(_class.author) || undefined;
        this.price = _class.price;
        this.class_creation_fee = _class.classCreationFee;
        this.max_learners = _class.maxLearners;
        this.started_at = _class.startedAt.getTime();
        this.ended_at = _class.endedAt.getTime();
        this.created_at = _class.createdAt.getTime();
        this.updated_at = _class.updatedAt.getTime();
    }
}