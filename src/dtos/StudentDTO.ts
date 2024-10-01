import Student from "../models/Student";
import GenderDTO from "./GenderDTO";
import UserDTO from "./UserDTO";

export default class StudentDTO {
    public id: number;
    public full_name: string;
    public learning_capacity: string;
    public gender: GenderDTO | undefined;
    public note: string;
    public user: UserDTO | undefined;

    constructor(student: Student) {
        this.id = student.id;
        this.full_name = student.fullName;
        this.learning_capacity = student.learningCapacity;
        this.gender = student.gender && new GenderDTO(student.gender) || undefined;
        this.note = student.note;
        this.user = student.user && new UserDTO(student.user) || undefined;
    }
}