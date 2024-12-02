import Certificate from "../models/Certificate";
import User from "../models/User";
import Major from "../models/Major";
import ReactAppUrl from "../configs/ConfigUrl";
import axios from "axios";

const API_URL = ReactAppUrl.API_BASE_URL  + "/certificates"
export default class ACertificate {

    public static uploadFiles(formData: FormData, onNext: (data: any)=> void, onLoading: (loading: boolean)=> void ) {
        console.log(`${API_URL}/uploads`);
        
        axios.post(`${API_URL}/uploads`, formData,{
            headers: {
            'Content-Type' : 'multipart/form-data',
        }})
        .then((results)=> {
            console.log(">>> upload Certificate images", results.data.data);
            onNext(results.data.data)
        })
        .catch((err)=> {
            console.log("Upload error:", err);
            onNext([])
            
        })
    }
}