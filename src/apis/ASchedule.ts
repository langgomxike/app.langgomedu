import Lesson from "../models/Lesson";


export default class ASchedule {
    public static getWholeWeekLessons(onNext: (lessons:Array<Lesson>)=> void) {
        const lessons = xyz;
        // const lessons: Array<Lesson> = [];

        
        // console.log(lessons);
        

        onNext(lessons);
    }
}

const xyz = [
    new Lesson(
        1, undefined,
        1, new Date(1728282299000),
        new Date(5400000),
        false,
        "Buổi học lý thuyết đầu tiên về lập trình cơ bản"
    ),
    new Lesson(
        2, undefined,
        2, new Date(1728282299000),
        new Date(5400000),
        false,
        "Buổi học lý thuyết đầu tiên về lập trình cơ bản"
    ),
    new Lesson(
        3, undefined,
        1, new Date(1728282299000),
        new Date(7200000),
        false,
        "Buổi học lý thuyết đầu tiên về lập trình cơ bản"
    ),
]
const abc = `
[
 {
  "id": 1,
  "class_id": 1,
  "day": 1,
  "started_at": 1728282299000,
  "duration": 5400,
  "is_online": 0,
  "note": "Buổi học lý thuyết đầu tiên về lập trình cơ bản"
 },
 {
  "id": 2,
  "class_id": 1,
  "day": 2,
  "started_at": 1728282299000,
  "duration": 7200,
  "is_online": 1,
  "note": "Thực hành lập trình bài tập cơ bản"
 },
 {
  "id": 3,
  "class_id": 2,
  "day": 3,
  "started_at": 1728282299000,
  "duration": 5400,
  "is_online": 0,
  "note": "Buổi học lý thuyết về quản lý dự án"
 },
 {
  "id": 4,
  "class_id": 2,
  "day": 4,
  "started_at": 1728282299000,
  "duration": 7200,
  "is_online": 1,
  "note": "Thực hành kế hoạch dự án thực tế"
 },
 {
  "id": 5,
  "class_id": 3,
  "day": 5,
  "started_at": 1728282299000,
  "duration": 6000,
  "is_online": 0,
  "note": "Lý thuyết cơ bản về phân tích dữ liệu"
 }
]
`

// {   
//     lessonID : 1,
//     classTitle : "Toan 12",
//     tutorName : "Nguyen Van A",
//     tutorID: "001",
//     authorID: "001",
//     startedAt : 50400000,
//     duration : 5400000,
//     day: 27,
// },
// {
//     lessonID : 2,
//     classTitle : "Ly 11",
//     tutorName : "Nguyen Van B",
//     tutorID: "001",
//     authorID: "002",
//     startedAt : "16:00",
//     duration : 7200000,
//     day: 29,
// }