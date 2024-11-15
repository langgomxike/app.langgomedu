import axios from "axios";
import Lesson from "../models/Lesson";
import ReactAppUrl from "../configs/ConfigUrl";


const BASE_URL = ReactAppUrl.API_BASE_URL + '/lessons';
export default class ASchedule {

    public static getWholeWeekLessons(user_id: string | undefined, student_id : string | undefined, onNext: (lessons:Lesson[])=> void) {
        axios.get(`${BASE_URL}?user_id=${user_id}&student_id=${student_id}`)
        .then((response)=>{
            const lessons = response.data.data as Lesson[]
            // console.log(response.data);
            // console.log("API LESSONS", JSON.stringify(response.data.data, null , 2) );
            
            onNext(lessons);
        }).catch((err)=> {
            console.log(err);
            onNext([]);
        })

    }
}

