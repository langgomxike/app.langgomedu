import User from "../models/User";
import RoleDTO from "./RoleDTO";

export default class UserDTO {
    public id: string;
    public full_name: string;
    public email: string;
    public phone_number: string;
    public password: string;
    public token: string;
    public avatar_id: number;
    public role: RoleDTO | undefined;
    public created_at: number;
    public updated_at: number;

    constructor(user: User) {
        this.id = user.id;
        this.full_name = user.fullName;
        this.email = user.email;
        this.phone_number = user.phoneNumber;
        this.password = user.password;
        this.token = user.token;
        this.avatar_id = -1;
        this.role = user.role && new RoleDTO(user.role) || undefined;
        this.created_at = new Date().getTime();
        this.updated_at = new Date().getTime();
    }
}