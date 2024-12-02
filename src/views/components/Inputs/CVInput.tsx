import { Text, View, TextInput, StyleSheet, TouchableOpacity, } from "react-native";
import { BackgroundColor } from "../../../configs/ColorConfig";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useCallback, useState } from "react";
import moment from "moment";



export type CVInputProps = {
    onTextChange: (text: string) => void
    label?: string,
    value?: string,
    placeholder?: string,
    require?: boolean,
    editable?: boolean,
    datePicker?: boolean,
    textArea?: boolean,
    error?: boolean;
}

export default function Input({ onTextChange, label, placeholder, value = "", require = false, editable = false, datePicker = false, textArea = false, error = false }: CVInputProps) {

    //state
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    //handler
    const handleDateChange = (
        event: DateTimePickerEvent,
        selectedDate?: Date
    ) => {
        const currentData = selectedDate ?? date;
        setShowDatePicker(false);
        setDate(currentData);
        onTextChange(moment(currentData).format("DD/MM/YYYY")); // Gọi hàm onChangeText với định dạng ngày
    };
    const handleTextChange = useCallback((text: string) => {
        onTextChange(text)
    }, [onTextChange]);

    return (
        <View style={styles.container}>
            <View style={styles.labelBox}>
                <Text style={styles.label}> {label} </Text>
                {require ? <Text style={styles.require}> * </Text> : <Text></Text>}
            </View>
            <View style={[
                styles.box, textArea ? styles.textArea : styles.textInput,
                editable ? styles.enable : styles.disable,
                error && styles.errorBorder, // Áp dụng style lỗi nếu error=true
            ]}>
                {/* Khi datePicker=true, biến TextInput thành TouchableOpacity */}
                {datePicker ? (
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <TextInput
                            style={[styles.inputContainer, textArea && styles.textAreaContainer]}
                            multiline={textArea}
                            numberOfLines={textArea ? 4 : 1}
                            placeholder={placeholder}
                            editable={false} // Disable input trực tiếp
                            value={value}
                            pointerEvents="none" // Chặn input nhưng giữ text
                        />
                    </TouchableOpacity>
                ) : (
                    <TextInput
                        style={[styles.inputContainer, textArea && styles.textAreaContainer]}
                        multiline={textArea}
                        numberOfLines={textArea ? 4 : 1}
                        placeholder={placeholder}
                        editable={editable}
                        value={value}
                        onChangeText={handleTextChange}
                    />
                )}
                {datePicker &&
                    <TouchableOpacity
                        disabled={!editable}
                        onPress={() => setShowDatePicker(true)}
                        style={styles.iconCalendar}>
                        <Ionicons name="calendar-outline" size={24} color="gray" />
                    </TouchableOpacity>}

            </View>

            {showDatePicker && (
                <DateTimePicker
                    mode="date"
                    value={date}
                    display="default"
                    onChange={handleDateChange}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 10,
    },
    labelBox: {
        flexDirection: 'row'
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    require: {
        color: 'red'
    },
    box: {
        padding: 10,
        elevation: 1,
        borderRadius: 10,
        borderWidth: 0.5,
        flexDirection: 'row',
        gap: 10,
    },
    textInput: {
        justifyContent: 'space-between'

    },
    textArea: {
        alignItems: 'flex-start',
    },

    inputContainer: {
        flex: 1,
    },

    textAreaContainer: {
        textAlignVertical: 'top',
    },


    iconCalendar: {

    },
    enable: {
        borderColor: BackgroundColor.gray_30,
        backgroundColor: BackgroundColor.white,
    },
    disable: {
        borderColor: BackgroundColor.gray_50,
        backgroundColor: "#f0f0f0"
    },
    errorBorder: {
        borderColor: BackgroundColor.danger, // Màu đỏ khi có lỗi
    },

})