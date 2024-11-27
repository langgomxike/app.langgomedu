
import User from "./User";

export default class UserReport {
    public id: number;
    public reportee: User | undefined;
    public reporter: User | undefined;
    public content: string;
    public created_at: Date;
    public status :string;

    constructor(
        id: number = -1, 
        reportee: User | undefined = undefined, 
        reporter: User | undefined = undefined, 
        content: string = "", 
        created_at: Date = new Date(), 
        status: string = "pending" // Thêm trạng thái mặc định là "pending"
    ) {
        this.id = id;
        this.reportee = reportee;
        this.reporter = reporter;
        this.content = content;
        this.created_at = created_at;
        this.status = status;
    }
}