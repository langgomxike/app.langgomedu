import File from "../models/File";

export default class FileDTO {
    public id: number;
    public name: string;
    public path: string;
    public capacity: number;
    public image_with: number;
    public image_height: number;
    public created_at: number;
    public updated_at: number;

    constructor(file: File) {
        this.id = file.id;
        this.name = file.name;
        this.path = file.path;
        this.capacity = file.capacity;
        this.image_with = file.imageWith;
        this.image_height = file.imageHeight;
        this.created_at = file.createdAt.getTime();
        this.updated_at = file.updatedAt.getTime();
    }
}