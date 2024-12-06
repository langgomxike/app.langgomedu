import React, { useCallback, useContext, useEffect } from "react";
import {
    Modal,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LanguageContext } from "../../../configs/LanguageConfig";
import ReactAppUrl from "../../../configs/ConfigUrl";

type ModalShowEvidenceProps = {
    visiable: boolean,
    onClose: (visible : boolean) => void,
    image_uri: string
};

export default function ModalShowEvidence({ visiable, onClose, image_uri }: ModalShowEvidenceProps) {
    // CONTEXT >>
    const language = useContext(LanguageContext).language
    // handlers >>
    const handleOnClose = useCallback(()=> {
        onClose(false)
    }, [])

    return (
        <Modal visible={visiable} transparent={true} animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{language.TRANSFER_IMAGE}</Text>
                        <TouchableOpacity onPress={handleOnClose}>
                            <Ionicons name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalBody}>
                        <ScrollView>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{
                                        uri: `${ReactAppUrl.PUBLIC_URL}/${image_uri}`,
                                    }}
                                    style={styles.imageContent}
                                    resizeMode="contain"
                                />
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "90%",
        height: "80%",
        marginTop: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 20,
        shadowColor: "#000",
        overflow: "hidden",
    },

    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },

    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    modalTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 20,
    },

    modalBody: {
        flex: 1,
    },

    imageContainer: {
        justifyContent: "center",
        marginTop: 20,
    },

    imageContent: {
        width: "100%",
        height: 500,
    },
});
