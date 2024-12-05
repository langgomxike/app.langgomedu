import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import Education from "../../../models/Education";
import ReactAppUrl from "../../../configs/ConfigUrl";
import { useEffect, useState } from "react";
import { BackgroundColor, BorderColor } from "../../../configs/ColorConfig";
import Feather from '@expo/vector-icons/Feather';

export type EducationItemProp = {
    education?: Education
    isEdit?: boolean
}

const EducationItem = ({ education, isEdit = false}: EducationItemProp) => {

    const [startedAt, setStartedAt] = useState<Date>(new Date());
    const [endedAt, setEndedAt] = useState<Date>(new Date());
    useEffect(() => {
        if (education) {
            setStartedAt(new Date(education.started_at));
            setEndedAt(new Date(education.ended_at));
        }
    }, [])

    return (
        <View style={styles.box}>
            <View style={styles.iconBox}>
                <Image
                    style={styles.icon}
                    source={require('../../../../assets/icons/ic_book.png')} />
            </View>
            <View style={styles.textBox}>
                <Text style={styles.title}> {education?.name}</Text>
                <Text style={styles.description}> {education?.note} </Text>
                <Text> {`${startedAt.getFullYear()} - ${endedAt.getFullYear()}`} </Text>
            </View>
            {isEdit && <View style={styles.deleteContainer}>
                <TouchableOpacity style={styles.deleteBtn}>
                    <Feather name="trash-2" size={18} color={BackgroundColor.gray_c6} />
                </TouchableOpacity>
            </View>}
        </View>
    )
}
export default EducationItem;

const styles = StyleSheet.create({
    box: {
        flexDirection: 'row',
        marginBottom: 5
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
    iconBox: {
        // borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    deleteContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    deleteBtn: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: BackgroundColor.gray_c6
    }
})
