import ClassLevel from "../models/ClassLevel";

export default class ClassLevelDTO {
    public id: number;
    public vn_name: string;
    public ja_name: string;
    public en_name: string;

    constructor(level: ClassLevel) {
        this.id = level.id;
        this.vn_name = level.vnName;
        this.en_name = level.enName;
        this.ja_name = level.jaName;
    }
}