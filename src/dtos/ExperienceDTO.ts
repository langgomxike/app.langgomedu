import MajorDTO from "./MajorDTO";
import UserDTO from "./UserDTO";
import Experience from './../models/Experience';

export default class ExperienceDTO {
    public id: number;
    public user: UserDTO | undefined;
    public title: string;
    public major: MajorDTO | undefined;
    public address: string;
    public initial: boolean;// [note: "0: automatically added, 1: initially added"]
    public approved: boolean // [note: "0: waiting to be approved, 1: approved"]
    public started_at: number;
    public ended_at: number;

    constructor(experience: Experience) {
        this.id = experience.id;
        this.user = experience.user && new UserDTO(experience.user) || undefined;
        this.title = experience.title;
        this.address = experience.address;
        this.initial = experience.initial;
        this.approved = experience.approved;
        this.started_at = experience.startedAt.getTime();
        this.ended_at = experience.endedAt.getTime();
    }
}