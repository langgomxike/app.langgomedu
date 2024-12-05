import Attendance from "../models/Attendance";
import ReactAppUrl from "../configs/ConfigUrl";
import axios from "axios";
import Response from "../models/Response";
import User from "../models/User";
import LearnerAtendance from "../models/LearnerAtendance";
import SLog, {LogType} from "../services/SLog";

export default class AAttendance {
  private static API_URL = ReactAppUrl.API_BASE_URL + "/attendances";

  public static getAttendanceHistoriesOfUser(userId: string, onNext: (attendances: Attendance[]) => void) {
    const url = this.API_URL + '/histories';
    const data = {user_id: userId};

    axios.post<Response>(url, data)
      .then(response => {
        SLog.log(LogType.Info, "getAttendanceHistoriesOfUser", response.data.message, response.data.status);
        onNext(response.data.data as Attendance[] ?? []);
      })
      .catch(error => {
        SLog.log(LogType.Error, "getAttendanceHistoriesOfUser", "found error", error);
        onNext([]);
      });
  }

  // Call api get lesso detail and attend students in lesson for tutor
  public static getAttendanceByTutorClassLesson(
    classId: number,
    lessonId: number,
    onNext: (
      learners: User[]
    ) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);

    axios
      .get(`${this.API_URL}/tutor/${classId}/${lessonId}`)
      .then((response) => {

        const learners = response.data.data.learners;

        onNext(learners);

        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  }

  // Call api get lesso detail and attend students in lesson for learner
  public static getAttendanceByLearnerLesson(
    lessonId: number,
    userId: string,
    onNext: (attendance: Attendance) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);

    console.log(`lessonId: ${lessonId},userId: ${userId}`);


    axios
      .get(`${this.API_URL}/learner/${lessonId}/${userId}`)
      .then((response) => {
        const data = response.data.data;
        const attendance = data.attendance;
        // console.log(">>> getAttendanceByLearnerClassLesson: ", JSON.stringify(data, null, 2));
        onNext(attendance);
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
      .post(`${this.API_URL}/request`, {learners: learners})
      .then((response) => {
        // console.log(">>> request attendance: ", response.data.data);
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

    console.log("Form data: ", formData);


    axios
      .post(`${this.API_URL}/pay`, formData, {
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

  public static confirmPaidForLearner(
    lessonId: number,
    userId: string,
    action: string,
    onNext: (data: any) => void,
    onLoading: (loading: boolean) => void,
  ) {


    onLoading(true)
    axios
      .post(`${this.API_URL}/confirm_paid`, {lesson_id: lessonId, user_id: userId, action, value: true})
      .then((response) => {
        console.log(">>> confirm paid for learner: ", response.data.data);
        onNext(response.data.data);
        onLoading(false)
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  }
}
