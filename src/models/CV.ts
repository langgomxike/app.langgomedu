import Information from "./Information";
import User from "./User";
import Skill from "./Skill";
import Certificate from "./Certificate";
import Education from "./Education";
import Experience from "./Experience";

export default class CV {
    public user: User | undefined
    public information: Information | undefined
    public biography: string;
    public title: string;
    public approved_at: Date;
    public skills: Skill[] = [];
    public certificates: Certificate[] = [];
    public education: Education[];
    public experience: Experience[];

    constructor(user: User | undefined = undefined, information: Information | undefined = undefined, biography = "", title = "", approved_at = new Date(), skills: Skill[] = [], certificates: Certificate[] = [], education: Education[], experience: Experience[]) {
        this.user = user;
        this.information = information;
        this.biography = biography;
        this.title = title;
        this.approved_at = approved_at;
        this.skills = skills;
        this.certificates = certificates;
        this.education = education;
        this.experience = experience; 
    }
}