import axios from "axios";
import ReactAppUrl from "../configs/ConfigUrl";

const API_URL = ReactAppUrl.API_BASE_URL + "/experiences"
export default class AExperience {

    public static uploadFiles(formData: FormData, onNext: (data: any)=> void, onLoading: (loading: boolean)=> void ) {
        console.log(`${API_URL}/uploads`);
        
        axios.post(`${API_URL}/uploads`, formData,{
            headers: {
            'Content-Type' : 'multipart/form-data',
        }})
        .then((results)=> {
            console.log(">>> upload Experience images", results.data.data);
            onNext(results.data.data)
        })
        .catch((err)=> {
            console.log("err", err);
            onNext([])
            
        })
    }
}