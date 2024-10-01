import FileDTO from "../dtos/FileDTO";

export default class File {
    public id: number;
    public name: string;
    public path: string;
    public capacity: number;
    public imageWith: number;
    public imageHeight: number;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(id = -1, name = "", path = "", capacity = 0, imageWidth = 0, imageHeight = 0, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.name = name;
        this.path = path;
        this.capacity = capacity;
        this.imageWith = imageWidth;
        this.imageHeight = imageHeight;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    fromDTO(fileDTO: FileDTO): void {
        this.id = fileDTO.id;
        this.name = fileDTO.name;
        this.path = fileDTO.path;
        this.capacity = fileDTO.capacity;
        this.imageWith = fileDTO.image_with;
        this.imageHeight = fileDTO.image_height;
        this.createdAt = new Date(fileDTO.created_at);
        this.updatedAt = new Date(fileDTO.updated_at);
    }
}