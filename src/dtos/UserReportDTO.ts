import UserReport from "../models/UserReport";
import UserDTO from "./UserDTO";

export default class UserReportDTO {
    public id: number;
    public from_user: UserDTO | undefined;
    public to_user: UserDTO | undefined;
    public content: string;
    public created_at: number;

    constructor(report: UserReport) {
        this.id = report.id;
        this.from_user = report.fromUser && new UserDTO(report.fromUser) || undefined;
        this.to_user = report.toUser && new UserDTO(report.toUser) || undefined;
        this.content = report.content;
        this.created_at = report.createdAt.getTime();
    }
}