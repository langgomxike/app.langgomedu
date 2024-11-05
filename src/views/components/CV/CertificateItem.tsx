import { View, StyleSheet, Text, Image } from "react-native";
import ReactAppUrl from "../../../configs/ConfigUrl";
import { useEffect, useState } from "react";
import Certificate from "../../../models/Certificate";

export type CertificateItemProp = {
    certificate? : Certificate
}

const CertificateItem = ({certificate}: CertificateItemProp) => {

    useEffect(()=>{
        if(certificate){
        }
    }, [])
    
    return (
        <View style={styles.box}>
        <View style={styles.iconBox}>
            <Image
                style={styles.icon}
                source={{uri: ReactAppUrl.PUBLIC_URL + certificate?.icon?.path}} />
        </View>
        <View style={styles.textBox}>
            <Text style={styles.title}> {certificate?.name}</Text>
            <Text style={styles.description}> {certificate?.vn_desc} </Text>
        </View>
    </View>
    )
}
export default CertificateItem;

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
