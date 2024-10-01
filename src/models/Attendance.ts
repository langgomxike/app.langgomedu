import AttendanceDTO from "../dtos/AttendanceDTO";
import Lesson from "./Lesson";
import User from "./User";

export default class Attendance {
    public id: number;
    public lesson: Lesson | undefined;
    public user: User | undefined;
    public userPaid: boolean;
    public tutorAcceptPaid: boolean;
    public userAttended: boolean;
    public tutorAcceptAttended: boolean;
    public attendedAt: Date;

    constructor(id = -1, lesson: Lesson | undefined = undefined, user: User | undefined = undefined, userPaid = false, tutorAcceptPaid: false, userAttended = false, tutorAcceptAttended = false, attendedAt = new Date()) {
        this.id = id;
        this.lesson = lesson;
        this.user = user;
        this.userPaid = userPaid;
        this.tutorAcceptPaid = tutorAcceptPaid;
        this.userAttended = userAttended;
        this.tutorAcceptAttended = tutorAcceptAttended;
        this.attendedAt = attendedAt;
    }

    fromDTO(attendanceDTO: AttendanceDTO): void {
        this.id = attendanceDTO.id;
        this.lesson = attendanceDTO.lesson && new Lesson().fromDTO(attendanceDTO.lesson) || undefined;
        this.user = attendanceDTO.user && new User().fromDTO(attendanceDTO.user) || undefined;
        this.userPaid = attendanceDTO.user_paid;
        this.tutorAcceptPaid = attendanceDTO.tutor_accept_paid;
        this.userAttended = attendanceDTO.user_attended;
        this.tutorAcceptAttended = attendanceDTO.tutor_accept_attended;
        this.attendedAt = new Date(attendanceDTO.attended_at);
    }
}