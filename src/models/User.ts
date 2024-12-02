import File from "./File";
import Role from "./Role";
import Address from "./Address";
import Gender from "./Gender";
import ClassLevel from "./ClassLevel";
import Major from "./Major";
import Attendance from "./Attendance";
import Lesson from "./Lesson";

export default class User {
    public id: string;
    public full_name: string;
    public username: string;
    public phone_number: string;
    public password: string;
    public token: string;
    public avatar: string;
    public role: Role | undefined;
    public hometown: string;
    public address: Address | undefined;
    public birthday: number;
    public gender: Gender | undefined;
    public point: number;
    public banking_number: string;
    public banking_code: string;
    public created_at: number;
    public updated_at: number;
    public roles: Role[];
    public interested_class_levels: ClassLevel[];
    public interested_majors: Major[];
    public children: User[];
    public attendance: Attendance | undefined;
    public is_reported: boolean;
    public cv_id: string | undefined;
    public lessons: Lesson[] | [];

    constructor(
        id = "",
        full_name = "",
        username = "",
        phone_number = "",
        password = "",
        token = "",
        avatar = "",
        role: Role | undefined = undefined,
        hometown: string = "",
        address: Address | undefined = undefined,
        birthday = 0,
        gender: Gender | undefined = undefined,
        point: number = 0,
        banking_number: string = "",
        banking_code: string = "",
        created_at = 0,
        updated_at = 0,
        roles = [],
        interested_class_levels = [],
        interested_majors = [],
        children: User[] = [],
        attendance: Attendance | undefined = undefined,
        is_reported = false,
        cv_id: string | undefined = undefined,
        lessons: Lesson[] | [] = [],
    ) {
        this.id = id;
        this.full_name = full_name;
        this.username = username;
        this.phone_number = phone_number;
        this.password = password;
        this.token = token;
        this.avatar = avatar;
        this.role = role;
        this.hometown = hometown;
        this.address = address;
        this.birthday = birthday;
        this.gender = gender;
        this.point = point;
        this.banking_number = banking_number;
        this.banking_code = banking_code;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.roles = roles;
        this.interested_class_levels = interested_class_levels;
        this.interested_majors = interested_majors;
        this.children = children;
        this.attendance = attendance;
        this.is_reported = is_reported;
        this.cv_id = cv_id;
        this.lessons = lessons;
    }
}