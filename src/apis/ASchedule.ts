import axios from "axios";
import Lesson from "../models/Lesson";
import ReactAppUrl from "../configs/ConfigUrl";
import User from "../models/User";


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

    public static getTutorSchedule(tutor_id: string, onNext: (lesson: Lesson[])=> void){
        axios.get(`${BASE_URL}/tutor/${tutor_id}`)
        .then((response)=>{
            const lessons = response.data.data as Lesson[]
            // console.log(JSON.stringify(lessons, null, 2));
            
            onNext(lessons);
        }).catch((err)=>{
            console.log(err);
            onNext([])
        })
    }
    public static getLearnerSchedule(tutor_id: string, onNext: (lesson: Lesson[])=> void){
        axios.get(`${BASE_URL}/learner/${tutor_id}`)
        .then((response)=>{
            const lessons = response.data.data as Lesson[]
            onNext(lessons);
        }).catch((err)=>{
            console.log(err);
            onNext([])
        })
    }

    public static getUserParentAndChild(user_id: string, onNext: (users: User[])=> void){
        axios.get(`${BASE_URL}/user/${user_id}`)
        .then((response)=> {
            const users = response.data.data[0] as User[];
            onNext(users)
        })
        .catch((err)=> {
            console.log(err);
            onNext([])
        })
    }

}

