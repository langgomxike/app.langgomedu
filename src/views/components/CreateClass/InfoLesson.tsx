import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerAndroid from "@react-native-community/datetimepicker";
import Feather from "@expo/vector-icons/Feather";
import Lesson from "../../../models/Lesson";
import { LanguageContext } from "../../../configs/LanguageConfig";

type props = {
  handleGetLesson: (lessons: Lesson[]) => void;
};

const InfoLesson = ({ handleGetLesson }: props) => {
  // context
  const langguageContext = useContext(LanguageContext).language;
  // state
  const [lessons, setLessons] = useState<Lesson[]>([
    new Lesson(1, undefined, 0, 0, 0, true, ""),
  ]);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (selectedTime: Date, lessonIndex: number) => {
    const currentTime = selectedTime || new Date();
    const updatedLessons = [...lessons];
    updatedLessons[lessonIndex].started_at = currentTime.getTime();

    setLessons(updatedLessons);
  };

  const showTimepicker = (lessonIndex: number) => {
    if (Platform.OS === "android") {
      setSelectedLessonIndex(lessonIndex);
      setShowPicker(true);
    }
  };

  const toggleStatus = (lessonIndex: number) => {
    const updatedLessons = [...lessons];
    updatedLessons[lessonIndex].is_online =
      !updatedLessons[lessonIndex].is_online;
    setLessons(updatedLessons);
  };

  const handleAdd = () => {
    setLessons([
      ...lessons,
      new Lesson(lessons.length + 1, undefined, 0, 0, 0, true, ""),
    ]);
  };

  const handleDelete = (lessonIndex: number) => {
    const updatedLessons = lessons.filter((_, index) => index !== lessonIndex);
    setLessons(updatedLessons);
  };

  useEffect(() => {
    handleGetLesson(lessons);
  }, [lessons]);

  return (
    <View style={styles.container}>
      {lessons.map((lesson, index) => (
        <View key={lesson.id} style={{ marginBottom: 20 }}>
          <View style={[styles.rowContainer, { marginBottom: 25 }]}>
            <Text style={styles.text}>{langguageContext.LESSON}: {index + 1}</Text>
            <TouchableOpacity onPress={() => handleDelete(index)}>
              <Feather name="x" size={30} color="black" />
            </TouchableOpacity>
          </View>

          {index < lessons.length - 1 && <View style={styles.separator} />}

          <View style={[styles.containerRow, styles.marginInput]}>
            <View style={[{ flex: 5 }, styles.inputContainer]}>
              <Text style={styles.label}>
                {langguageContext.SELECTED_LESSON} <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={lesson.day}
                  onValueChange={(itemValue) => {
                    setLessons((prevLessons) =>
                      prevLessons.map((l) =>
                        l.id === lesson.id ? { ...l, day: itemValue } : l
                      )
                    );
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label={langguageContext.SUNDAY} value={0} />
                  <Picker.Item label={langguageContext.MONDAY} value={1} />
                  <Picker.Item label={langguageContext.TUESDAY} value={2} />
                  <Picker.Item label={langguageContext.WEDNESDAY} value={3} />
                  <Picker.Item label={langguageContext.THURSDAY} value={4} />
                  <Picker.Item label={langguageContext.FRIDAY} value={5} />
                  <Picker.Item label={langguageContext.SATURDAY} value={6} />
                </Picker>
              </View>
            </View>
            
            {/* THỜI LƯỢNG BUỔI HỌC */}
            <View style={{ flex: 5 }}>
              <Text style={styles.label}>
                {langguageContext.TIME_LESSON} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                keyboardType="numeric"
                style={styles.input}
                placeholder={langguageContext.SELECTED_TIME_LESSON}
                value={lesson.duration ? lesson.duration.toString() : ""}
                onChangeText={(text) => {
                  const parsed = parseInt(text);
                  setLessons((prevLessons) =>
                    prevLessons.map((l) =>
                      l.id === lesson.id
                        ? { ...l, duration: isNaN(parsed) ? 0 : parsed }
                        : l
                    )
                  );
                }}
              />
            </View>
          </View>

          <View style={styles.containerRow}>
            {/* Thời gian bắt đầu */}
            <View style={[{ flex: 5 }, styles.inputContainer]}>
              <Text style={styles.label}>
                {langguageContext.TIME_START} <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={[styles.input, { justifyContent: "center" }]}
                onPress={() => showTimepicker(index)}
              >
                <Text>
                  {lesson.started_at
                    ? new Date(lesson.started_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : langguageContext.SLECTED_TIME_START}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Thời gian kết thúc */}
            <View style={{ flex: 5 }}>
              <Text style={styles.label}>
                {langguageContext.TIME_END} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder={langguageContext.TIME_END_AUTO}
                value={
                  lesson.started_at && lesson.duration
                    ? new Date(
                        lesson.started_at + lesson.duration * 60 * 1000
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""
                }
                editable={false} // Không cho phép chỉnh sửa
              />
            </View>
          </View>

          <View style={{ marginTop: 25 }}>
            <Text style={styles.label}>
              {langguageContext.LEARNING_METHOD} <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={[{ justifyContent: "center" }, styles.input]}
              onPress={() => toggleStatus(index)}
            >
              <Text style={[{ color: "#0D99FF" }, styles.text]}>
                {lesson.is_online ? langguageContext.LEARNING_METHOD_1 : langguageContext.LEARNING_METHOD_2}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 25 }}>
            <Text style={styles.label}>{langguageContext.NOTE}</Text>
            <TextInput
              style={styles.input}
              placeholder={langguageContext.NOTE_PLACEHOLDER}
              value={lesson.note} // Hiển thị giá trị hiện tại từ lesson
              onChangeText={(text) => {
                // Cập nhật giá trị ghi chú của lesson cụ thể
                setLessons((prevLessons) =>
                  prevLessons.map((l) =>
                    l.id === lesson.id ? { ...l, note: text } : l
                  )
                );
              }}
            />
          </View>

          <TouchableOpacity style={styles.btnAdd} onPress={handleAdd}>
            <Text style={styles.txtAdd}>{langguageContext.BTN_ADD_LESSON}</Text>
          </TouchableOpacity>
        </View>
      ))}
      {showPicker && (
        <DateTimePickerAndroid
          value={
            lessons[selectedLessonIndex].started_at
              ? new Date(lessons[selectedLessonIndex].started_at)
              : new Date()
          }
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event: any, selectedTime: Date | undefined) => {
            setShowPicker(false);
            if (selectedTime) {
              onChange(selectedTime, selectedLessonIndex);
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 10, padding: 15, backgroundColor: "#fff" },
  containerRow: { flexDirection: "row" },
  inputContainer: { marginRight: 15 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  btnAdd: {
    borderRadius: 10,
    width: 150,
    height: 40,
    backgroundColor: "#0D99FF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    marginLeft: 120,
  },
  txtAdd: { fontSize: 16, color: "#FFFFFF", fontWeight: "bold" },
  txtDelete: { fontSize: 16, color: "#FFFFFF", fontWeight: "bold" },
  text: { fontSize: 20, fontWeight: "bold" },
  marginInput: { marginBottom: 25 },
  label: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  required: { color: "red" },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
  },
  picker: { height: 50, width: "100%" },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
  },
  separator: { height: 1, backgroundColor: "#ccc", marginVertical: 15 },
  rowContainer: {
    flexDirection: "row", // Sắp xếp theo chiều ngang
    justifyContent: "space-between", // Giãn cách hai phần tử ra hai đầu
    alignItems: "center", // Căn giữa theo trục dọc
  },
});

export default InfoLesson;
