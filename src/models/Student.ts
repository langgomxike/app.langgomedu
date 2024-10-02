import StudentDTO from "../dtos/StudentDTO";
import Gender from "./Gender";
import User from "./User";

export default class Student {
    public id: number;
    public fullName: string;
    public learningCapacity: string;
    public gender: Gender | undefined;
    public note: string;
    public user: User | undefined;

    constructor(id = -1, fullName = "", learningCapacity = "", gender: Gender | undefined = undefined, note = "", user: User | undefined = undefined) {
        this.id = id;
        this.fullName = fullName;
        this.learningCapacity = learningCapacity;
        this.gender = gender;
        this.note = note;
        this.user = user;
    }

    fromDTO(studentDTO: StudentDTO): void {
        this.id = studentDTO.id;
        this.fullName = studentDTO.full_name;
        this.learningCapacity = studentDTO.learning_capacity;
        this.gender = studentDTO.gender && new Gender().fromDTO(studentDTO.gender) || undefined;
        this.note = studentDTO.note;
        this.user = studentDTO.user && new User().fromDTO(studentDTO.user) || undefined;
    }
}