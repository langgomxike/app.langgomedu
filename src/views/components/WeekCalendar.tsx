import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";
import DayBox from "./DayBox";
import { Day } from "../screens/PersonalSchedule";
import AClass from "../../apis/AClass";


export enum EdayOfWeek {
    'sun' = 0,
    'mon' = 1,
    'tue' = 2,
    'wes' = 3,
    'thi' = 4,
    'fri' = 5,
    'sat' = 6,
}
//order function
const getSunday = (currentDate: Date) => {
    const sunday = currentDate;
    sunday.setDate(sunday.getDate() - sunday.getDay() );
    return sunday
}

const WeekCalendar = ({ today, currentDate, onNext }: Day) => {

    //handler
    const handleOnClickDay = (onNext: (currentDate: Date) => void, clickedDate: Date) => {
        // console.log(clickedDate);
        AClass.getAllClasses(()=>{});
        onNext(clickedDate)
    }

    //effect

    const sunday = getSunday(today);
    const daysOfWeek: Array<any> = [];

    for (let index = 0; index < 7; index++) {
        const currentDay = new Date(sunday);  // Tạo bản sao của monday để tránh thay đổi trực tiếp
        currentDay.setDate(sunday.getDate() + index);

        daysOfWeek.push(
            <TouchableOpacity onPress={() => handleOnClickDay(onNext, currentDay)}  key={index} >
                <DayBox isActive={index == currentDate} day={currentDay.getDate()} dayOfWeek={EdayOfWeek[currentDay.getDay()]} />
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.control}>
                <TouchableOpacity style={styles.lastweekBox}>
                    <Text style={styles.lastWeek}> Last Week </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextWeekBox}>
                    <Text style={styles.nextWeek}> Next Week </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.weekCalendar}>
                {daysOfWeek}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100%',
        height: 180,
        backgroundColor: BackgroundColor.primary,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 30,
        paddingHorizontal: 10,
        elevation: 10,
    },
    weekCalendar: {
        height: 120,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center'
    },
    control: {
        height: 20,
        flexDirection: 'row',
        width: '100%',
    },
    lastweekBox:{
        width: '50%',
        alignItems: 'flex-start',
        paddingStart: 10,
    },
    lastWeek: {
        color: TextColor.white,
        fontSize: 16,
        fontWeight: 'semibold',
        textAlign: 'left',
    },
    nextWeekBox:{
        width: '50%',
        alignItems: 'flex-end',
        paddingEnd: 10,
    },
    nextWeek: {
        color: TextColor.white,
        fontSize: 16,
        fontWeight: 'semibold',
        textAlign: 'right',
    }
})

export default WeekCalendar;