import axios from "axios";
import Class from "../models/Class";
import ReactAppUrl from "../configs/ConfigUrl";
import Lesson from "../models/Lesson";
import Values from "../constants/Values";
import Pagination from "../models/Pagination";
import Filters from "../models/Filters";
import User from "../models/User";

export default class AClass {
  private static API_URL = ReactAppUrl.API_BASE_URL;

  //Get detail class with user id
  public static getClassDetailWithUser(
    classId: number,
    userId: string,
    onNext: (course: Class, membersInClass: User[]) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);

    axios
      .get(`${this.API_URL}/classes/detail/${classId}?user_id=${userId}`)
      .then((response) => {
        const data = response.data.data;
        const classData: Class = data.class;
        const membersInClass: User[] = data.members_in_class;

        onNext(classData, membersInClass);
        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
        onNext(new Class(), []);
        onLoading(true);
      });
  }

  public static getconflictingLessonsWithClassUsers(
    classId: number,
    userId: string,
    onNext: (data: User[]) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);

    axios
      .post(`${this.API_URL}/classes/conflicting`, {
        class_id: classId,
        user_id: userId,
      })
      .then((response) => {
        const datas: any[] = response.data.data;
        const mergedData = datas.map((item) => {
          return {
            ...item,
            lessons: item.conflicts || [],
          };
        });

        onNext(mergedData);
        onLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
        onNext([]);
        onLoading(true);
      });
  }

  //Get suggetting class with user id
  public static getSuggetingClasses(
    userId: string,
    userType: number,
    page: number,
    filters: Filters | undefined,
    onNext: (classes: Class[], pagination: Pagination) => void,
    onLoading: (loading: boolean) => void
  ) {
    const perPage = Values.PERPAGE;
    onLoading(true);

    // Chuyển `filters` thành query string
    let filterParams = "";
    if (filters) {
      filterParams = Object.entries(filters)
        // Bỏ qua giá trị null/undefined/rỗng/NAN
        .filter(
          ([, value]) => value !== undefined && value !== null && value !== ""
        )
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}=${value.join(",")}`;
          }
          return `${key}=${value}`;
        })
        .join("&");
    }

    const url = `${
      this.API_URL
    }/classes/suggests/${userId}?user_type=${userType}&page=${page}&perPage=${perPage}${
      filterParams ? `&${filterParams}` : ""
    }`;
    console.log(">>> suggest class url: ", url);

    axios
      .get(url)
      .then((response) => {
        const data = response.data.data;
        onNext(data.classes, data.pagination);
      })
      .catch((err) => {
        console.log("Error: ", err);
        onNext([], new Pagination);
      });
  }

  public static getFilterClasses(
    userId: string,
    userType: number,
    page: number,
    filters: Filters | undefined,
    onNext: (classes: Class[], pagination: Pagination) => void,
    onLoading: (loading: boolean) => void
  ) {
    const perPage = Values.PERPAGE;
    onLoading(true);

    // Chuyển `filters` thành query string
    let filterParams = "";
    if (filters) {
      filterParams = Object.entries(filters)
        // Bỏ qua giá trị null/undefined/rỗng/NAN
        .filter(
          ([, value]) => value !== undefined && value !== null && value !== ""
        )
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}=${value.join(",")}`;
          }
          return `${key}=${value}`;
        })
        .join("&");
    }

    const url = `${
      this.API_URL
    }/classes/filter/${userId}?user_type=${userType}&page=${page}&perPage=${perPage}${
      filterParams ? `&${filterParams}` : ""
    }`;
    console.log(">>> filter class url: ", url);

    axios
      .get(url)
      .then((response) => {
        const data = response.data.data;
        onNext(data.classes, data.pagination);
      })
      .catch((err) => {
        console.log("Error: ", err);
        onNext([], new Pagination());
        onLoading(true);
      });
  }

  // get attending class with user id
  public static getCLassesByUserId(
    userId: string,
    onNext: (classes: Class[]) => void,
    onLoading: (loading: boolean) => void
  ) {
    // console.log(">>> url: ", this.API_URL);
    onLoading(true);
    axios
      .get(`${this.API_URL}/classes/${userId}`)
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

  // tạo lớp cho gia sư
  public static createClass(
    title: string,
    description: string,
    majorId: number,
    classLevelId: number,
    maxLearners: number,
    price: number,
    startedAt: number | null,
    endedAt: number | null,
    createdAt = new Date().getTime(),
    province: string,
    district: string,
    ward: string,
    detail: string,
    tutorId: string,
    authorId: string,
    lessons: Lesson[],
    onNext: (result: boolean, insertId?: number) => void
  ) {
    console.log(
      "create class data: ",
      JSON.stringify(
        {
          title,
          description,
          major_id: majorId,
          class_level_id: classLevelId,
          max_learners: maxLearners,
          price,
          started_at: startedAt,
          ended_at: endedAt,
          created_at: createdAt,
          province,
          district,
          ward,
          detail,
          tutor_id: tutorId, // Thêm vào payload
          author_id: authorId, // Thêm vào payload
          lessons,
        },
        null,
        2
      )
    );

    axios
      .post(`${this.API_URL}/classes/create`, {
        title,
        description,
        major_id: majorId,
        class_level_id: classLevelId,
        price,
        started_at: startedAt,
        ended_at: endedAt,
        created_at: createdAt,
        max_learners: maxLearners,
        province,
        district,
        ward,
        detail,
        tutor_id: tutorId, // Thêm vào payload
        author_id: authorId, // Thêm vào payload
        lessons,
      })
      .then((response) => {
        console.log("Class created successfully:", response.data);
        onNext(true, response.data.data.classId); // Truyền `classId` về từ response
      })
      .catch((err) => {
        console.error("Error:", err);
        console.log(">>> title", "Tạo lớp không thành công");
        onNext(false);
      });
  }

  // tạo lớp cho phụ huynh
  // Update the static method to accept user, tutorId, and authorId as parameters
  public static createClassForLearner(
    title: string,
    description: string,
    majorId: number,
    classLevelId: number,
    price: number,
    startedAt: number | null,
    endedAt: number | null,
    createdAt = new Date().getTime(),
    maxLearners: number | 1,
    province: string,
    district: string,
    ward: string,
    detail: string,
    tutorId: string | "",
    authorId: string,
    lessons: Lesson[],
    userIds: string[],
    onNext: (result: boolean, insertId?: number) => void
  ) {
    // Kiểm tra và gán userIds nếu nó rỗng
    const finalUserIds = userIds.length > 0 ? userIds : [authorId];

    console.log(
      "create class data: ",
      JSON.stringify(
        {
          title,
          description,
          major_id: majorId,
          class_level_id: classLevelId,
          price,
          started_at: startedAt,
          ended_at: endedAt,
          max_learners: maxLearners || 1,
          province,
          district,
          ward,
          detail,
          tutor_id: tutorId || "", // Thêm vào payload
          author_id: authorId, // Thêm vào payload
          lessons,
          userIds: finalUserIds,
        },
        null,
        2
      )
    );

    axios
      .post(`${this.API_URL}/classes/create-learner`, {
        title,
        description,
        major_id: majorId,
        class_level_id: classLevelId,
        price,
        started_at: startedAt,
        ended_at: endedAt,
        created_at: createdAt,
        max_learners: maxLearners || 1,
        province,
        district,
        ward,
        detail,
        tutor_id: tutorId || "", // Thêm vào payload
        author_id: authorId, // Thêm vào payload
        lessons,
        userIds: finalUserIds,
      })
      .then((response) => {
        console.log("Class created successfully:", response.data);
        onNext(true, response.data.data.classId); // Truyền `classId` về từ response
      })
      .catch((err) => {
        console.error("Error:", err);
        console.log(">>> title", "Tạo lớp không thành công");
        onNext(false);
      });
  }

  // update class
  public static updateClass(
    class_id: number,
    title: string,
    description: string,
    major_id: number,
    class_level_id: number,
    max_learners: number,
    price: number,
    started_at: number,
    ended_at: number,
    updated_at = new Date().getTime(),
    address_id: number,
    province: string,
    district: string,
    ward: string,
    detail: string,
    onNext: (result: boolean, errorMessage?: string) => void
  ) {

    console.log("data update class: ", JSON.stringify({
      class_id: class_id,
      title,
      description,
      major_id: major_id,
      class_level_id: class_level_id,
      max_learners: max_learners,
      price,
      started_at: started_at,
      ended_at: ended_at,
      updated_at: updated_at,
      address_id: address_id,
      province,
      district,
      ward,
      detail,
    }, null, 2));
    

    axios
      .put(`${this.API_URL}/classes/update`, {
        class_id: class_id,
        title,
        description,
        major_id: major_id,
        class_level_id: class_level_id,
        max_learners: max_learners,
        price,
        started_at: started_at,
        ended_at: ended_at,
        updated_at: updated_at,
        address_id: address_id,
        province,
        district,
        ward,
        detail,
      })
      .then((response) => {
        console.log("Class updated successfully:", response.data);
        onNext(true);
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || "Cập nhật lớp học thất bại.";
        console.error("Error updating class:", errorMessage);
        onNext(false, errorMessage);
      });
  }


  public static updateClassForLeaner(
    class_id: number,
    title: string,
    description: string,
    major_id: number,
    class_level_id: number,
    max_learners: number,
    price: number,
    started_at: number,
    ended_at: number,
    updated_at = new Date().getTime(),
    users: User[],
    address_id: number,
    province: string,
    district: string,
    ward: string,
    detail: string,
    onNext: (result: boolean, errorMessage?: string) => void
  ) {

    console.log("data update class: ", JSON.stringify({
      class_id: class_id,
      title,
      description,
      major_id: major_id,
      class_level_id: class_level_id,
      max_learners: max_learners,
      price,
      started_at: started_at,
      ended_at: ended_at,
      updated_at: updated_at,
      users: users,
      address_id: address_id,
      province,
      district,
      ward,
      detail,
    }, null, 2));
    

    axios
      .put(`${this.API_URL}/classes/update-learner`, {
        class_id: class_id,
        title,
        description,
        major_id: major_id,
        class_level_id: class_level_id,
        max_learners: max_learners,
        price,
        started_at: started_at,
        ended_at: ended_at,
        updated_at: updated_at,
        users: users,
        address_id: address_id,
        province,
        district,
        ward,
        detail,
      })
      .then((response) => {
        console.log("Class updated successfully:", response.data);
        onNext(true);
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || "Cập nhật lớp học thất bại.";
        console.error("Error updating class:", errorMessage);
        onNext(false, errorMessage);
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

  public static payFeeForClass(
    formData: FormData,
    onNext: (result: any) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);
    axios
      .post(`${this.API_URL}/classes/class-fee/pay`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        onLoading(false);
        console.log(">>> pay fee for class: ", response.data.data);
        onNext(response.data.data);
      })
      .catch((err) => {
        console.log("Error: ", err);
        console.log(err.message);
      });
  }

  public static acceptTutorForClass(
    classId: number,
    authorAccepted: boolean,
    onNext: (data: any) => void,
    onLoading: (loading: boolean) => void
  ) {
    onLoading(true);

    axios
      .put(`${this.API_URL}/classes/accept-tutor`, {
        class_id: classId,
        author_accepted: authorAccepted,
      })
      .then((response) => {
        onNext(response.data.data);
        onLoading(false);
      })
      .catch((err) => {
        console.error("Error enrolling in class:", err);
        console.log(">>> title", "Xác nhận gia sư cho lớp không thành công");
        onNext(err);
        onLoading(false);
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
    axios
      .post(`${this.API_URL}/reports/lockClass`, { classId })
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

  public static getAllClasses(onNext: () => void) {
    // console.log("clicked");

    axios({ method: "get", baseURL: this.API_URL + "/classes" })
      .then((result) => {
        // console.log("port", this.API_URL)
        // console.log("data", result.data);
        onNext();
      })
      .catch((err) => {
        // console.log("port", this.API_URL)
        // console.log("error", err);
        onNext();
      });
  }

  public static getClassById(
    classId: string,
    onNext: (classDetails: Class | undefined) => void,
    onLoading: (loading: boolean) => void
  ) {
    // Bắt đầu trạng thái tải
    onLoading(true);

    // Sửa lại URL API với :id làm tham số trong URL
    axios
      .get(`${this.API_URL}/classes/get_class_by_id/${classId}`) // Chú ý đường dẫn đã thay đổi
      .then((response) => {
        // Xử lý phản hồi từ API
        const classDetails = response.data.data; // Lấy dữ liệu lớp học từ phản hồi

        // Trả về dữ liệu lớp học qua onNext
        onNext(classDetails);

        // Kết thúc trạng thái tải
        onLoading(false);
      })
      .catch((error) => {
        // Log lỗi nếu xảy ra
        console.error("Error fetching class by ID: ", error);

        // Trả về undefined nếu có lỗi
        onNext(undefined);

        // Kết thúc trạng thái tải
        onLoading(false);
      });
  }
}
