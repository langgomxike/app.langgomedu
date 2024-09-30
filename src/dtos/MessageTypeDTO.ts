import MessageType from "../models/MeesageType";

export default class MessageTypeDTO {
    public id: number;
    public type: string;

    constructor(type: MessageType) {
        this.id = type.id;
        this.type = type.type;
    }
}