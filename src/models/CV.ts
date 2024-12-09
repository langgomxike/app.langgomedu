import Certificate from "./Certificate";
import Education from "./Education";
import Experience from "./Experience";
import User from "./User";

export default class CV {
    public id: string;
    public user: User | undefined;
    public biography: string;
    public title: string;
    public approved_at: number | null;
    public updated_at: number | null;
    public certificates: Certificate[];
    public educations: Education[];
    public experiences: Experience[];

    constructor(
        id: string,
        user: User | undefined = undefined,
        biography = "",
        title = "",
        approved_at: null,
        updated_at: null,
        certificates: Certificate[] = [],
        educations: Education[] = [],
        experiences: Experience[] = []
    ) {
        this.id = id;
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
