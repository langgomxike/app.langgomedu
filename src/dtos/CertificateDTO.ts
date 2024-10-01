import Certificate from "../models/Certificate";
import FileDTO from "./FileDTO";

export default class CertificateDTO {
    public id: number;
    public name: string;
    public vn_desc: string;
    public ja_desc: string;
    public en_desc: string;
    public icon: FileDTO | undefined;

    constructor(certificate: Certificate) {
        this.id = certificate.id;
        this.name = certificate.name;
        this.vn_desc = certificate.vnDesc;
        this.en_desc = certificate.enDesc;
        this.ja_desc = certificate.jaDesc;
        this.icon = certificate.icon && new FileDTO(certificate.icon) || undefined;
    }
}