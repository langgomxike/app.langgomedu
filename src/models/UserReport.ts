import UserReportDTO from "../dtos/UserReportDTO";
import User from "./User";

export default class UserReport {
    public id: number;
    public fromUser: User | undefined;
    public toUser: User | undefined;
    public content: string;
    public createdAt: Date;

    constructor(id = -1, fromUser: User | undefined = undefined, toUser: User | undefined = undefined, content = "", createdAt = new Date()) {
        this.id = id;
        this.fromUser = fromUser;
        this.toUser = toUser;
        this.content = content;
        this.createdAt = createdAt;
    }

    fromDTO(reportDTO: UserReportDTO) {
        this.id = reportDTO.id;
        this.fromUser = reportDTO.from_user && new User().fromDTO(reportDTO.from_user) || undefined;
        this.toUser = reportDTO.to_user && new User().fromDTO(reportDTO.to_user) || undefined;
        this.content = reportDTO.content;
        this.createdAt = new Date(reportDTO.created_at);
    }
}