
import User from "./User";

export default class UserReport {
    public report_id: number;
    public from_user: User | undefined;
    public to_user: User | undefined;
    public report_content: string;
    public reports_before: string;
    public created_at: Date;

    constructor(id = -1, from_user: User | undefined = undefined, to_user: User | undefined = undefined, report_content = "",reports_before = "", created_at = new Date()) {
        this.report_id = id;
        this.from_user = from_user;
        this.to_user = to_user;
        this.report_content = report_content;
        this.created_at = created_at;
        this.reports_before = reports_before;
    }

   
}