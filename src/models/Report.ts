import Class from "./Class";
import ReportLevel from "./ReportLevel";
import User from "./User";

export default class Report {
    public id: number;
    public reporter: User | undefined;
    public reportee: User | undefined;
    public class: Class | undefined;
    public content: string;
    public reason: string;
    public report_level: number;
    public created_at: number;

    constructor(
        id = -1,
        reporter: User | undefined = undefined,
        reportee: User | undefined = undefined,
        classObj: Class | undefined = undefined,
        content = "",
        reason = "",
        report_level: 4,
        createdAt = new Date().getTime()
    ) {
        this.id = id;
        this.reporter = reporter;
        this.reportee = reportee;
        this.class = classObj;
        this.content = content;
        this.reason = reason;
        this.report_level = report_level;
        this.created_at = createdAt;
    }
}
