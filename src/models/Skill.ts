
import File from "../models/File";

export default class Skill {
    public id: number;
    public vn_name: string;
    public en_name: string;
    public ja_name: string;
    public progress_percent: number;
    public icon: File | undefined;

    constructor(id = -1, vn_name = "", en_name = "", ja_name = "", progress_percent = 0, icon: File | undefined = undefined) {
        this.id = id;
        this.vn_name = vn_name;
        this.en_name = en_name;
        this.ja_name = ja_name;
        this.progress_percent = progress_percent;
        this.icon = icon;
    }
}