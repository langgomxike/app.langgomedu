import MessageTypeDTO from "../dtos/MessageTypeDTO";

export default class MessageType {
    public id: number;
    public type: string;

    constructor(id = -1, type = "") {
        this.id = id;
        this.type = type;
    }

    fromDTO(typeDTO: MessageTypeDTO) {
        this.id = typeDTO.id;
        this.type = typeDTO.type;
    }
}