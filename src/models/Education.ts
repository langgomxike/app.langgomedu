import User from "./User";

export default class Education {
    public id: number;
    public user: User | undefined;
    public icon: File;
    public title: string;
    public description: string;
    public startedAt: Date;
    public endedAt: Date;

    constructor(id = -1, user: User | undefined = undefined, icon: File, title = "", description = "", startedAt = new Date(), endedAt = new Date()) {
        this.id = id;
        this.user = user;
        this.icon = icon,
        this.title = title;
        this.description = description;
        this.startedAt = startedAt;
        this.endedAt = endedAt;
    }
}