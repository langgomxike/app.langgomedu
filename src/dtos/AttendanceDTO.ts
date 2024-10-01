import Attendance from "../models/Attendance";
import LessonDTO from "./LessonDTO";
import UserDTO from "./UserDTO";

export default class AttendanceDTO {
    public id: number;
    public lesson: LessonDTO | undefined;
    public user: UserDTO | undefined;
    public user_paid: boolean;
    public tutor_accept_paid: boolean;
    public user_attended: boolean;
    public tutor_accept_attended: boolean;
    public attended_at: number;

    constructor(attendance: Attendance) {
        this.id = attendance.id;
        this.lesson = attendance.lesson && new LessonDTO(attendance.lesson) || undefined;
        this.user = attendance.user && new UserDTO(attendance.user) || undefined;
        this.user_paid = attendance.userPaid;
        this.tutor_accept_paid = attendance.tutorAcceptPaid;
        this.user_attended = attendance.userAttended;
        this.tutor_accept_attended = attendance.tutorAcceptAttended;
        this.attended_at = attendance.attendedAt.getTime();
    }
}