import axios from "axios";
import ReactAppUrl from "../configs/ConfigUrl";
import User from "../models/User";

export default class AStudent {
  public static getStudentBelongsToUser(
    userId: string,
    onNext: (students: User[]) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);
  
    axios
     .get(`${ReactAppUrl.API_BASE_URL}/students/user/${userId}`)
     .then((response) => {

        const students = response.data.data;
        onNext(students);
        onLoading(false);
        
      })
     .catch((err) => {
        console.error("Error fetching students:", err);
        onLoading(false);
      });
  }

  public static getStudentsInClass(
    classId: number,
    onNext: (students: User[]) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);
    axios
     .get(`${ReactAppUrl.API_BASE_URL}/students/class/${classId}`)
     .then((response) => {

        const students = response.data.data;
        
        onNext(students);
        onLoading(false);
        
      })
     .catch((err) => {
        console.error("Error fetching students:", err);
        onLoading(false);
      });
  }
}
