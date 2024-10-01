import MajorDTO from "../dtos/MajorDTO";

export default class Major {
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

    fromDTO(majorDTO: MajorDTO): void {
        this.id = majorDTO.id;
        this.vnName = majorDTO.vn_name;
        this.jaName = majorDTO.ja_name;
        this.enName = majorDTO.en_name;
    }
}