import React, { useEffect, useState } from "react";
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
import Lesson from "../../models/Lesson";

type props = {
  handleGetLesson: (lessons: Lesson[]) => void;
};

const InfoLesson = ({ handleGetLesson }: props) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  // Khai báo state để xác định khi nào DateTimePicker hiển thị
  const [show, setShow] = useState(false);
  // Khai báo state lưu chỉ số bài học hiện tại khi chọn thời gian
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);

  const onChange = (selectedTime: Date, lessonIndex: number) => {
    const currentTime = selectedTime || lessons[lessonIndex].started_at;
    const updatedLessons = [...lessons];
    updatedLessons[lessonIndex].started_at = currentTime.getTime();

    const formattedTime =
      currentTime.getHours() +
      ":" +
      (currentTime.getMinutes() < 10 ? "0" : "") +
      currentTime.getMinutes();
    updatedLessons[lessonIndex].note = formattedTime;

    setLessons(updatedLessons);
  };
  
  const showTimepicker = (lessonIndex: number) => {
    if (Platform.OS === "android") {
      setShow(true); // Biến show xác định hiển thị `DateTimePicker`
      setSelectedLessonIndex(lessonIndex); // Để nhận biết bài học nào đang được cập nhật
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

  useEffect(() => {
    console.log("lesson: ", lessons);
    handleGetLesson(lessons);
  }, [lessons]);

  return (
    <View style={styles.container}>
      {lessons.map((lesson, index) => (
        <View key={lesson.id} style={{ marginBottom: 20 }}>
          <Text style={styles.text}>Buổi học: {index + 1}</Text>

          <View style={[styles.containerRow, styles.marginInput]}>
            <View style={[{ flex: 5 }, styles.inputContainer]}>
              <Text style={styles.label}>
                Chọn buổi học <Text style={styles.required}>*</Text>
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
                  <Picker.Item label="Chọn lịch trình buổi học" value={0} />
                  <Picker.Item label="Chủ nhật" value={0} />
                  <Picker.Item label="Thứ 2" value={1} />
                  <Picker.Item label="Thứ 3" value={2} />
                  <Picker.Item label="Thứ 4" value={3} />
                  <Picker.Item label="Thứ 5" value={4} />
                  <Picker.Item label="Thứ 6" value={5} />
                  <Picker.Item label="Thứ 7" value={6} />
                </Picker>
              </View>
            </View>
            <View style={{ flex: 5 }}>
              <Text style={styles.label}>
                Thời lượng buổi học <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                keyboardType="numeric"
                style={styles.input}
                placeholder="Thời lượng học... (phút)"
                value={lesson.duration.toString()}
                onChangeText={(text) => {
                  setLessons((prevLessons) =>
                    prevLessons.map((l) =>
                      l.id === lesson.id
                        ? { ...l, duration: parseInt(text) }
                        : l
                    )
                  );
                }}
              />
            </View>
          </View>

          <View style={styles.containerRow}>
            <View style={[{ flex: 5 }, styles.inputContainer]}>
              <Text style={styles.label}>
                Thời gian bắt đầu <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Chọn thời gian"
                value={lesson.note}
                onFocus={() => showTimepicker(index)}
              />
            </View>
            <View style={{ flex: 5 }}>
              <Text style={styles.label}>
                Hình thức học <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={[
                  { justifyContent: "center", alignItems: "center" },
                  styles.input,
                ]}
                onPress={() => toggleStatus(index)}
              >
                <Text style={[{ color: "#0D99FF" }, styles.text]}>
                  {lesson.is_online ? "online" : "offline"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {index < lessons.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
      <TouchableOpacity style={styles.btnAdd} onPress={handleAdd}>
        <Text style={styles.txtAdd}>Thêm buổi</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePickerAndroid
          value={new Date(lessons[selectedLessonIndex].started_at)}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event: any, selectedTime: Date | undefined) => {
            setShow(false);
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
  container: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#fff",
  },
  containerRow: {
    flexDirection: "row",
  },
  inputContainer: {
    marginRight: 15,
  },
  btnAdd: {
    borderRadius: 10,
    width: 150,
    height: 40,
    backgroundColor: "#0D99FF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
  },
  txtAdd: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  marginInput: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  required: {
    color: "red",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#000",
    marginVertical: 20,
  },
});

export default InfoLesson;
