import CV from "../models/CV";
import axios from "axios";
import ReactAppUrl from "../configs/ConfigUrl";

const baseURL =  ReactAppUrl.API_BASE_URL
export default class ACV {
  public static getAllCVList(onNext: (cvs: CV[]) => void){
    axios.get(baseURL + '/cvs')
    .then((response) => {
      const cvs: CV[] = response.data.data; 
      onNext(cvs);
      
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      onNext([]);  // Nếu có lỗi, trả về mảng rỗng
    });

  }


  public static getPersonalCV( user_id: string,onNext: (cv?: CV) => void){
    // console.log(baseURL+ '/cvs/'+ user_id);
    
    axios.get<any>(baseURL+ '/cvs/'+ user_id)
    .then((response)=>{
      const data = response.data.data.cv
      // console.log("data in ACV", JSON.stringify(data, null, 2));
      
      onNext(data)
    })
    .catch((err)=>{
      console.log(err);
      
      onNext()
    })
  }
}
