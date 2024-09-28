export default class User {
    public id: number;
    public fullName: string;
    public avatar: string;
    public email: string;
    public phoneNumber: string;

    constructor(id = -1, fullName = "", avatar = "") {
        this.id = id;
        this.fullName = fullName;
        this.avatar = avatar;
        this.email = "";
        this.phoneNumber = "";
    }
}