import PermissionDTO from "../dtos/PermissionDTO";

export default class Permission {
    public id: number;
    public name: string;

    constructor(id = -1, name = "", scope = "") {
        this.id = id;
        this.name = name;
    }

    fromDTO(permissionDTO: PermissionDTO): void {
        this.id = permissionDTO.id;
        this.name = permissionDTO.name;
    }
}