import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

type DatePickerInputProps = {
  label: string;
  required: boolean;
  value?: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  editable?: boolean;
  maxLength?: number;
  style?: object;
};

const GRAY_DISABLE = "#EEE";

export default function DatePickerInput({
  label,
  required,
  value,
  onChangeText,
  placeholder,
  style,
}: DatePickerInputProps) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentData = selectedDate ?? date;
    setShowDatePicker(false);
    setDate(currentData);
    onChangeText(formatDate(currentData)); // Gọi hàm onChangeText với định dạng ngày
  };

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.container}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>

          <View style={[styles.inputBlock, styles.boxShadow]}>
            <TextInput
              style={[
                styles.input,
              ]}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor="#888"
              value={value}
              editable={false}
            />
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.iconInput}
              >
                <Ionicons name="calendar-outline" size={24} color="gray" />
              </TouchableOpacity>
            {/* Xử lý hiển thị date picker */}
            {showDatePicker && (
              <DateTimePicker
                mode="date"
                value={date}
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
    },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },

  required: {
    color: "red",
  },

  input: {
    flex: 1,
  },

  iconInput: {
  },

  inputBlock: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
  },

  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    elevation: 5,
  },
});
