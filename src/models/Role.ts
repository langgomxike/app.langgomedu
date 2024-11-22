import Permission from "./Permission";

export enum RoleList {
    SUPER_ADMIN = 1,
    ADMIN = 2,
    USER = 3,
    TUTOR = 4,
    PARENT = 5,
    CHILD = 6,
    BANNED_USER = 7,
}

export default class Role {
    public id: number;
    public name: string;
    public permissions: Permission[];

    constructor(id = -1, name = "") {
        this.id = id;
        this.name = name;
        this.permissions = [];
    }
}