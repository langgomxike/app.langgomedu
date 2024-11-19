import React, {useCallback, useState} from "react";
import {View, StyleSheet, Button, Modal, Text, TouchableOpacity} from "react-native";
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";
import HLine, {HLineType} from "./HLine";

//define type
type ConfirmDialogProps = {
    title: string,
    content: string,
    open: boolean,
    confirm?: string,
    cancel?: string,
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog = ({
                           title, content, open = false, confirm = 'Confirm', cancel = 'Cancel',
                           onConfirm = () => {
                           },
                           onCancel = () => {
                           }
                       }: ConfirmDialogProps) => {
    return (
        <View style={[styles.container, !open && {zIndex: -1, width: 0, height: 0}]}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={open}
                onRequestClose={onCancel}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.dialogContainer}>
                        <Text style={styles.dialogTitle}>{title.toUpperCase()}</Text>
                        <Text style={styles.dialogMessage}>{content}</Text>

                        {/* Horizontal Line */}
                        <HLine type={HLineType.LIGHT}/>

                        <View style={styles.buttonContainer}>
                            {/* cancel button */}
                            <TouchableOpacity style={styles.confirmButton} onPress={onCancel}>
                                <Text style={styles.buttonText}>{cancel}</Text>
                            </TouchableOpacity>
                            {/* confirm button */}
                            <TouchableOpacity style={styles.cancelButton} onPress={onConfirm}>
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
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        zIndex: 100,
        // backgroundColor: "red"
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
        shadowOffset: {width: 0, height: 2},
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
    TextConfirm: {
        fontWeight: 'bold'
    }

})
export default ConfirmDialog;
