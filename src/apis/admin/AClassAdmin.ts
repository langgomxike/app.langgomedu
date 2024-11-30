import axios from "axios";
import ReactAppUrl from "../../configs/ConfigUrl";
import Class from "../../models/Class";
import Lesson from "../../models/Lesson";
import User from "../../models/User";
import Pagination from "../../models/Pagination";

export default class AClassAdmin {
  private static BASE_URL = `${ReactAppUrl.API_BASE_URL}/admin`;

  // Get all class
  public static getAllClasses(
    search: string, action: string, page: number, perPage: number,
    onNext: (classes: Class[], pagination: Pagination) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true)
    // console.log("Get all classes: ", `${this.BASE_URL}/classes?search=${search}&action=${action}&page=${page}&perPage=${perPage}` );
    
    axios
      .get(`${this.BASE_URL}/classes?search=${search}&action=${action}&page=${page}&perPage=${perPage}`)
      .then((response) => {
        onLoading(false);
        const classes = response.data.data.classes;
        const pagination = response.data.data.pagination;
        onNext(classes, pagination);
      })
      .catch((err) => {
        console.log("Error: ", err);
        onNext([], new Pagination);
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

}
