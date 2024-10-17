import Class from "../models/Class";
import axios, { Axios } from "axios";

const baseURL = process.env.API_LOCAL_BASE_URL || "http://192.168.1.69:3002/api";
export default class AClass {
    
    public static getAllClasses(onNext: ()=> void){
        console.log("clicked");
        
        axios({method: 'get', baseURL: baseURL +'/classes'})
        .then(
            (result)=> {
                console.log("port", baseURL)
                console.log("data", result.data);
                onNext();
            }
        ).catch(
            (err)=> {
                console.log("port", baseURL)
                console.log("error", err);
                onNext();
            }
        )
    }
}