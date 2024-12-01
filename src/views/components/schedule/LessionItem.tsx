import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { BackgroundColor, TextColor } from '../../../configs/ColorConfig';
import File from '../../../models/File';
import ReactAppUrl from '../../../configs/ConfigUrl';
import { NavigationContext } from "@react-navigation/native";
import ScreenName from '../../../constants/ScreenName';
import moment from 'moment';
import Lesson from '../../../models/Lesson';
import User from '../../../models/User';

export type LessionItemProps = {
    selectedUser: User
    lessonData: Lesson;
    classId?: number,
    classIcon?: string,
    title: string,
    classType: number,
    tutorName: string,
    startedAt: Date,
    duration: number,
    selectedDate: Date,
}
const URL = ReactAppUrl.PUBLIC_URL;

const LessionItem = ({selectedUser ,lessonData, classId, classIcon, title, classType, tutorName, startedAt, duration, selectedDate}: LessionItemProps) => {
    const endedAt: Date = new Date(startedAt?.getTime() + duration * 1000);
    const navigation = useContext(NavigationContext);

    const handleNavigateToLeanerAttendance = () => {
        navigation?.navigate(ScreenName.ATTENDED_FOR_LEARNER, { lesson:lessonData, user: selectedUser });
    }

    const handleNavigateToTutorRequestAttendance = () => {
        navigation?.navigate(ScreenName.ATTENDED_FOR_TUTOR,  {lesson:lessonData });
    }



    return (
        <TouchableOpacity onPress={classType === 1 ? handleNavigateToLeanerAttendance : handleNavigateToTutorRequestAttendance} style={[lessonStyle.container, classType === 1 ? lessonStyle.learnerClass : lessonStyle.tutorClass]}>
            <View style={lessonStyle.itemspace} id="top">
                <View style={lessonStyle.class}>
                    <Image
                        // source={{ uri: "https://cdn-icons-png.flaticon.com/128/11418/11418651.png" }}
                        source={{ uri: URL + classIcon }}
                        style={lessonStyle.classIcon} />

                    <Text style={[lessonStyle.textStyle, lessonStyle.title]} id="title">
                        {title.length > 21 ? `${title.slice(0, 21)}...` : title}
                    </Text>
                </View>
                <Text style={lessonStyle.textStyle} id="type">
                    {classType === 1 ? "Lớp Học" : "Lớp Dạy"}
                </Text>
            </View>
            <View style={lessonStyle.itemspace}>
                <Text style={lessonStyle.textStyle} id="tutor">
                    <Image style={lessonStyle.bottomIcon}
                        source={require("../../../../assets/images/teacher.png")} />
                    {tutorName}</Text>
                <Text style={lessonStyle.textStyle} id="time">
                    <Image style={lessonStyle.bottomIcon}
                        source={require("../../../../assets/images/clock.png")} />
                    {`${startedAt.getHours()}:${startedAt.getMinutes()} `} - {`${endedAt.getHours()}:${endedAt.getMinutes()} `}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const lessonStyle = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: BackgroundColor.white,
        borderRadius: 10,
        // borderColor: "#CD84F1",
        borderWidth: 1,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        gap: 20,
        elevation: 4,
        justifyContent: "space-between",
    },
    textStyle: {
        color: TextColor.black,
        fontWeight: 'semibold',
    },
    class: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    itemspace: {
        flexDirection: 'row',
        justifyContent: "space-between",
    },
    classIcon: {
        width: 35,
        height: 35
    },
    bottomIcon: {
        width: 20,
        height: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    tutorClass: {
        borderColor: BackgroundColor.schedule_tutor
    },
    learnerClass: {
        borderColor: BackgroundColor.schedule_leaner
    }
})

export default LessionItem