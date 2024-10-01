import Education from "../models/Education";
import UserDTO from "./UserDTO";

export default class EducationDTO {
    public id: number;
    public user: UserDTO | undefined;
    public title: string;
    public description: string;
    public started_at: number;
    public ended_at: number;

    constructor(education: Education) {
        this.id = education.id;
        this.user = education.user && new UserDTO(education.user) || undefined;
        this.title = education.title;
        this.description = education.description;
        this.started_at = education.startedAt.getTime();
        this.ended_at = education.endedAt.getTime();
    }
}