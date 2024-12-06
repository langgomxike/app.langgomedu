import File from "./File";
import UploadFile from "./uploadFile";


export default class Certificate {
    public id: number;
    public name: string;
    public note: string;
    public score: string;
    public valid_at: number;
    public expired_at: number;
    public evidence: File | UploadFile | undefined;

    constructor(id = -1, name = "", note = "", score = "", valid_at = 0, expired_at = 0, evidence : File | UploadFile | undefined = undefined) {
        this.id = id
        this.name = name
        this.note = note
        this.score = score
        this.valid_at = valid_at
        this.expired_at = expired_at
        this.evidence = evidence
    }

    public toInsertObject() {
        return {
            name: this.name ?? null,
            note: this.note ?? null,
            score: this.score ?? null,
            validAt: this.valid_at ?? null,
            expiredAt: this.expired_at ?? null,
            evidenceId: this.evidence ? (this.evidence as File).id : null,
        }
    }
    public toInsertObjectWithEvidenceId(evidenceId : number){
        return {
            name: this.name ?? null,
            note: this.note ?? null,
            score: this.score ?? null,
            validAt: this.valid_at ?? null,
            expiredAt: this.expired_at ?? null,
            evidenceId: this ? evidenceId : null,
        }
    }
}