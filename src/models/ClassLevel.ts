
export default class ClassLevel {
    public id: number;
    public vn_name: string;
    public en_name: string;
    public ja_name: string;

    constructor(id = -1, vn_name = "",  en_name = "", ja_name = "") {
        this.id = id;
        this.vn_name = vn_name;
        this.en_name = en_name;
        this.ja_name = ja_name;
    }
}