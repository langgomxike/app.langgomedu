export default class LearnerAtendance {
    public id: string;
    public full_name: string;
    public parent_id: string | null;
    public lesson_id: number;
    public attended: boolean;
    public confirm_attendance: boolean;
    public attended_at: number | null;
    public confirmed_at: number | null;

    constructor(id = "", full_name = "", parent_id = "", lesson_id = -1, attended = false, attended_at = 0 ,confirm_attendance = false, confirmed_at = -1) {
        this.id = id;
        this.full_name = full_name;
        this.parent_id = parent_id;
        this.lesson_id = lesson_id;
        this.attended = attended;
        this.attended_at = attended_at;
        this.confirm_attendance = confirm_attendance;
        this.confirmed_at = confirmed_at;
    }
}
