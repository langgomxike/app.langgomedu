import Major from "./Major";

export default class InterestedMajor{
    public major : Major
    public priority : number

    constructor(major : Major , priority : number = 1){
        this.major = major;
        this.priority = priority;
    }
}