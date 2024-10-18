type QRItemType = {
    id: string | number;
    type: QRItems;
}

export enum QRItems {
    CLASS = "class",
    CV = "cv",
    USER = "user",
}

export default QRItemType;