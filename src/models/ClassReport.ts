import ClassReportDTO from "../dtos/ClassReportDTO";
import Class from "./Class";
import User from "./User";

export default class ClassReport {
    public id: number;
    public class: Class | undefined //[note: "author của class là người bị báo cáo"]
    public user: User | undefined; //[note: "user báo cáo khác author"]
    public content: string;
    public createdAt: Date;

    constructor(id = -1, _class: Class | undefined = undefined, user: User | undefined = undefined, content = "", createdAt = new Date()) {
        this.id = id;
        this.user = user;
        this.content = content;
        this.class = _class;
        this.createdAt = createdAt;
    }

    fromDTO(reportDTO: ClassReportDTO): void {
        this.id = reportDTO.id;
        this.user = reportDTO.user && new User().fromDTO(reportDTO.user) || undefined;
        this.class = reportDTO.class && new Class().fromDTO(reportDTO.class) || undefined;
        this.content = reportDTO.content;
        this.createdAt = new Date(reportDTO.created_at);
    }
}