import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { BorderColor, TextColor } from "../../configs/ColorConfig";
//define props need to use
type DayProps = {
    day : string,
    dayOfWeek : string,
    isClassLeaner? : boolean,
    isClassTutor? : boolean,
    isToday? : boolean,
}

const classToday : Array<any> = []

// const [isActive, setActive] = useState(false)

const DayBox = ({day, dayOfWeek, isClassLeaner = false, isClassTutor = false, isToday =false}: DayProps) => {
    
    if(isClassLeaner){
        classToday.push(
            <View style={styles.classLeaner}></View>
        )
    }
    if(isClassTutor){
        classToday.push(
            <View style={styles.classTutor}></View>
        )
    }
    
    return (
        <View style={styles.daybox}>
            <Text style={styles.day} >{day}</Text>
            <Text style={styles.dayOfWeek}> {dayOfWeek} </Text>
            
        </View>
    )
}

const styles = StyleSheet.create({
    daybox:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
        marginHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: BorderColor.white,
        width: 50,
        height: 70,
        padding: 10,
    },
    day:{
        fontWeight: 'bold',
        fontSize: 20,
        color: TextColor.white,
    },
    dayOfWeek:{
        fontWeight: 'semibold',
        color: TextColor.white
    },
    classLeaner:{
        width: 20,
        height: 20,
        borderRadius: 20,
        
    },
    classTutor:{

    }
    
})

export default DayBox;
