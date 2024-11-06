import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { BackgroundColor, BorderColor, TextColor } from "../../../configs/ColorConfig";
import { toFormData } from "axios";
//define props need to use
type DayProps = {
    day: number,
    dayOfWeek: string,
    isActive?: boolean,
    isToday?: boolean,
}

const classToday: Array<any> = []

const DayBox = ({ day, dayOfWeek, isActive = false, isToday = false }: DayProps) => {

    return (
        <View style={styles.container}>
                <View style={ isActive? styles.dayBox_active : isToday ? styles.dayBox_today : styles.daybox}>
                    <Text style={ isActive ? styles.day_active : isToday ? styles.day_today : styles.day} >{day}</Text>
                    <Text style={ isActive ? styles.dayOfWeek_active : isToday ? styles.dayOfWeek_today : styles.dayOfWeek}> {dayOfWeek} </Text>
                </View>

                {
                isToday ?
                <View style={styles.todayPointActive}></View> :
                <View style={styles.todayPoint}></View>
                }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
    },
    daybox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
        marginHorizontal: 3,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: BorderColor.white,
        height: 60,
        paddingHorizontal: 10,
    },
    dayBox_active:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
        marginHorizontal: 3,
        borderRadius: 10,
        backgroundColor: BackgroundColor.white,
        borderWidth: 1,
        borderColor: BorderColor.white,
        height: 60,
        paddingHorizontal: 10,
    },
    dayBox_today: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
        marginHorizontal: 3,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: BorderColor.white,
        height: 60,
        paddingHorizontal: 10,
    },
    day: {
        marginBottom: 8,
        fontWeight: 'bold',
        fontSize: 16,
        color: TextColor.white,
    },
    day_active:{
        marginBottom: 8,
        fontWeight: 'bold',
        fontSize: 16,
        color: TextColor.primary,
    },
    day_today:{
        marginBottom: 8,
        fontWeight: 'bold',
        fontSize: 16,
        color: TextColor.white,
    },
    dayOfWeek: {
        textAlign: 'center',
        marginTop: 2,
        fontWeight: 'bold',
        fontSize: 8.5,
        color: TextColor.white,
        width: 20
    },
    dayOfWeek_active:{
        textAlign: 'center',
        marginTop: 2,
        fontWeight: 'semibold',
        fontSize: 8.5,
        color: TextColor.primary,
        width: 20
    },
    dayOfWeek_today:{
        textAlign: 'center',
        marginTop: 2,
        fontWeight: 'bold',
        fontSize: 8.5,
        color: TextColor.white,
        width: 20
    },
    classBox: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
        opacity: 0.5,
    },

    todayPointActive: {
        width: 10,
        height: 5,
        borderRadius: 5,
        backgroundColor: BackgroundColor.white,
    },

    todayPoint: {
        width: 10,
        height: 5,
        borderRadius: 5,
    }
})

export default DayBox;
