import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useState } from "react";
import BoxWhite from "../BoxWhite";
import DropDownLocation from "../dropdown/DropDownLocation";

type props = {
  onNext: (tuition?: string, dateStart?: string, dateEnd?: string) => void;
};

const InfoTuition = ({ onNext }: props) => {
  const [tuition, setTuition] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [error, setError] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerType, setDatePickerType] = useState<"start" | "end">();

  // Kiểm tra logic ngày bắt đầu và ngày kết thúc
  const validateDates = (start: string, end: string) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();

    if (startDate > endDate) {
      setError("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.");
      setDateEnd("");
      return false;
    }
    setError("");
    return true;
  };

  // Hiển thị lịch
  const showDatePicker = (type: "start" | "end") => {
    setDatePickerType(type);
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  // Xử lý khi chọn ngày
  const handleConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    if (datePickerType === "start") {
      setDateStart(formattedDate);
      if (dateEnd) {
        validateDates(formattedDate, dateEnd);
      }
      onNext(tuition, formattedDate, dateEnd);
    } else if (datePickerType === "end") {
      if (dateStart && !validateDates(dateStart, formattedDate)) {
        onNext(tuition, dateStart, ""); // Reset ngày kết thúc nếu không hợp lệ
      } else {
        setDateEnd(formattedDate);
        onNext(tuition, dateStart, formattedDate);
      }
    }

    hideDatePicker();
  };

  const handleChangeTuition = (value: any) => {
    setTuition(value); // Lưu lại giá trị người dùng nhập vào

    // Kiểm tra khi người dùng nhập xong
    if (value !== "") {
      const numericValue = Number(value);

      // Kiểm tra nếu giá trị là số và không phải là số âm
      if (isNaN(numericValue) || numericValue < 0) {
        setError("Mức học phí phải là số dương và không được âm.");
        onNext("", dateStart, dateEnd); // Không gửi học phí nếu không hợp lệ
      }
      // Kiểm tra nếu học phí dưới 10 nghìn
      else if (numericValue < 10000) {
        setError("Mức học phí phải từ 10,000 trở lên.");
        onNext("", dateStart, dateEnd); // Không gửi học phí nếu không hợp lệ
      } else {
        setError(""); // Reset lỗi nếu hợp lệ
        onNext(value, dateStart, dateEnd); // Gửi học phí nếu hợp lệ
      }
    } else {
      // Nếu giá trị rỗng, không có lỗi
      setError("");
      onNext(value, dateStart, dateEnd); // Gửi giá trị rỗng nếu người dùng chưa nhập gì
    }
  };

  return (
    <View style={styles.container}>
      {/* Học phí */}
      <View style={styles.marginInput}>
        <Text style={styles.label}>
          Học phí <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập mức học phí"
          keyboardType="numeric"
          value={tuition}
          onChangeText={handleChangeTuition}
        />
      </View>

      {/* Ngày bắt đầu */}
      <View style={styles.marginInput}>
        <Text style={styles.label}>
          Ngày bắt đầu <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => showDatePicker("start")}
        >
          <Text>{dateStart || "Chọn ngày bắt đầu"}</Text>
        </TouchableOpacity>
      </View>

      {/* Ngày kết thúc */}
      <View style={styles.marginInput}>
        <Text style={styles.label}>
          Ngày kết thúc <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => showDatePicker("end")}
        >
          <Text>{dateEnd || "Chọn ngày kết thúc"}</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Modal lịch */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <View style={styles.marginInput}>
        <Text style={styles.label}>
          Địa chỉ <Text style={styles.required}>*</Text>
        </Text>
        {/* <TextInput style={styles.input} placeholder="Thêm địa chỉ của bạn" /> */}
        <DropDownLocation />
        <Text style={[styles.label, {marginTop: 25}]}>
          Địa chỉ cụ thể <Text style={styles.required}>*</Text>
        </Text>
        <TextInput style={styles.input} placeholder="Thêm địa chỉ của bạn" />
      </View>
      <View style={styles.marginInput}>
        <Text style={styles.label}>
          Phí tạo lớp <Text style={styles.required}>*</Text>
        </Text>
        {/* LẤY MÃ QR NGÂN HÀNG CỦA TURTOR  */}
        <View style={{ alignItems: "center" }}>
          <Image
            style={{ width: 400, height: 500 }}
            source={{
              uri: "https://img.vietqr.io/image/mbbank-0376961547-compact2.jpg?amount=10000&addInfo=dong%20phi%20tao%20lop&accountName=Phi%20Tao%20Lop",
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 20,
    backgroundColor: "#fff",
  },
  marginInput: {
    marginBottom: 25,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    justifyContent: "center",
  },

  // ITEM DANH SÁCH CON
  flatListContainer: {
    paddingHorizontal: 10,
  },
  boxWhite: {
    width: 300, // Đặt chiều rộng của mỗi phần tử
    marginRight: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center", // Căn giữa nội dung
    borderWidth: 2,
    borderColor: "gray",
  },
  userInfo: {
    flexDirection: "row", // Sắp xếp avatar và tên ngang hàng
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  details: {
    alignItems: "center", // Căn giữa nội dung trong chi tiết
  },
  checkIcon: {
    fontSize: 24,
    color: "green",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    width: 100,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#007BFF", // Nền xanh
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#fff", // Nền trắng
    borderColor: "red", // Viền đỏ
    borderWidth: 1,
  },
  secondaryButtonText: {
    color: "red",
    fontWeight: "bold",
  },
  required: {
    color: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
});

export default InfoTuition;
