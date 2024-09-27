import React, { useState } from "react";
import { View, StyleSheet, Button, Modal, Text, TouchableOpacity } from "react-native";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";
import HLine, {HLineType} from "./HLine";

//define type
type ConfirmDialogProps = {
    title: string,
    content: string,
    buttonName: string,
    confirm?: string, 
    cancel?: string,
}

const ConfirmDialog = ({ title, content, buttonName, confirm = 'confirm', cancel = 'cancel'}: ConfirmDialogProps) => {
    //define state
    const [modalVisible, setModalVisible] = useState(false)
    //define handle
    const openConfirmDialog = () => {
        //show modal
        setModalVisible(true);
    }
    const handleCancel = () => {
        //hide modal
        setModalVisible(false)
    }
    const handleConfirm = () => {
        //hide modal
        setModalVisible(false)
    }

    return (
        <View style={styles.container}>
            <Button title={buttonName} onPress={openConfirmDialog} />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.dialogContainer}>
                        <Text style={styles.dialogTitle}>{title}</Text>
                        <Text style={styles.dialogMessage}>{content}</Text>

                        {/* Horizontal Line */}
                        <HLine type={HLineType.LIGHT}/>

                        <View style={styles.buttonContainer}>
                            {/* cancel button */}
                            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                                <Text style={styles.buttonText}>{cancel}</Text>
                            </TouchableOpacity>
                            {/* confirm button */}
                            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                                <Text style={[styles.buttonText, styles.TextConfirm]}>{confirm}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    dialogContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Tạo hiệu ứng nổi (Android)
    },
    dialogTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dialogMessage: {
        fontSize: 16,
        fontWeight: 'light',
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        padding: 10,
        marginHorizontal: 30,
    },
    confirmButton: {
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 40,
    },
    buttonText: {
        color: TextColor.sub_primary,
        fontWeight: 'regular',
        textAlign: 'center',
        fontSize: 16,
    },
    TextConfirm:{
        fontWeight: 'bold'
    }

})
export default ConfirmDialog;
