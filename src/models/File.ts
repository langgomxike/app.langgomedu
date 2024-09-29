export default class File {
    public id: number;
    public name: string;
    public path: string;
    public capacity: number;
    public imageWith: number;
    public imageHeight: number;

    constructor(id = -1, name = "", path = "", capacity = 0, imageWidth = 0, imageHeight = 0) {
        this.id = id;
        this.name = name;
        this.path = path;
        this.capacity = capacity;
        this.imageWith = imageWidth;
        this.imageHeight = imageHeight;
    }
}