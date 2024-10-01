import ClassDTO from "../dtos/ClassDTO";
import ClassLevel from "./ClassLevel";
import Major from "./Major";
import User from "./User";

export default class Class {
    public id: number;
    public title: string;
    public description: string;
    public major: Major | undefined;
    public tutor: User | undefined;
    public author: User | undefined;
    public price: number;
    public classCreationFee: number;
    public classLevel: ClassLevel | undefined;
    public maxLearners: number;
    public startedAt: Date;
    public endedAt: Date;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(id = -1, title = "", description = "", major: Major | undefined = undefined, tutor: User | undefined = undefined, author: User | undefined = undefined, price = 0, classCreationFee = 0, classLevel: ClassLevel | undefined = undefined, maxLearners = 0, startedAt = new Date(), endedAt = new Date(), createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.major = major;
        this.tutor = tutor;
        this.author = author;
        this.price = price;
        this.classCreationFee = classCreationFee;
        this.classLevel = classLevel;
        this.maxLearners = maxLearners;
        this.startedAt = startedAt;
        this.endedAt = endedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    fromDTO(classDTO: ClassDTO): void {
        this.id = classDTO.id;
        this.title = classDTO.title;
        this.description = classDTO.description;
        this.major = classDTO.major && new Major().fromDTO(classDTO.major) || undefined;
        this.tutor = classDTO.tutor && new User().fromDTO(classDTO.tutor) || undefined;
        this.author = classDTO.author && new User().fromDTO(classDTO.author) || undefined;
        this.price = classDTO.price;
        this.classCreationFee = classDTO.class_creation_fee;
        this.classLevel = classDTO.class_level && new ClassLevel().fromDTO(classDTO.class_level) || undefined;
        this.maxLearners = classDTO.max_learners;
        this.startedAt = new Date(classDTO.started_at);
        this.endedAt = new Date(classDTO.ended_at);
        this.createdAt = new Date(classDTO.created_at);
        this.updatedAt = new Date(classDTO.updated_at);
    }
}