import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

type BackProps = {
    title?: string,
    name?: string
    backgroundColor?: string,
    iconColor?: string,
    textColor?: string
}


const BackWithTitle = ({name = '', title = '',backgroundColor ='#fff', iconColor = '#000', textColor = '#000'}: BackProps) => {
    return (
        <View style={[styles.backTitle, {backgroundColor: backgroundColor}]}>
                <Ionicons name="chevron-back" size={28} color={iconColor} />
                <Text style={[styles.text, {color: textColor}]}> {title} </Text>
                <Text style={[styles.name, {color: textColor}]}>{name} </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    backTitle: {
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    text:{
        fontSize: 24,
        fontWeight: 'regular',
    },
    name:{
        fontSize: 24,
        fontWeight: 'bold'
    }
})


export default BackWithTitle;