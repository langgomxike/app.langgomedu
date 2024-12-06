import axios from "axios";
import ReactAppUrl from "../configs/ConfigUrl";
import Education from "../models/Education";

const API_URL = ReactAppUrl.API_BASE_URL + "/educations"
export default class AEducation {
    public static uploadFiles(formData: FormData, onNext: (data: any)=> void, onLoading: (loading: boolean)=> void ) {
        console.log(`${API_URL}/uploads`);
        
        axios.post(`${API_URL}/uploads`, formData,{
            headers: {
            'Content-Type' : 'multipart/form-data',
        }})
        .then((results)=> {
            console.log(">>> upload Education images", results.data.data);
            onNext(results.data.data)
        })
        .catch((err)=> {
            console.log("upload education errors:", err.message);
            onNext([])
        })
    }
    
    public static sendEducations(educations: Education[], eduImageIds: number[], onNext: (data: any) => void){
        
    }
}