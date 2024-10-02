import React from "react";
import { View, StyleSheet } from "react-native";

//define enum for Horizontal Line Style
export enum HLineType {
    NORMAL = 'normal',
    LIGHT = 'light',
    DASHED = 'dashed',
    DOTTED = 'dotted',

}
//define type for HLine
type HLineProps = {
    type: HLineType,
    color?: string,
    thickness?: number,
}


const HLine = ({ type, color = '#000', thickness = 1 }: HLineProps) => {
    const lineStyle = getHLineStyle(type, color, thickness);
    return (
        <View style={lineStyle}></View>
    )
}

const getHLineStyle = (type: HLineType, color: string, thickness: number) => {
    const style = StyleSheet.create({
        normal:{
            borderBottomColor: color,
            borderBottomWidth: thickness,
            borderStyle: 'solid',
            marginVertical: 8,
            opacity: 1,
            width: '100%',
        },
        light:{
            borderBottomColor: color,
            borderBottomWidth: thickness,
            borderStyle: 'solid',
            marginVertical: 8,
            opacity: 0.2,
            width: '100%',
        },
        dashed:{
            borderBottomColor: color,
            borderBottomWidth: thickness,
            borderStyle: 'dashed',
            marginVertical: 8,
            opacity: 1,
            width: '100%',
        },
        dotted:{
            borderBottomColor: color,
            borderBottomWidth: thickness,
            borderStyle: 'dotted',
            marginVertical: 8,
            opacity: 1,
            width: '100%',
        },
        default:{
            borderBottomColor: color,
            borderBottomWidth: thickness,
            borderStyle: 'solid',
            marginVertical: 8,
            opacity: 1,
            width: '100%',
        }
    })
    
    switch (type) {
        case HLineType.NORMAL:
            return style.normal
        case HLineType.LIGHT:
            return style.light
        case HLineType.DASHED:
            return style.dashed
        case HLineType.DOTTED:
            return style.dotted
        default:
            return style.default
    }


}

export default HLine;