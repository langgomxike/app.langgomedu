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

type CustomInputProps = {
  label: string;
  required: boolean;
  value?: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
  placeholder: string;
  type:
    | "text"
    | "number"
    | "password"
    | "email"
    | "phone"
    | "date"
    | "textarea";
  editable?: boolean;
  maxLength?: number;
  style?: object;
};

const GRAY_DISABLE = "#EEE";

export default function CustomInput({
  label,
  required,
  value,
  onChangeText,
  placeholder,
  type,
  editable,
  style,
  maxLength,
  onSubmitEditing,
}: CustomInputProps) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [text, setText] = useState("");

  const MAX_LENGTH = maxLength ?? 3000;

  // Đặt keyboardType dựa trên loại input
  function getKeyboardType() {
    switch (type) {
      case "number":
        return "numeric";
      case "email":
        return "email-address";
      case "phone":
        return "phone-pad";
      default:
        return "default";
    }
  }

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

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const handleTextChange = (input: string) => {
    setText(input);
    onChangeText(input);
  };

  return (
    <View>
      {/* Các loại input như: "text", "number","password", "email","phone","date" */}
      {type != "textarea" && (
        <View style={style}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>

          <View style={[styles.inputBlock, styles.boxShadow]}>
            <TextInput
              style={[
                styles.input,
                editable === false
                  ? { backgroundColor: GRAY_DISABLE }
                  : { backgroundColor: "white" },
              ]}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor="#888"
              keyboardType={getKeyboardType()}
              value={value}
              secureTextEntry={type === "password" && !isPasswordVisible}
              editable={type === "date" || editable == false ? false : true}
              onEndEditing={onSubmitEditing}
            />
            {/* Ẩn hiện password */}
            {type === "password" && (
              <TouchableOpacity
                onPress={togglePasswordVisibility}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            )}
            {/* Ẩn hiện date picker */}
            {type === "date" && (
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={24} color="gray" />
              </TouchableOpacity>
            )}
            {/* Hiển thị Close x với thẻ input text */}
            {type !== "date" && type !== "password" && (
              <TouchableOpacity
                onPress={() => onChangeText("")}
              >
                <Ionicons name="close-sharp" size={24} color="gray" />
              </TouchableOpacity>
            )}

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
      )}

      {/* Textarea */}
      {type === "textarea" && (
        <View>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.label, { flex: 4 }]}>
              {label}
              {required && <Text style={styles.required}> *</Text>}
            </Text>

            <Text style={{ flex: 1, textAlign: "right" }}>
              {text.length}/{MAX_LENGTH}
            </Text>
          </View>

          <View style={[styles.textAreaContainer, styles.boxShadow]}>
            <TextInput
              style={[
                styles.inputTextarea,
                editable === false
                  ? { backgroundColor: GRAY_DISABLE }
                  : { backgroundColor: "white" },
              ]}
              onChangeText={handleTextChange}
              placeholder={placeholder}
              placeholderTextColor="#888"
              keyboardType={getKeyboardType()}
              value={value}
              editable={editable == false ? false : true}
              multiline={true}
              numberOfLines={6}
              maxLength={MAX_LENGTH}
            />
          </View>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  textAreaContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  inputTextarea: {
    textAlignVertical: "top",
  },

  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
  },

  required: {
    color: "red",
  },

  input: {
    flex: 1,
  },

  inputBlock: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
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
