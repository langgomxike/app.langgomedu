import CV from "../models/CV";
import axios from "axios";
import User from "../models/User";
import Information from "../models/Information";
import Skill from "../models/Skill";
import Certificate from "../models/Certificate";
import Experience from "../models/Experience";
import Major from "../models/Major";
import Education from "../models/Education";
import ReactAppUrl from "../configs/ConfigUrl";

const baseURL =  ReactAppUrl.API_BASE_URL
export default class ACV {
  public static getAllCVList(onNext: (cvs: CV[]) => void){
    // const tutors = [
    //   {
    //     id: 1,
    //     avatar: "hinh1.png",
    //     userName: "Nguyen Văn A",
    //     phoneNumber: "0987654321",
    //     email: "nguyenvana@gmail.com",
    //     dayOfBirth: "29/9/2004",
    //     address: "228, đường số 6, Linh Chiểu, Thủ Đức",
    //     skills: [
    //       "Math",
    //       "Physics",
    //       "Chemistry",
    //       "Math",
    //       "Physics",
    //       "Chemistry",
    //     ],
    //   },
    //   {
    //     id: 2,
    //     avatar: "hinh2.png",
    //     userName: "Le Thi B",
    //     phoneNumber: "0123456789",
    //     email: "lethib@gmail.com",
    //     dayOfBirth: "15/8/2003",
    //     address: "12, đường số 10, Bình Thạnh",
    //     skills: ["English", "Biology"],
    //   },
    //   {
    //     id: 3,
    //     avatar: "hinh3.png",
    //     userName: "Tran Van C",
    //     phoneNumber: "0912345678",
    //     email: "tranvanc@gmail.com",
    //     dayOfBirth: "1/1/2002",
    //     address: "45, đường số 8, Quận 1",
    //     skills: ["History", "Geography"],
    //   },
    // ];

    // return new Promise<object[]>((resolve) => {
    //   setTimeout(() => {
    //     resolve(tutors);
    //   }, 500);
    // });
  
    axios<CV[]>({
      method: "GET",
      baseURL: baseURL+"/cvs"
    }).then((response) => {
      // console.log("data: ", response.data);
      const cvs: CV[] = response.data;
      // const data = response.data;
      // data.forEach((item : CV) => {
      //   const cv = item;
      //   cvs.push(cv);
      // })

      onNext(cvs);   
    }).catch((error) => {
      console.log("error", error);
      onNext([]);
    });

  }


  public static getPersonalCV( user_id: string,onNext: (cv?: CV) => void){
    // console.log(baseURL+ '/cvs/'+ user_id);
    
    axios.get<any>(baseURL+ '/cvs/'+ user_id)
    .then((response)=>{
      const data = response.data.data[0].CV
      // console.log("data in ACV", JSON.stringify(data));
      
      onNext(data as CV)
    })
    .catch((err)=>{
      console.log(err);
      
      onNext()
    })
  }
}
