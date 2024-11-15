import Information from "./Information";
import User from "./User";
import Skill from "./Skill";
import Certificate from "./Certificate";
import Education from "./Education";
import Experience from "./Experience";
import Major from "./Major";
import InterestedMajor from "./InterestedMajor";

export default class CV {
    public user: User | undefined
    public information: Information | undefined
    public biography: string;
    public title: string;
    public approved_at: Date;
    public interested_majors: InterestedMajor[] = [];
    public skills: Skill[] = [];
    public certificates: Certificate[] = [];
    public educations: Education[];
    public experiences: Experience[];

    constructor(user: User | undefined = undefined, information: Information | undefined = undefined, biography = "", title = "", approved_at = new Date(), interested_majors: InterestedMajor[] = [] ,skills: Skill[] = [], certificates: Certificate[] = [], educations: Education[], experiences: Experience[]) {
        this.user = user;
        this.information = information;
        this.biography = biography;
        this.title = title;
        this.approved_at = approved_at;
        this.interested_majors = interested_majors;
        this.skills = skills;
        this.certificates = certificates;
        this.educations = educations;
        this.experiences = experiences; 
    }
}