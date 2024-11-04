import File from "./File";
import Role from "./Role";
import Information from "./Information";

export default class User {
    public id: string;
    public full_name: string;
    public email: string;
    public phone_number: string;
    public password: string;
    public information: Information | undefined;
     public is_reported: boolean;
    public token: string;
    public avatar: File | undefined;
    public role: Role | undefined;
    public created_at: Date;
    public updated_at: Date;

    constructor(
        id = "", 
        full_name = "", 
        email = "", 
        phone_number = "", 
        password = "", 
        information: Information | undefined = undefined,
        token = "", 
        is_reported = false,
        created_at: Date = new Date(), 
        updated_at: Date = new Date()
    ) {
        this.id = id;
        this.full_name = full_name;
        this.email = email;
        this.phone_number = phone_number;
        this.password = password;
        this.information = information;
        this.token = token;
        this.is_reported = is_reported;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
