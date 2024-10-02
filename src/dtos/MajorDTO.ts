import Major from "../models/Major";

export default class MajorDTO {
    public id: number;
    public vn_name: string;
    public ja_name: string;
    public en_name: string;

    constructor(major: Major) {
        this.id = major.id;
        this.vn_name = major.vnName;
        this.ja_name = major.jaName;
        this.en_name = major.enName;
    }
}