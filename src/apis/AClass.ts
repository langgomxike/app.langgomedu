import axios from "axios";
import Class from "../models/Class";
import ReactAppUrl from "../configs/ConfigUrl";
import Lesson from "../models/Lesson";

export default class AClass {
  private static API_URL = ReactAppUrl.API_BASE_URL;

  //Get detail class with user id
  public static getClassDetailWithUser(
    classId: number,
    userId: string,
    onNext: (course: Class) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);
    axios
      .get(`${this.API_URL}/classes/${classId}?user_id=${userId}`)
      .then((response) => {
        const data = response.data.data;
        onNext(data.class);
        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
        onNext(new Class());
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
        
        // console.log("User id", userId);  
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
    userIds: string[],
    onNext: (data: any) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);

    axios
      .post(`${this.API_URL}/classes/${classId}/join`, {
        user_ids: userIds,
      })
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

  public static createClass(
    title: string,
    description: string,
    majorId: number,
    classLevelId: number,
    price: number,
    startedAt: number | null,
    endedAt: number | null,
    lessons: Lesson[],
    onNext: (result: boolean, insertId?: number) => void
  ) {
    
    console.log("title: ", title);
    console.log("description: ", description);
    console.log("majorId: ", majorId);
    console.log("classLevelId: ", classLevelId);
    console.log("startedAt: ", startedAt);
    console.log("endedAt: ", endedAt);
    console.log("lessons: ", lessons);
    

    console.log({
      title: title,
      description: description,
      major_id: majorId,
      class_level_id: classLevelId,
      price: price,
      started_at: startedAt,
      ended_at: endedAt,
      lessons: lessons,
    });
    

    axios
      .post(`${this.API_URL}/classes/create`, {
        title: title,
        description: description,
        major_id: majorId,
        class_level_id: classLevelId,
        price: price,
        started_at: startedAt,
        ended_at: endedAt,
        lessons: lessons,
      })
      .then((response) => {
        console.log("Class created successfully:", response.data);
        onNext(response.data.data.classId); // Truyền `classId` về từ response
      })
      .catch((err) => {
        console.error("Error:", err);
        console.log(">>> title", "Tạo lớp không thành công");
        onNext(err);
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
      .post(`${this.API_URL}/classes/${classId}/accept_to_teach`, {
        tutor_id: tutorId,
      })
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
  //khoá lớp học
  // Hàm khoá lớp học
public static lockClass(
  classId: number,
  onNext: (response: any) => void,
  onLoading: (loading: boolean) => void
) {
  // Bắt đầu loading
  onLoading(true);

  // Gửi request POST đến BE với classId
  axios.post(`${this.API_URL}/reports/lockClass`, { classId })
      .then((response) => {
          // Nếu thành công, gọi callback `onNext` với kết quả từ BE
          onNext(response.data);
      })
      .catch((error) => {
          console.error("Error locking class:", error);
          onNext({ success: false, message: "Failed to lock class." });
      })
      .finally(() => {
          // Kết thúc loading
          onLoading(false);
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