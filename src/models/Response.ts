export default class Response {
    status: string;
    status_code: number;
    message: string;
    data: object;

    constructor(status: "OK", status_code = 200, message = "Successfully", data = {}) {
        this.status = status;
        this.status_code = status_code;
        this.message = message;
        this.data = data;
    }
}