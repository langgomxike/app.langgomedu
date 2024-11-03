
export default class Permission {
    public id: number;
    public name: string;

    constructor(id = -1, name = "", scope = "") {
        this.id = id;
        this.name = name;
    }
}