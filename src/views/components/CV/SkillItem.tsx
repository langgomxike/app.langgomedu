import {
    View, StyleSheet,
    Image,
    Text
} from "react-native";
// import { ProgressBar } from "@react-native-community/progress-bar-android";
import * as Progress from "react-native-progress"

const SkillItem = () => {
    return (
        <View style={styles.box}>
            <View style={styles.iconBox}>
                <Image style={styles.icon} source={require("../../../../assets/avatar/account_tab.png")} />
            </View>
            <View style= {styles.progressBox}>
                <Text style={styles.name}> Name</Text>
                <Progress.Bar progress={0.5} width={280} height={7}/>
            </View>

        </View>
    )
}
export default SkillItem;

const styles = StyleSheet.create({
    box:{
        flexDirection: 'row',
        gap: 20,
    },
    iconBox:{
    },
    icon:{
        width: 40,
        height: 40,
    },
    progressBox:{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex: 1,
    },
    name:{
        fontSize: 18,
        marginBottom: 5,
        fontWeight: 'semibold'

    }
})