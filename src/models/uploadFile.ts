
export default class UploadFile {
    public uri: string;
    public name: string;
    public type: string;

    constructor (uri: "", name : "", type: ""){
        this.uri = uri;
        this.name = name;
        this.type = type;
    }
}