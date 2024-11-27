import { Image, View, StyleSheet, Text } from "react-native"
import Experience from "../../../models/Experience"
import ReactAppUrl from "../../../configs/ConfigUrl"
import { useEffect, useState } from "react"

export type ExperienceItemProp = {
    experience? : Experience
}
export enum months{
    'jan' = 0,
    'feb' = 1,
    'mar' = 2,
    'apr' = 3,
    'may' = 4,
    'jun' = 5, 
    'jul' = 6,
    'aug' = 7,
    'sep' = 8,
    'oct' = 9,
    'nov' = 10,
    'dec' = 11,
}


const ExperienceItem = ({experience}: ExperienceItemProp) => {
    //state
    const [startedAt, setStartedAt] = useState<Date>(new Date()); 
    const [endedAt, setEndedAt] = useState<Date>(new Date()); 

    useEffect(()=>{
        // console.log(experience);
        if(experience){
            setStartedAt(new Date(experience.started_at ? experience.started_at : Date.now()))
            setEndedAt(new Date(experience.ended_at ? experience.ended_at : Date.now()))
        }
        
    }, [])

    return (
        <View style={styles.box}>
            <View style={styles.iconBox}>
                <Image
                    style={styles.icon}
                    source={require('../../../../assets/icons/ic_gradute_and_scroll.png')} />
            </View>
            <View style={styles.textBox}>
                <Text style={styles.title}>{experience?.name}</Text>
                <Text style={styles.description}> {experience?.note} </Text>
                <Text>{`${months[startedAt.getMonth()]} ${startedAt.getFullYear()} - ${months[endedAt.getMonth()]} ${endedAt.getFullYear()} | ${endedAt.getFullYear() - startedAt.getFullYear()} yrs ${endedAt.getMonth() - startedAt.getMonth() === 0 ? `` : `${endedAt.getMonth() - startedAt.getMonth()} mons` } `}</Text>
            </View>
        </View>
    )
}
export default ExperienceItem;

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