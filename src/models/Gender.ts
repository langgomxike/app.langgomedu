import GenderDTO from "../dtos/GenderDTO";

export default class Gender {
    public id: number;
    public gender: string;

    constructor(id = -1, gender = "") {
        this.id = id;
        this.gender = gender;
    }

    fromDTO(genderDTO: GenderDTO): void {
        this.id = genderDTO.id;
        this.gender = genderDTO.gender;
    }
}