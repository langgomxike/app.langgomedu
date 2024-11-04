import { View, StyleSheet, Text, Image } from "react-native";
import HLine, { HLineType } from "../HLine";
import { ReactNode } from "react";
import { BackgroundColor, BorderColor } from "../../../configs/ColorConfig";
export type CvBoxProps = {
    title: string,
    children?: ReactNode
}

const CvBox = ({ title, children }: CvBoxProps) => {
    return (
        <View style={styles.box}>
            <Text style={styles.title}>{title}</Text>
            <HLine type={HLineType.DASHED} />
            <View>
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
        elevation: 2
    },
    title: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold'
    },
})

