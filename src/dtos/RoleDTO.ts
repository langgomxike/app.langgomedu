import Role from './../models/Role';
export default class RoleDTO {
    public id: number;
    public role: string;

    constructor(role: Role) {
        this.id = role.id;
        this.role = role.role;
    }
}