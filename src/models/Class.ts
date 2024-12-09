
import Address from "./Address";
import ClassLevel from "./ClassLevel";
import Lesson from "./Lesson";
import Major from "./Major";
import User from "./User";

export default class Class {
    public id: number;
    public title: string;
    public description: string;
    public major: Major | undefined;
    public tutor: User | undefined;
    public author: User | undefined;
    public price: number;
    public class_creation_fee: number;
    public class_level: ClassLevel | undefined;
    public max_learners: number;
    public started_at: number;
    public ended_at: number;
    public address: Address | undefined;
    public paid : boolean;
    public paid_path: string;
    public author_accepted: boolean;
    public admin_accepted: boolean;
    public created_at: number;
    public updated_at: number;
    public user_status: string;
    public type: string;
    public lessons: Lesson[] | undefined;
    public is_reported: boolean;
    public total_lessons: number;
    public is_rating: boolean;

    constructor(id = -1, title = "", description = "", major: Major | undefined = undefined, tutor: User | undefined = undefined, author: User | undefined = undefined, price = 0, 
        classCreationFee = 0, classLevel: ClassLevel | undefined = undefined,  maxLearners = 0, 
        startedAt = 0, endedAt = 0, address: Address | undefined = undefined, paid = false, paid_path = "" ,author_accepted = false, 
        admin_accepted = false, createdAt = 0, updatedAt = 0, user_status = "", type = "", lessons: Lesson[] | undefined = undefined, is_reported = false, total_lessons = 0, is_rating = false) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.major = major;
        this.tutor = tutor;
        this.author = author;
        this.price = price;
        this.class_creation_fee = classCreationFee;
        this.class_level = classLevel;
        this.max_learners = maxLearners;
        this.started_at = startedAt;
        this.ended_at = endedAt;
        this.address = address;
        this.paid = paid;
        this.paid_path = paid_path;
        this.author_accepted = author_accepted;
        this.admin_accepted = admin_accepted;
        this.created_at = createdAt;
        this.updated_at = updatedAt;
        this.user_status = user_status;
        this.type = type;
        this.lessons = lessons;
        this.is_reported = is_reported;
        this.total_lessons = total_lessons;
        this.is_rating = is_rating;
    }
}
