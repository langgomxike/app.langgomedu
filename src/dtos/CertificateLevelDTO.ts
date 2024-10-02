import CertificateLevel from "../models/CertificateLevel";
import CertificateDTO from "./CertificateDTO";

export default class CertificateLevelDTO {
    public id: number;
    public vn_level: string;
    public ja_level: string;
    public en_level: string;
    public certificate: CertificateDTO | undefined;

    constructor(level: CertificateLevel) {
        this.id = level.id;
        this.vn_level = level.vnLevel;
        this.ja_level = level.jaLevel;
        this.en_level = level.enLevel;
        this.certificate = level.certificate && new CertificateDTO(level.certificate) || undefined;
    }
}