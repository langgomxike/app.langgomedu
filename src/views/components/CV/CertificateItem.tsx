import { View, StyleSheet, Text, Image } from "react-native";
import ReactAppUrl from "../../../configs/ConfigUrl";
import { useCallback, useEffect, useState } from "react";
import Certificate from "../../../models/Certificate";
import { TouchableOpacity } from "react-native-gesture-handler";
import Feather from '@expo/vector-icons/Feather';
import { BackgroundColor } from "../../../configs/ColorConfig";
import ModalShowEvidence from "../modal/ModalShowEvidence";
import File from "../../../models/File";

export type CertificateItemProp = {
    onDelete: (certificate: Certificate) => void
    certificate: Certificate
    isEdit?: boolean
}

const CertificateItem = ({ onDelete, certificate, isEdit = false }: CertificateItemProp) => {

    // STATES >>>>>>>>>.
    const [isShowEvidence, setIsShowEvidence] = useState(false);
    // HANDLERS >>>>>>>>.
    const handleOnDelete = useCallback(() => {
        onDelete(certificate);
    }, [])

    // EFFECT >>>>>>>>>>
    useEffect(() => {
        if (certificate) {
        }
    }, [])

    return (
        <View style={styles.box}>
            <View style={styles.iconBox}>
                <TouchableOpacity onPress={()=>{ setIsShowEvidence(true) }}>
                    <Image
                        style={styles.icon}
                        source={require('../../../../assets/icons/ic_gradute_and_scroll.png')} />
                </TouchableOpacity>
            </View>
            <View style={styles.textBox}>
                <Text style={styles.title}> {certificate?.name}</Text>
                <Text style={styles.description}> {certificate?.note} , {certificate?.score}</Text>
            </View>
            {isEdit && <View style={styles.deleteContainer}>
                <TouchableOpacity onPress={handleOnDelete} style={styles.deleteBtn}>
                    <Feather name="trash-2" size={18} color={BackgroundColor.gray_c6} />
                </TouchableOpacity>
            </View>}
            <ModalShowEvidence
                image_uri={(certificate.evidence as File).path}
                visiable={isShowEvidence}
                onClose={setIsShowEvidence}
            />
        </View>
    )
}
export default CertificateItem;

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
