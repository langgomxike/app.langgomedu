import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

type props = {
  onNext: (
    chonBuoiHoc?: number,
    thoiLuongHoc?: number,
    thoiGianBatDau?: number,
    hinhThucHoc?: boolean
  ) => void;
};

const InfoLesson = ({ onNext }: props) => {
  const [sessions, setSessions] = useState([
    {
      id: 1,
      selectedValue: 0,
      thoiLuongBuoiHoc: "",
      time: new Date(),
      timeText: "",
      hinhThucHoc: "online",
    },
  ]);

  // Hàm xử lý khi thay đổi thời gian
  const onChange = (selectedTime: any, sessionIndex: any) => {
    const currentTime = selectedTime || sessions[sessionIndex].time;
    const updatedSessions = [...sessions];
    updatedSessions[sessionIndex].time = currentTime;

    let tempTime = new Date(currentTime);
    let formattedTime =
      tempTime.getHours() +
      ":" +
      (tempTime.getMinutes() < 10 ? "0" : "") +
      tempTime.getMinutes();
    updatedSessions[sessionIndex].timeText = formattedTime;

    setSessions(updatedSessions);

    // GỌI HÀM ONNEXT VỚI DỮ LIỆU MỚI
    const { selectedValue, thoiLuongBuoiHoc, hinhThucHoc } =
      updatedSessions[sessionIndex];
    onNext(
      selectedValue,
      parseInt(thoiLuongBuoiHoc),
      currentTime.getTime(),
      hinhThucHoc === "online"
    );
  };

  // Hàm hiển thị picker cho Android
  const showTimepicker = (sessionIndex: any) => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: sessions[sessionIndex].time,
        onChange: (event, selectedTime) => onChange(selectedTime, sessionIndex),
        mode: "time",
        is24Hour: true,
      });
    }
  };

  const toggleStatus = (sessionIndex: any) => {
    const updatedSessions = [...sessions];
    updatedSessions[sessionIndex].hinhThucHoc =
      updatedSessions[sessionIndex].hinhThucHoc === "online"
        ? "offline"
        : "online";
    setSessions(updatedSessions);

    // Gọi hàm lưu vào database nếu cần
    // saveToDatabase(updatedSessions[sessionIndex].hinhThucHoc);
    // console.log("hic");
    
    const { selectedValue, thoiLuongBuoiHoc, time, hinhThucHoc } =
      updatedSessions[sessionIndex];
    onNext(
      selectedValue,
      parseInt(thoiLuongBuoiHoc),
      time.getTime(),
      hinhThucHoc === "online"
    );
  };

  const saveToDatabase = (value: any) => {
    console.log("Lưu giá trị:", value);
  };

  const handleAdd = () => {
    setSessions([
      ...sessions,
      {
        id: sessions.length + 1,
        selectedValue: 0,
        thoiLuongBuoiHoc: "",
        time: new Date(),
        timeText: "",
        hinhThucHoc: "online",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {sessions.map((session, index) => (
        <View key={session.id} style={{ marginBottom: 20 }}>
          <Text style={styles.text}>Buổi học: {index + 1}</Text>

          {/* CHỌN BUỔI HỌC - THỜI LƯỢNG BUỔI HỌC */}
          <View style={[styles.containerRow, styles.marginInput]}>
            <View style={[{ flex: 5 }, styles.inputContainer]}>
              <Text style={styles.label}>
                Chọn buổi học <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={session.selectedValue}
                  onValueChange={(itemValue) => {
                    setSessions((prevSessions) =>
                      prevSessions.map((s) =>
                        s.id === session.id
                          ? { ...s, selectedValue: itemValue }
                          : s
                      )
                    );
                    const { thoiLuongBuoiHoc, time, hinhThucHoc } = session;
                    onNext(
                      itemValue,
                      parseInt(thoiLuongBuoiHoc),
                      time.getTime(),
                      hinhThucHoc === "online"
                    );
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="Chọn lịch trình buổi học" value="" />
                  <Picker.Item label="Chủ nhật" value="0" />
                  <Picker.Item label="Thứ 2" value="1" />
                  <Picker.Item label="Thứ 3" value="2" />
                  <Picker.Item label="Thứ 4" value="3" />
                  <Picker.Item label="Thứ 5" value="4" />
                  <Picker.Item label="Thứ 6" value="5" />
                  <Picker.Item label="Thứ 7" value="6" />
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
                placeholder="thời lượng học... (theo phút)"
                value={session.thoiLuongBuoiHoc}
                onChangeText={(text) => {
                  setSessions((prevSessions) =>
                    prevSessions.map((s) =>
                      s.id === session.id ? { ...s, thoiLuongBuoiHoc: text } : s
                    )
                  );
                  const { selectedValue, time, hinhThucHoc } = session;
                  onNext(
                    selectedValue,
                    parseInt(text),
                    time.getTime(),
                    hinhThucHoc === "online"
                  );
                }}
              />
            </View>
          </View>

          {/* THỜI GIAN BẮT ĐẦU - HÌNH THỨC HỌC */}
          <View style={styles.containerRow}>
            <View style={[{ flex: 5 }, styles.inputContainer]}>
              <Text style={styles.label}>
                Thời gian bắt đầu <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Chọn thời gian"
                value={session.timeText}
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
                  {session.hinhThucHoc}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Đường gạch dưới để ngăn cách giữa các buổi học */}
          {index < sessions.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
      <TouchableOpacity style={styles.btnAdd} onPress={handleAdd}>
        <Text style={styles.txtAdd}>Thêm buổi</Text>
      </TouchableOpacity>
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
