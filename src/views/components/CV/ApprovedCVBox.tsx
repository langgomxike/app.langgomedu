import { View, StyleSheet, Text, Image } from "react-native";
import HLine, { HLineType } from "../HLine";
import { ReactNode } from "react";
import { BackgroundColor, BorderColor } from "../../../configs/ColorConfig";
export type ApprovedCvBoxProps = {
    isOld?: boolean,
    title: string,
    children?: ReactNode,
}

const CvBox = ({isOld = false, title, children }: ApprovedCvBoxProps) => {
    return (
        <View style={[styles.box, isOld ? styles.old: styles.new ]}>
            <Text style={styles.title}>{title}</Text>
            <HLine type={HLineType.LIGHT} color={isOld ? BackgroundColor.warning : BackgroundColor.sub_primary} />
            <View style={styles.children}>
                {children}
            </View>
        </View>
    )
}
export default CvBox

const styles = StyleSheet.create({
    box: {
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: BackgroundColor.white,
        borderColor: BackgroundColor.gray_e6,
        elevation: 2,
        paddingBottom: 20, 
    },
    old: {
        borderColor: BackgroundColor.warning,
    },
    new: {
        borderColor: BackgroundColor.sub_primary,
    },
    title: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold'
    },
    children:{
        marginTop: 10, 
        marginHorizontal: 10,
    }
})

