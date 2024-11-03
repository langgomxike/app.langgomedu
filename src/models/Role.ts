
export default class Role {
    public static SUPER_ADMIN_ROLE_ID = 1;
    public static ADMIN_ROLE_ID = 2;
    public static USER_ROLE_ID = 3;


    public id: number;
    public role: string;

    constructor(id = -1, role = "") {
        this.id = id;
        this.role = role;
    }
}