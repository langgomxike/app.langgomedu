import axios from "axios";
import Class from "../models/Class";
import ReactAppUrl from "../configs/ConfigUrl";

export default class AClass {
  private static API_URL = ReactAppUrl.API_BASE_URL;

  public static getAttedingClass(
    userId: string,
    onNext: (classes: Class[]) => void,
    onLoading: (loading: boolean) => void
  ) {

    // console.log(">>> url: ", this.API_URL);
    

    onLoading(true);
    axios.get(`${this.API_URL}/classes/attending/${userId}`)
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

  public static getTeachingClass(
    userId: string,
    onNext: (classes: Class[]) => void,
    onLoading: (loading: boolean) => void
  ) {

    onLoading(true);
    axios.get(`${this.API_URL}/classes/teaching/${userId}`)
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

  public static getCreatedClass(
    userId: string,
    onNext: (classes: Class[]) => void,
    onLoading: (loading: boolean) => void
  ) {

    onLoading(true);
    axios.get(`${this.API_URL}/classes/created/${userId}`)
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