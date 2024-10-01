import SkillDTO from "../dtos/SkillDTO";
import File from "../models/File";

export default class Skill {
    public id: number;
    public vnName: string;
    public enName: string;
    public jaName: string;
    public progressPercent: number;
    public icon: File | undefined;

    constructor(id = -1, vnName = "", enName = "", jaName = "", progressPercent = 0, icon: File | undefined = undefined) {
        this.id = id;
        this.vnName = vnName;
        this.enName = enName;
        this.jaName = jaName;
        this.progressPercent = progressPercent;
        this.icon = icon;
    }

    fromDTO(skillDTO: SkillDTO): void {
        this.id = skillDTO.id;
        this.vnName = skillDTO.vn_name;
        this.enName = skillDTO.en_name;
        this.jaName = skillDTO.ja_name;
        this.progressPercent = skillDTO.progress_percent;
        this.icon = skillDTO.icon && new File().fromDTO(skillDTO.icon) || undefined;
    }
}