import RoleDTO from "../dtos/RoleDTO";

export default class Role {
    public id: number;
    public role: string;

    constructor(id = -1, role = "") {
        this.id = id;
        this.role = role;
    }

    fromDTO(roleDTO: RoleDTO) : void {
        this.id = roleDTO.id;
        this.role = roleDTO.role;
    }
}