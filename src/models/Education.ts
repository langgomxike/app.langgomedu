import User from "./User";

export default class Education {
    public id: number;
    public user: User | undefined;
    public iconPath: string;
    public title: string;
    public description: string;
    public started_at: Date;
    public ended_at: Date;

    constructor(id = -1, user: User | undefined = undefined, iconPath: string, title = "", description = "", started_at: number, ended_at: number) {
        this.id = id;
        this.user = user;
        this.iconPath = iconPath,
        this.title = title;
        this.description = description;
        this.started_at = new Date(started_at);
        this.ended_at = new Date(ended_at);
    }
}