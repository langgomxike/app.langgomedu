import axios from "axios";
import ReactAppUrl from "../../configs/ConfigUrl";
import Class from "../../models/Class";
import Lesson from "../../models/Lesson";
import User from "../../models/User";

export default class AClassAdmin {
  private static BASE_URL = `${ReactAppUrl.API_BASE_URL}/admin`;
  private static BASE_URL1 = `${ReactAppUrl.API_BASE_URL}/reports/class`;

  // Get all class
  public static getAllClasses(
    onNext: (classes: Class[]) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true)
    axios
      .get(`${this.BASE_URL}/classes`)
      .then((response) => {
        onNext(response.data.data);
        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
        onNext([]);
        onLoading(true);
      });
  }

  //Gt Class By Id

  public static getClassById(
    classId: number,
    onNext: (lessons: Lesson[], users: User[]) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true)
    axios
      .get(`${this.BASE_URL}/classes/${classId}`)
      .then((response) => {
        const data = response.data.data;
        onNext(data.lessons, data.users);
        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
        onNext([], []);
        onLoading(true);
      });
  }
  public static getAllClassReports(
    onNext: (classReports: Class[]) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);
    axios
      .get(`${this.BASE_URL1}`)
      .then((response) => {
        onNext(response.data.data);
        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
        onNext([]);
        onLoading(false);
      });
  }
}
