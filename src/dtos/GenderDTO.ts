import Gender from './../models/Gender';
export default class GenderDTO {
    public id: number;
    public gender: string;

    constructor(gender: Gender) {
        this.id = gender.id;
        this.gender = gender.gender;
    }
}