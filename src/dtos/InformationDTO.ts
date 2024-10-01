import GenderDTO from "./GenderDTO";
import UserDTO from "./UserDTO"
import Information from './../models/Information';
import User from "../models/User";

export default class InformationDTO {
    public user: UserDTO | undefined;
    public hometown: string;
    public address1: string;
    public address2: string;
    public address3: string;
    public address4: string;
    public birthday: number;
    public gender: GenderDTO | undefined;
    public point: number;
    public bankingNumber: string;
    public bankingCode: string;

    constructor(information: Information) {
        this.user = information.user && new UserDTO(information.user) || undefined;
        this.hometown = information.hometown;
        this.address1 = information.address1;
        this.address2 = information.address2;
        this.address3 = information.address3;
        this.address4 = information.address4;
        this.birthday = information.birthday.getTime();
        this.gender = information.gender && new GenderDTO(information.gender) || undefined;
        this.point = information.point;
        this.bankingNumber = information.bankingNumber;
        this.bankingCode = information.bankingCode;
    }
}