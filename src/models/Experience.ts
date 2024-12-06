import Address from "./Address";
import File from "./File";
import UploadFile from "./uploadFile";

export default class Experience {
    public id: number;
    public name: string;
    public note: string;
    public address: Address | undefined;
    public started_at: number;
    public ended_at: number;
    public evidence: File | UploadFile | undefined;

    constructor(id = -1, name = "", note = "", address: Address | undefined = undefined, started_at = 0, ended_at = 0, evidence : File |UploadFile | undefined = undefined) {
        this.id = id
        this.name = name
        this.note = note
        this.address = address
        this.started_at = started_at
        this.ended_at = ended_at
        this.evidence = evidence
    }
    
    public toInsertObject(){
       return {
            name: this.name ?? null,
            note: this.note ?? null,
            address: this.address ? this.address.toInsertObject() : null,
            startedAt: this.started_at ?? null,
            endedAt: this.ended_at ?? null,
            evidenceId: this.evidence ? (this.evidence as File).id : null,
        }
    }
    public toInsertObjectWithEvidenceId(evidenceId : number){
        return {
            name: this.name ?? null,
            note: this.note ?? null,
            address: this.address ? this.address.toInsertObject() : null,
            startedAt: this.started_at ?? null,
            endedAt: this.ended_at ?? null,
            evidenceId: this ? evidenceId : null,
        }
    }
}