import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { BackgroundColor, BorderColor, TextColor } from "../../configs/ColorConfig";


const TimeLine = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
        const time = `${i < 10 ? '0' + i : i}:00`; // Định dạng giờ: phút
        times.push(time);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>InComing Class</Text>
            <ScrollView style={styles.scrollView}>
                <View>
                    {times.map((time, index) => (
                        <View key={index} style={styles.timeBox}>
                            <View style={styles.mainHour}>
                                <Text style={styles.timeText}>{time}</Text>
                                <View style={styles.mainLine}></View>
                            </View>
                            <View style={styles.halfLine}></View>
                        </View>
                    ))}
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
        paddingHorizontal: 10,
        marginTop: 20,
        marginHorizontal: 10,
    },
    title: {
        fontSize: 22,
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
        fontSize: 18,
        fontWeight: 'regular',
        color: TextColor.black,
        opacity: .5,
    },
    mainHour: {
        flexDirection: 'row',
    },
    mainLine: {
        borderBottomWidth: 1,
        borderBottomColor: BorderColor.black,
        opacity: .3,
        width: '100%',
        transform: [{ translateY: -12 }],
        marginLeft: 5,
    },
    halfLine: {
        borderBottomWidth: 1,
        borderBottomColor: BorderColor.black,
        opacity: .3,
        width: '100%',
        transform: [{ translateY: 25 }]
    },
    scrollView: {
        backgroundColor: BackgroundColor.white,
        marginBottom: 10,
    },
})

export default TimeLine;