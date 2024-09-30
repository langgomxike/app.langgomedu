import ClassLevelDTO from "../dtos/ClassLevelDTO";

export default class ClassLevel {
    public id: number;
    public vnName: string;
    public jaName: string;
    public enName: string;

    constructor(id = -1, vnName = "", jaName = "", enName = "") {
        this.id = id;
        this.vnName = vnName;
        this.jaName = jaName;
        this.enName = enName;
    }

    fromDTO(levelDTO: ClassLevelDTO): void {
        this.id = levelDTO.id;
        this.vnName = levelDTO.vn_name;
        this.enName = levelDTO.en_name;
        this.jaName = levelDTO.ja_name;
    }
}