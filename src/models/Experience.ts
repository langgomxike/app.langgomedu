import ExperienceDTO from "../dtos/ExperienceDTO";
import Major from "./Major";
import User from "./User";

export default class Experience {
    public id: number;
    public user: User | undefined;
    public title: string;
    public major: Major | undefined;
    public address: string;
    public initial: boolean;// [note: "0: automatically added, 1: initially added"]
    public approved: boolean // [note: "0: waiting to be approved, 1: approved"]
    public startedAt: Date;
    public endedAt: Date;

    constructor(id = -1, user: User | undefined = undefined, title = "", major: Major | undefined = undefined, address = "", initial = true, approved = false, startedAt = new Date(), endedAt = new Date()) {
        this.id = id;
        this.user = user;
        this.title = title;
        this.major = major;
        this.address = address;
        this.initial = initial;
        this.approved = approved;
        this.startedAt = startedAt;
        this.endedAt = endedAt;
    }

    fromDTO(experienceDTO: ExperienceDTO): void {
        this.id = experienceDTO.id;
        this.user = experienceDTO.user && new User().fromDTO(experienceDTO.user) || undefined;
        this.title = experienceDTO.title;
        this.major = experienceDTO.major && new Major().fromDTO(experienceDTO.major) || undefined;
        this.address = experienceDTO.address;
        this.initial = experienceDTO.initial;
        this.approved = experienceDTO.approved;
        this.startedAt = new Date(experienceDTO.started_at);
        this.endedAt = new Date(experienceDTO.ended_at);
    }
}