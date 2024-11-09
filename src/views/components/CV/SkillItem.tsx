import {
    View, StyleSheet,
    Image,
    Text
} from "react-native";
import * as Progress from "react-native-progress"
import Skill from "../../../models/Skill";
import ReactAppUrl from "../../../configs/ConfigUrl";
import { useEffect, useState } from "react";

export type SkillItemProp = {
    skill? : Skill
}


const SkillItem = ({skill}: SkillItemProp) => {

    const [progress, setProgress] = useState<number>(0);

    useEffect(()=>{
        if(skill){
            setProgress(skill.progress_percent / 100)
        }
    },[])
    return (
        <View style={styles.box}>
            <View style={styles.iconBox}>
                <Image style={styles.icon} 
                source={{uri: `${ReactAppUrl.PUBLIC_URL}${skill?.icon?.path}`}} />
            </View>
            <View style= {styles.progressBox}>
                <Text style={styles.name}> {skill?.vn_name}</Text>
                <Progress.Bar progress={progress} width={260} height={7}/>
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