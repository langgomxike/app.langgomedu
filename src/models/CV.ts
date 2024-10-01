import CVDTO from "../dtos/CVDTO";
import User from "./User";

export default class CV {
    public user: User | undefined
    biography: string;
    title: string;

    constructor(user: User | undefined = undefined, biography = "", title = "") {
        this.user = user;
        this.biography = biography;
        this.title = title;
    }

    fromDTO(cvDTO: CVDTO): void {
        this.biography = cvDTO.biography;
        this.title = cvDTO.title;
        this.user = cvDTO.user && new User().fromDTO(cvDTO.user) || undefined;
    }
}