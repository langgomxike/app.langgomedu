import axios from "axios";
import Class from "../models/Class";
import ReactAppUrl from "../configs/ConfigUrl";

export default class AClass {
  private static API_URL = ReactAppUrl.API_BASE_URL;

  public static getClassById(
    classId:number,
    onNext: (course:Class, realatedClasses: Class[]) => void,
    onLoading: (loading: boolean) => void
  ){
    onLoading(true);
    axios.get(`${this.API_URL}/classes/${classId}`)
    .then((response) => {
      const data = response.data.data
      onNext(data.class, data.related_classes);
      onLoading(false);
    })
    .catch((err) => {
      console.log("Error: ", err);
      onNext(new Class(), []);
      onLoading(true);
    });
  }

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
}
