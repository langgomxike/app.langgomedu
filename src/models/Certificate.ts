import File from "../models/File";

export default class Certificate {
    public id: number;
    public name: string;
    public vn_desc: string;
    public ja_desc: string;
    public en_desc: string;
    public icon: File | undefined;

    constructor(id = -1, name = "", vn_desc = "", ja_desc = "", en_desc = "", icon: File | undefined = undefined) {
        this.id = id;
        this.name = name;
        this.vn_desc = vn_desc;
        this.ja_desc = ja_desc;
        this.en_desc = en_desc;
        this.icon = icon;
    }
}