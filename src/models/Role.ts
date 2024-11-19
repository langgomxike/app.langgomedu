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
    public role: string;

    constructor(id = -1, role = "") {
        this.id = id;
        this.role = role;
    }
}