import Permission from './../models/Permission';
export default class PermissionDTO {
    public id: number;
    public name: string;

    constructor(permission: Permission) {
        this.id = permission.id;
        this.name = permission.name;
    }
}