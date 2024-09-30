import CertificateLevelDTO from "../dtos/CertificateLevelDTO";
import Certificate from "./Certificate";

export default class CertificateLevel {
    public id: number;
    public vnLevel: string;
    public jaLevel: string;
    public enLevel: string;
    public certificate: Certificate | undefined;

    constructor(id = -1, vnLevel = "", jaLevel = "", enLevel = "", certificate: Certificate | undefined = undefined) {
        this.id = id;
        this.vnLevel = vnLevel;
        this.jaLevel = jaLevel;
        this.enLevel = enLevel;
        this.certificate = certificate
    }

    fromDTO(levelDTO: CertificateLevelDTO): void {
        this.id = levelDTO.id;
        this.vnLevel = levelDTO.vn_level;
        this.enLevel = levelDTO.en_level;
        this.jaLevel = levelDTO.ja_level;
        this.certificate = levelDTO.certificate && new Certificate().fromDTO(levelDTO.certificate) || undefined;
    }
}