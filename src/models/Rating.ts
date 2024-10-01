import RatingDTO from "../dtos/RatingDTO";
import Class from "./Class";
import User from "./User";

export default class Rating {
    public rater: User | undefined; //[note: "ID của người đánh giá (người học)"]
    public ratee: User | undefined; //[note: "-- ID của người được đánh giá (người dạy)"]
    public rating: number;
    public content: string;
    public class: Class | undefined;
    public createdAt: Date;

    constructor(rater: User | undefined = undefined, ratee: User | undefined = undefined, rating = 0, content = "", _class: Class | undefined = undefined, createdAt = new Date()) {
        this.rater = rater;
        this.ratee = ratee;
        this.rating = rating;
        this.content = content;
        this.class = _class;
        this.createdAt = createdAt;
    }

    fromDTO(ratingDTO: RatingDTO): void {
        this.rater = ratingDTO.rater && new User().fromDTO(ratingDTO.rater) || undefined;
        this.ratee = ratingDTO.ratee && new User().fromDTO(ratingDTO.ratee) || undefined;
        this.rating = ratingDTO.rating;
        this.content = ratingDTO.content;
        this.class = ratingDTO.class && new Class().fromDTO(ratingDTO.class) || undefined;
        this.createdAt = new Date(ratingDTO.created_at);
    }
}