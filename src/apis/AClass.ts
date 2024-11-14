import axios from "axios";
import Class from "../models/Class";
import ReactAppUrl from "../configs/ConfigUrl";

export default class AClass {
  private static API_URL = ReactAppUrl.API_BASE_URL;

  //Get detail class with user id
  public static getClassDetailWithUser(
    classId: number,
    userId: string,
    onNext: (course: Class, realatedClasses: Class[]) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);
    axios
      .get(`${this.API_URL}/classes/${classId}?user_id=${userId}`)
      .then((response) => {
        const data = response.data.data;
        onNext(data.class, data.related_classes);
        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
        onNext(new Class(), []);
        onLoading(true);
      });
  }

  //Get suggetting class with user id
  public static getSuggetingClass(
    userId: string,
    userType: number,
    onNext: (classes: Class[]) => void,
    onLoading: (loading: boolean) => void
  ) {
    // console.log(">>> url: ", this.API_URL);
    onLoading(true);
    axios
      .get(`${this.API_URL}/classes/suggests/${userId}?user_type=${userType}`)
      .then((response) => {
        onNext(response.data.data);
        // console.log(">>>> response suggests: ", JSON.stringify(response.data.data,  null, 2));

        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
        onNext([]);
        onLoading(true);
      });
  }

  // get attending class with user id
  public static getAttedingClass(
    userId: string,
    onNext: (classes: Class[]) => void,
    onLoading: (loading: boolean) => void
  ) {
    // console.log(">>> url: ", this.API_URL);
    onLoading(true);
    axios
      .get(`${this.API_URL}/classes/attending/${userId}`)
      .then((response) => {
        onNext(response.data.data);
        // console.log(">>>> response: ", JSON.stringify(response.data.data,  null, 2));

        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
        onNext([]);
        onLoading(true);
      });
  }

  //get teachers class with user id
  public static getTeachingClass(
    userId: string,
    onNext: (classes: Class[]) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);
    axios
      .get(`${this.API_URL}/classes/teaching/${userId}`)
      .then((response) => {
        onNext(response.data.data);
        // console.log(">>>> teaching class: ", JSON.stringify(response.data.data,  null, 2));

        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
        onNext([]);
        onLoading(true);
      });
  }

  //
  public static joinClass(
    classId: number,
    userId: string,
    studentIds: number[],
    onNext: (data: any) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);

    axios
      .post(`${this.API_URL}/classes/${classId}/join`, { user_id: userId, student_ids: studentIds })
      .then((response) => {
        console.log(">>>joinClass", response.data.data);
        onNext(response.data.data);

        onLoading(false);
      })
      .catch((err) => {
        console.error("Error enrolling in class:", err);
        console.log(">>> title", "Nhận lớp không thành công");
        onNext(err);
        onLoading(false);
      });
  }

  public static acceptClassToTeach(
    classId: number,
    tutorId: string,
    onNext: (data: any) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);

    axios
      .post(`${this.API_URL}/classes/${classId}/accept_to_teach`, { tutor_id: tutorId})
      .then((response) => {
        onNext(response.data.data);
        onLoading(false);
      })
      .catch((err) => {
        console.error("Error enrolling in class:", err);
        console.log(">>> title", "Nhận lớp không thành công");
        onNext(err);
        onLoading(false);
      });
  }

  public static getCreatedClass(
    userId: string,
    onNext: (classes: Class[]) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);
    axios
      .get(`${this.API_URL}/classes/created/${userId}`)
      .then((response) => {
        onNext(response.data.data);
        // console.log(">>>> created class: ", JSON.stringify(response.data.data,  null, 2));

        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
        onNext([]);
        onLoading(true);
      });
  }

  public static getAllClasses(onNext: ()=> void){
    // console.log("clicked");
    
    axios({method: 'get', baseURL: this.API_URL +'/classes'})
    .then(
        (result)=> {
            // console.log("port", this.API_URL)
            // console.log("data", result.data);
            onNext();
        }
    ).catch(
        (err)=> {
            // console.log("port", this.API_URL)
            // console.log("error", err);
            onNext();
        }
    )
}
}