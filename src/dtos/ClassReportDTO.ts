import ClassReport from "../models/ClassReport";
import ClassDTO from "./ClassDTO";
import UserDTO from "./UserDTO";

export default class ClassReportDTO {
    public id: number;
    public class: ClassDTO | undefined //[note: "author của class là người bị báo cáo"]
    public user: UserDTO | undefined; //[note: "user báo cáo khác author"]
    public content: string;
    public created_at: number;

    constructor(report: ClassReport) {
        this.id = report.id;
        this.class = report.class && new ClassDTO(report.class) || undefined;
        this.user = report.user && new UserDTO(report.user) || undefined;
        this.content = report.content;
        this.created_at = report.createdAt.getTime();
    }
}