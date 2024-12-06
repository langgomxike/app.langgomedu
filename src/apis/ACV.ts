import CV from "../models/CV";
import axios from "axios";
import ReactAppUrl from "../configs/ConfigUrl";
import Filters from "../models/Filters";
import Values from "../constants/Values";
import Pagination from "../models/Pagination";

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

  public static getSuggestedCVs(
    userId: string,
    page: number,
    address: string,
    onNext: (cvs: CV[], pagination: Pagination) => void,
    onLoading: (loading: boolean) => void){
      onLoading(true);
      const perPage = Values.SUGGESTS_CV_PERPAGE;
      // console.log("Get suggest cvs: ", `${baseURL}/cvs/suggests/${userId}?page=${page}&perPage=${perPage}&address=${address}}` );
      
    axios.get(`${baseURL}/cvs/suggests/${userId}?page=${page}&perPage=${perPage}&address=${address}`)
    .then((response) => {
      const data= response.data.data; 
      const cvs = data.cvs;
      const pagination = data.pagination;
      onNext(cvs, pagination);
      
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      onNext([], new Pagination);  // Nếu có lỗi, trả về mảng rỗng
    });

  }

  public static getFilterCVs(
    userId: string,
    page: number,
    filters: Filters,
    onNext: (cvs: CV[], pagination: Pagination) => void,
    onLoading: (loading: boolean) => void){
    
      const perPage = Values.SUGGESTS_CV_PERPAGE;
      onLoading(true);

      // Chuyển `filters` thành query string
     let filterParams = ""
     if(filters) {
      filterParams = Object.entries(filters)
      // Bỏ qua giá trị null/undefined/rỗng/NAN
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .map(([key, value]) => {
        if(Array.isArray(value)) {
          return `${key}=${value.join(",")}`;
        }
        return `${key}=${value}`;
      }).join("&");
     }
     console.log("ACV: ", filterParams);
     
    axios.get(baseURL + `/cvs/filter/${userId}?page=${page}&perPage=${perPage}&${filterParams ? `&${filterParams}` : ""}`)
    .then((response) => {
      const data = response.data.data
      const cvs: CV[] = data.cvs; 
      const pagination = data.pagination;
      onNext(cvs, pagination);
      
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      onNext([], new Pagination);  // Nếu có lỗi, trả về mảng rỗng
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
    console.log(data);

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
