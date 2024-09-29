export default class DateTimeConfig {
    public static getDateFormat(dateAsLong: number, isShownYear: boolean = false, isShownTime: boolean = false): string {
        const date = new Date(dateAsLong);

        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();

        let result = "";

        if (isShownYear && year !== new Date().getFullYear()) {
            result += "/" + year;
        }

        if (!!result || month !== new Date().getMonth() || day !== new Date().getDate()) {
            result = day + "/" + month + result;
        }

        if (isShownTime) {
            result += " " + this.formatTime(hour) + ":" + this.formatTime(minute);
        }


        return result;
    }

    public static formatTime(time: number): string {
        return time >= 10 ? time + "" : "0" + time;
    }
}