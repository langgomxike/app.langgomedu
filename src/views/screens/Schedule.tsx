import React from "react";
import { View, StyleSheet } from "react-native";
import WeekCalendar from "../components/WeekCalendar";
import TimeLine from "../components/TimeLine";
import { BackgroundColor } from "../../configs/ColorConfig";

export type Day = {
    dayOfMonth : number,
    dayOfWeek : number,
    haveLearnerClass?: boolean,
    haveTutorClass?: boolean,
}
export type DaysOfWeek = {
    days : Array<Day>
}


const Schedule = ({days}:DaysOfWeek) => {
    
    return (
        <View style={styles.container}>
            <WeekCalendar days={days}/>
            <TimeLine />
        </View>
    )

}

const styles = StyleSheet.create({
    container:{
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: BackgroundColor.sub_primary,
    },
})

export default Schedule

