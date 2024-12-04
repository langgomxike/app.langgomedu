import Certificate from "./Certificate";
import Education from "./Education";
import Experience from "./Experience";
import User from "./User";

export default class CV {
    public user: User | undefined;
    public biography: string;
    public title: string;
    public approved_at: number;
    public updated_at: number;
    public certificates: Certificate[];
    public educations: Education[];
    public experiences: Experience[];

    constructor(
        user: User | undefined = undefined,
        biography = "",
        title = "",
        approved_at: number = 0,
        updated_at: number = 0,
        certificates: Certificate[] = [],
        educations: Education[] = [],
        experiences: Experience[] = []
    ) {
        this.user = user;
        this.biography = biography;
        this.title = title;
        this.approved_at = approved_at;
        this.updated_at = updated_at;
        this.certificates = certificates;
        this.educations = educations;
        this.experiences = experiences;
    }


    
}
