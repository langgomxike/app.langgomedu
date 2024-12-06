import CV from "../models/CV";
import axios from "axios";
import ReactAppUrl from "../configs/ConfigUrl";

const baseURL = ReactAppUrl.API_BASE_URL + '/cvs'
export default class ACV {
  public static getAllCVList(onNext: (cvs: CV[]) => void) {
    axios.get(baseURL)
      .then((response) => {
        const cvs: CV[] = response.data.data;
        onNext(cvs);

      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        onNext([]);  // Nếu có lỗi, trả về mảng rỗng
      });

  }
  public static getPersonalCV(user_id: string, onNext: (cv: any[]) => void) {
    // console.log(baseURL+ '/cvs/'+ user_id);

    axios.get<any>(baseURL + '/' + user_id)
      .then((response) => {
        const data = response.data.data
        // console.log("data in ACV", JSON.stringify(data, null, 2));

        onNext(data)
      })
      .catch((err) => {
        console.log(err);

        onNext([])
      })
  }

  public static sendRequestCV(insertData: any, onNext: (data: any) => void, onLoading: (loading: boolean) => void) {
    onLoading(true);
    // console.log(`${baseURL}/uploadCV`);
    const data = JSON.stringify(insertData)
    // console.log(data);

    axios.post(`${baseURL}/uploadCV`, data, {
      headers: {
        "Content-Type": 'application/json',
      },
    })
      .then((response) => {
        console.log(">>> send request CV: ", response.data);
        onNext(response.data.data);
        onLoading(false)

      })
      .catch((err) => {
        console.log(">>> send request CV: ", err);
        onNext(err.message);
        onLoading(false)
      })
      .finally(() => {
        onLoading(false); // Kết thúc loading
      });

  }
}
