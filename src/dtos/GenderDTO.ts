import Gender from './../models/Gender';
export default class GenderDTO {
    public id: number;
    public vnGender: string; 
    public enGender: string; 
    public jaGender: string; 

    constructor(gender: Gender) {
        this.id = gender.id;
        this.vnGender = gender.vnGender;
        this.enGender = gender.enGender;
        this.jaGender = gender.jaGender;
    }
}