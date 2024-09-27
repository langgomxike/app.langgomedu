import React from "react";
import { View, StyleSheet } from "react-native";
import { BackgroundColor } from "../../configs/ColorConfig";
import DayBox from "./DayBox";

const WeekCalendar = () => {
    return (
        <View style={styles.weekCalendar}>
            <DayBox day="26" dayOfWeek="thu"></DayBox>
        </View>
    )
}

const styles = StyleSheet.create({
    weekCalendar: {
        width: 340,
        height: 120,
        backgroundColor: BackgroundColor.primary,
        borderTopLeftRadius:10,
        borderTopRightRadius:30,
        borderBottomLeftRadius:10,
        borderBottomRightRadius:30,
        elevation: 5,
    }
})

export default WeekCalendar;