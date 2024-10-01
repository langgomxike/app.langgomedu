import CV from "../models/CV";
import UserDTO from "./UserDTO"

export default class CVDTO {
    public user: UserDTO | undefined
    biography: string;
    title: string;

    constructor(cv: CV) {
        this.biography = cv.biography;
        this.title = cv.title;
        this.user = cv.user && new UserDTO(cv.user) || undefined;
    }
}