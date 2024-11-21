import { Text, View, TextInput, StyleSheet, TouchableOpacity, } from "react-native";
import { BackgroundColor } from "../../../configs/ColorConfig";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";



export type CVInputProps = {
    onTextChange: (text: string) => void
    label?: string,
    value?: string,
    placeholder?: string,
    require?: boolean,
    editable?: boolean,
    datePicker?: boolean,
    textArea?: boolean
}

export default function Input({ onTextChange, label, placeholder, value="", require = false, editable = false, datePicker = false, textArea = false }: CVInputProps) {

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
        // onTextChange(formatDate(currentData)); // Gọi hàm onChangeText với định dạng ngày
    };
    const handleChangeText = (newText : string)=>{
        onTextChange(newText);
    }


    return (
        <View style={styles.container}>
            <View style={styles.labelBox}>
                <Text style={styles.label}> {label} </Text>
                {require ? <Text style={styles.require}> * </Text> : <Text></Text>}
            </View>
            <View style={[styles.box, textArea ? styles.textArea : styles.textInput , editable ? styles.enable : styles.disable]}>
                <TextInput 
                style={ [styles.inputContainer, textArea && styles.textAreaContainer] }
                multiline={textArea}
                numberOfLines={textArea ? 4 : 1}
                placeholder={placeholder} 
                editable={editable} 
                value={value}
                onChangeText={onTextChange}
                />
                {datePicker &&
                    <TouchableOpacity
                        disabled={datePicker}
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
        borderWidth: 1,
        flexDirection: 'row',
        gap: 10,
    },
    textInput:{
        justifyContent: 'space-between'

    },
    textArea:{
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
        backgroundColor: BackgroundColor.gray_e6
    },

})