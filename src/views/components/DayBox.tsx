import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { BackgroundColor, BorderColor, TextColor } from "../../configs/ColorConfig";
//define props need to use
type DayProps = {
    day: number,
    dayOfWeek: string,
    isClassLeaner?: boolean,
    isClassTutor?: boolean,
    isActive?: boolean
}

const classToday: Array<any> = []

const DayBox = ({ day, dayOfWeek, isClassLeaner = false, isClassTutor = false, isActive = false }: DayProps) => {

    if (isClassLeaner) {
        classToday.push(
            <View style={styles.classLeaner}></View>
        )
    }
    if (isClassTutor) {
        classToday.push(
            <View style={styles.classTutor}></View>
        )
    }

    return (
        <View style={styles.container}>
                <View style={styles.daybox}>
                    <Text style={styles.day} >{day}</Text>
                    <Text style={styles.dayOfWeek}> {dayOfWeek} </Text>
                </View>

            <View style={styles.classBox}>
                <View style={styles.classLeaner}></View>
                <View style={styles.classTutor}></View>
            </View>
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
        padding: 9,
    },
    dayBox_active:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
        marginHorizontal: 3,
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: BackgroundColor.white,
        height: 70,
        padding: 9,
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
    },
    classBox: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
        opacity: 0.5,
    },
    classLeaner: {
        marginHorizontal: 5,
        width: 8,
        height: 8,
        borderRadius: 8,
        backgroundColor: BackgroundColor.gray_30,


    },
    classTutor: {
        marginHorizontal: 5,
        width: 8,
        height: 8,
        borderRadius: 8,
        backgroundColor: BackgroundColor.gray_49,
    }

})

export default DayBox;
