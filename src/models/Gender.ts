import GenderDTO from "../dtos/GenderDTO";

export default class Gender {
    public id: number;
    public vnGender: string;
    public enGender: string;
    public jaGender: string;

    constructor(id = -1, vnGender = "", enGender = "", jaGender = "") {
        this.id = id;
        this.vnGender = vnGender;
        this.enGender = enGender;
        this.jaGender = jaGender;
    }

    fromDTO(genderDTO: GenderDTO): void {
        this.id = genderDTO.id;
        this.vnGender = genderDTO.vnGender;
        this.enGender = genderDTO.enGender;
        this.jaGender = genderDTO.jaGender;
    }
}