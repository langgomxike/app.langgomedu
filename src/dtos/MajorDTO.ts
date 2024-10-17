import Major from "../models/Major";

export default class MajorDTO {
    public id: number;
    public vnName: string;
    public enName: string;
    public jaName: string;

    constructor(major: Major) {
        this.id = major.id;
        this.vnName = major.vnName;
        this.enName = major.enName;
        this.jaName = major.jaName;
    }
}