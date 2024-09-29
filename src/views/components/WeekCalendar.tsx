import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";
import DayBox from "./DayBox";

type weekly = {
    today: number,
    dayOfWeek: number,

}

export enum EdayOfWeek {
    'mon' = 0,
    'tue' = 1,
    'wes' = 2,
    'thi' = 3,
    'fri' = 4,
    'sat' = 5,
    'sun' = 6,
}
const getDayofWeek = (dayOfWeek: number): string => {
    if (dayOfWeek in EdayOfWeek) {
        return EdayOfWeek[dayOfWeek]
    }
    return 'invalid day'
}

const WeekCalendar = ({ today, dayOfWeek }: weekly) => {

    const Days: Array<any> = [];

    let enumDay: number = 0;
    for (let index = 0 - dayOfWeek; index < 7 - dayOfWeek; index++) {
        Days.push(
            <DayBox day={today + index} dayOfWeek={EdayOfWeek[enumDay]} />
        )
        enumDay++;

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
                {Days}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: 380,
        height: 180,
        backgroundColor: BackgroundColor.primary,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 30,
        paddingHorizontal: 10,
        elevation: 5,
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