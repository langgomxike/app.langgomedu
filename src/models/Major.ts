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
        this.vnName = majorDTO.vnName;
        this.jaName = majorDTO.jaName;
        this.enName = majorDTO.enName;
    }
}