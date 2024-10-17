import Rating from "../models/Rating";
import ClassDTO from "./ClassDTO";
import UserDTO from "./UserDTO"

export default class RatingDTO {
    public rater: UserDTO | undefined; //[note: "ID của người đánh giá (người học)"]
    public ratee: UserDTO | undefined; //[note: "-- ID của người được đánh giá (người dạy)"]
    public ratingValue: number;
    public content: string;
    public class: ClassDTO | undefined;
    public created_at: number;

    constructor(rating: Rating) {
        this.rater = rating.rater && new UserDTO(rating.rater) || undefined;
        this.ratee = rating.ratee && new UserDTO(rating.ratee) || undefined;
        this.ratingValue = rating.ratingValue;
        this.content = rating.content;
        this.class = rating.class && new ClassDTO(rating.class) || undefined;
        this.created_at = rating.createdAt.getTime();
    }
}