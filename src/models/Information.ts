import InformationDTO from "../dtos/InformationDTO";
import Gender from "./Gender";
import User from "./User";

export default class Information {
    public user: User | undefined;
    public hometown: string;
    public address1: string;
    public address2: string;
    public address3: string;
    public address4: string;
    public birthday: Date;
    public gender: Gender | undefined;
    public point: number;
    public bankingNumber: string;
    public bankingCode: string;

    constructor(user: User | undefined = undefined, hometown = "", address1 = "", address2 = "", address3 = "", address4 = "", birthday: Date = new Date(), gender: Gender | undefined = undefined, point = 0, bankingNumber = "", bankingCode = "") {
        this.user = user;
        this.hometown = hometown;
        this.address1 = address1;
        this.address2 = address2;
        this.address3 = address3;
        this.address4 = address4;
        this.birthday = new Date(birthday);
        this.gender = gender;
        this.point = point;
        this.bankingNumber = bankingNumber;
        this.bankingCode = bankingCode;
    }

    fromDTO(informationDTO: InformationDTO): void {
        this.user = informationDTO.user && new User().fromDTO(informationDTO.user) || undefined;
        this.hometown = informationDTO.hometown;
        this.address1 = informationDTO.address1;
        this.address2 = informationDTO.address2;
        this.address3 = informationDTO.address3;
        this.address4 = informationDTO.address4;
        this.birthday = new Date(informationDTO.birthday);
        this.gender = informationDTO.gender && new Gender().fromDTO(informationDTO.gender) || undefined;
        this.point = informationDTO.point;
        this.bankingNumber = informationDTO.bankingNumber;
        this.bankingCode = informationDTO.bankingCode;
    }
}