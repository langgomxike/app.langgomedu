import EducationDTO from "../dtos/EducationDTO";
import User from "./User";

export default class Education {
    public id: number;
    public user: User | undefined;
    public title: string;
    public description: string;
    public startedAt: Date;
    public endedAt: Date;

    constructor(id = -1, user: User | undefined = undefined, title = "", description = "", startedAt = new Date(), endedAt = new Date()) {
        this.id = id;
        this.user = user;
        this.title = title;
        this.description = description;
        this.startedAt = startedAt;
        this.endedAt = endedAt;
    }

    fromDTO(educationDTO: EducationDTO): void {
        this.id = educationDTO.id;
        this.user = educationDTO.user && new User().fromDTO(educationDTO.user) || undefined;
        this.title = educationDTO.title;
        this.description = educationDTO.description;
        this.startedAt = new Date(educationDTO.started_at);
        this.endedAt = new Date(educationDTO.ended_at);
    }
}