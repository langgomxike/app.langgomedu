import Attendance from "../models/Attendance";
import ReactAppUrl from "../configs/ConfigUrl";
import axios from "axios";
import Lesson from "../models/Lesson";
import User from "../models/User";
import LearnerAtendance from "../models/LearnerAtendance";
import SFirebase, { FirebaseNode } from "../services/SFirebase";

export default class AAttendance {
  private static API_URL = ReactAppUrl.API_BASE_URL + "/attendances";

  // Call api get lesso detail and attend students in lesson for tutor
  public static getAttendanceByTutorClassLesson(
    classId: number,
    lessonId: number,
    userId: string,
    onNext: (
      lessonDetail: Lesson,
      attendStudent: Attendance[],
      learners: User[]
    ) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);
    // console.log(`Class id ${classId}, lesson id ${lessonId}`);
    

    axios
      .get(`${this.API_URL}/tutor/${classId}/${lessonId}/${userId}`)
      .then((response) => {
        const data = response.data.data;
        const lessonDetail = data.lessonDetail;
        const attendStudents = data.attendStudents;
        const learners = data.learners;
        // console.log(">>> getAttendanceByTutorClassLesson: ", JSON.stringify(attendStudents, null, 2));
        onNext(lessonDetail, attendStudents, learners);
        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  }

  // Call api get lesso detail and attend students in lesson for learner
  public static getAttendanceByLearnerClassLesson(
    classId: number,
    lessonId: number,
    userId: string,
    attendedAt: number,
    onNext: (lessonDetail: Lesson, attendStudent: Attendance[]) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);

    axios
      .get(`${this.API_URL}/learner/${classId}/${lessonId}/${userId}?attended_at=${attendedAt}`)
      .then((response) => {
        const data = response.data.data;
        const lessonDetail = data.lesson;
        const attendStudents = data.attendStudents;
        // console.log(">>> getAttendanceByLearnerClassLesson: ", JSON.stringify(data, null, 2));
        onNext(lessonDetail, attendStudents);
        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  }

  // Call api send request attendance for tutor
  public static requestAttendance(
    learners: LearnerAtendance[],
    onNext: (data: any) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);
    axios
      .post(`${this.API_URL}/request`, { learners: learners })
      .then((response) => {
        // console.log(">>> request attendance: ", response.data.data);
        onNext(response.data.data);
        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  }

  // Call api send accpet attendance for learner
  public static accpetAttendance(
    lessonId: number,
    userId: string,
    attendedAt: number,
    confirmAttendance: boolean,
    onNext: (data: any) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);
    console.log("Đã vào đây");
    
    axios
      .put(`${this.API_URL}/accept`, {
        lesson_id: lessonId,
        user_id: userId,
        confirm_attendance: confirmAttendance,
        attended_at: attendedAt,
      })
      .then((response) => {
        console.log(">>> accept attendance: ", response.data.data);
        onNext(response.data.data);
        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  }

  // Call api send payment
  public static sendLearnerPayment(
    formData: FormData,
    onNext: (data: any) => void,
    onLoading: (loading: boolean) => void
  ) {
        
    axios
    .post(`${this.API_URL}/pay`, formData,  {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then((response) => {
      console.log(">>> send learner payment: ", response.data.data);
      onNext(response.data.data);
    })
    .catch((err) => {
      console.log("Error: ", err);
      console.log(err.message);
    });
  }
}
