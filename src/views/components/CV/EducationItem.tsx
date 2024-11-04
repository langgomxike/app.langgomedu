import { View, StyleSheet, Text, Image } from "react-native";
import Education from "../../../models/Education";

export type EducationItemProp = {
    education? : Education
}

const EducationItem = ({education}: EducationItemProp) => {
    return (
        <View style={styles.box}>
        <View style={styles.iconBox}>
            <Image
                style={styles.icon}
                source={{uri: education? education.icon.path : ''}} />
        </View>
        <View style={styles.textBox}>
            <Text style={styles.title}> this is title</Text>
            <Text style={styles.description}> description </Text>
            <Text> 2019 - 2023 </Text>
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
