import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { BackgroundColor, BorderColor, TextColor } from "../../configs/ColorConfig";
//define props need to use
type DayProps = {
    day: number,
    dayOfWeek: string,
    isClassLeaner?: boolean,
    isClassTutor?: boolean,
    isToday?: boolean,
}

const classToday: Array<any> = []

// const [isActive, setActive] = useState(false)

const DayBox = ({ day, dayOfWeek, isClassLeaner = false, isClassTutor = false, isToday = false }: DayProps) => {

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
    container:{
        flex:1,
        flexDirection:"column",
        justifyContent:'center',
        alignItems:'center',
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
        width:45,
        height: 70,
        padding: 10,
    },
    day: {
        marginBottom:8,
        fontWeight: 'bold',
        fontSize: 16,
        color: TextColor.white,
    },
    dayOfWeek: {
        marginTop:2,
        fontWeight: 'semibold',
        fontSize: 9,
        color: TextColor.white
    },
    classBox:{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom:10,
        opacity:0.5,
    },
    classLeaner: {
        marginHorizontal:5,
        width: 8,
        height: 8,
        borderRadius: 8,
        backgroundColor: BackgroundColor.gray_30,
        
        
    },
    classTutor: {
        marginHorizontal:5,
        width: 8,
        height: 8,
        borderRadius: 8,
        backgroundColor: BackgroundColor.gray_49,
    }

})

export default DayBox;
