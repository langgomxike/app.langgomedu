import PermissionDTO from "../dtos/PermissionDTO";

export default class Permission {
    public id: number;
    public name: string;
    public scope: string;

    constructor(id = -1, name = "", scope = "") {
        this.id = id;
        this.name = name;
        this.scope = scope;
    }

    fromDTO(permissionDTO: PermissionDTO): void {
        this.id = permissionDTO.id;
        this.name = permissionDTO.name;
        this.scope = permissionDTO.scope;
    }
}