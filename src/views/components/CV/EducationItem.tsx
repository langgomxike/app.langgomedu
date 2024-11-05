import { View, StyleSheet, Text, Image } from "react-native";
import Education from "../../../models/Education";
import ReactAppUrl from "../../../configs/ConfigUrl";
import { useEffect, useState } from "react";

export type EducationItemProp = {
    education? : Education
}

const EducationItem = ({education}: EducationItemProp) => {

    const [startedAt, setStartedAt] = useState<Date>(new Date());
    const [endedAt, setEndedAt] = useState<Date>(new Date());
    useEffect(()=>{
        if(education){
            setStartedAt(new Date(education.started_at));
            setEndedAt(new Date(education.ended_at));
        }
    }, [])
    
    return (
        <View style={styles.box}>
        <View style={styles.iconBox}>
            <Image
                style={styles.icon}
                source={{uri: ReactAppUrl.PUBLIC_URL + education?.iconPath}} />
        </View>
        <View style={styles.textBox}>
            <Text style={styles.title}> {education?.title}</Text>
            <Text style={styles.description}> {education?.description} </Text>
            <Text> {`${startedAt.getFullYear()} - ${endedAt.getFullYear()}`} </Text>
        </View>
    </View>
    )
}
export default EducationItem;

const styles = StyleSheet.create({
    box: {
        flexDirection: 'row',
    },
    icon: {
        width: 40,
        height: 40,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    description: {

    },
    textBox: {
        // borderWidth: 1,
        flex: 1,
    },
    iconBox:{
        // borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    }
})
