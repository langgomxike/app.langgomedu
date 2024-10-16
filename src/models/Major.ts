import File from "./../models/File";
export default class Major {
    private id: number;
    public vn_name: string;
    public ja_name: string;
    public en_name: string;
    public icon: File | undefined;

    constructor(id: number, vn_name: string, ja_name: string, en_name: string, icon?: File){
        this.id = id;
        this.vn_name = vn_name;
        this.ja_name = ja_name;
        this.en_name = en_name;
        this.icon = icon;
    };
    
}