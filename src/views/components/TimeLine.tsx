import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { BackgroundColor, BorderColor, TextColor } from "../../configs/ColorConfig";
import Lesson from "../../models/Lesson";

export type LessonProps = {
    lessons: Array<Lesson>
}

const TimeLine = ({lessons}: LessonProps ) => {

    //handlers

    //generating timeline
    const times = [];
    for (let i = 0; i < 24; i++) {
        const time = `${i < 10 ? '0' + i : i}:00`; // Định dạng giờ: phút
        times.push(time);
    }
    //generate 

    // const todayLessons: Array<any> = [];
    // lessons.forEach(lesson => {
    //     // value
    //     const startedAt = new Date();
        
    //     //style for class
    //     const lessonStyle = StyleSheet.create({
    //         container:{
    //             position: 'absolute',
    //             width: '60%',
    //             height: 80,
    //             padding: 7,
    //             backgroundColor: BackgroundColor.schedule_tutor,
    //             left: 45,
    //             borderRadius: 8,
    //         },
    //         textStyle:{
    //             color: TextColor.white,
                
    //         }
    //     })
    //     //push class into array
    //     todayLessons.push(
    //         <View key={lesson.id} style={lessonStyle.container}>
    //             <Text style={lessonStyle.textStyle} id="title"> {lesson.day}</Text>
    //             <Text style={lessonStyle.textStyle}> {lesson.duration.getHours()} </Text>
    //             <Text> {} </Text>
    //         </View>
    //     )

    // });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>InComing Class</Text>
            <ScrollView style={styles.scrollView}
            nestedScrollEnabled={true}>
                <View>
                    {/* timeline */}
                    {times.map((time, index) => (
                        <View key={index} style={styles.timeBox}>
                            <View style={styles.mainHour}>
                                <Text style={styles.timeText}>{time}</Text>
                                <View style={styles.mainLine}></View>
                            </View>
                            <View style={styles.halfLine}></View>
                        </View>
                    ))}
                    {/* today lessons */}
                    {/* {todayLessons} */}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: BackgroundColor.white,
        height: 440,
        paddingHorizontal: 20,
        marginTop: 20,
        marginHorizontal: 10,
        borderColor: BorderColor.gray_30,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
    },
    title: {
        fontSize: 20,
        fontWeight: 'semibold',
        margin: 10,
        marginBottom: 15,
    },
    timeBox: {
        width: '100%', // Chiếm 90% màn hình
        paddingVertical: 20, // Khoảng cách giữa các giờ
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        height: 80,
    },
    timeText: {
        fontSize: 14,
        fontWeight: 'regular',
        color: TextColor.black,
        opacity: .3,
    },
    mainHour: {
        flexDirection: 'row',
    },
    mainLine: {
        borderBottomWidth: 1,
        borderBottomColor: BorderColor.black,
        opacity: .2,
        width: '100%',
        transform: [{ translateY: -10 }],
        marginLeft: 5,
    },
    halfLine: {
        borderBottomWidth: 1,
        borderBottomColor: BorderColor.black,
        opacity: .2,
        width: '100%',
        transform: [{ translateY: 28 }]
    },
    scrollView: {
        backgroundColor: BackgroundColor.white,
        marginBottom: 10,
    },
})

export default TimeLine;