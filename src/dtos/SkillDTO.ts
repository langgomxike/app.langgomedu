import Skill from "../models/Skill";
import FileDTO from "./FileDTO";

export default class SkillDTO {
    public id: number;
    public vn_name: string;
    public en_name: string;
    public ja_name: string;
    public progress_percent: number;
    public icon: FileDTO | undefined;

    constructor(skill: Skill) {
        this.id = skill.id;
        this.vn_name = skill.vnName;
        this.en_name = skill.enName;
        this.ja_name = skill.jaName;
        this.progress_percent = skill.progressPercent;
        this.icon = skill.icon && new FileDTO(skill.icon) || undefined;
    }
}