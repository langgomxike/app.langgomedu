import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type Props = {
  onNext: (tuition?: string, dateStart?: string, dateEnd?: string) => void;
};

const InfoTuition = ({ onNext }: Props) => {
  const [tuition, setTuition] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [error, setError] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerType, setDatePickerType] = useState<"start" | "end">();

  // Format ngày theo múi giờ địa phương
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
  };

  // Kiểm tra logic ngày bắt đầu và ngày kết thúc
  const validateDates = (start: string, end: string) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();

    if (startDate > endDate) {
      setError("Ngày kết thúc phải lớn hơn ngày bắt đầu.");
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
    const formattedDate = formatDate(date);

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

  // Xử lý thay đổi học phí
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

  // DANH SÁCH CON
  const data = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      description: "Có thể tham gia lớp này",
      buttonLabel: "Tham gia",
      buttonType: "primary",
    },
    {
      id: "2",
      name: "Nguyễn Văn B",
      description: "Không thể tham gia lớp này",
      buttonLabel: "Hủy chọn",
      buttonType: "secondary",
    },
    {
      id: "3",
      name: "Nguyễn Thị C",
      description: "Có thể tham gia lớp này",
      buttonLabel: "Tham gia",
      buttonType: "primary",
    },
  ];

  const ChildItem = ({ item }: any) => (
    <View style={styles.boxWhite}>
      <View style={styles.userInfo}>
        <Image
          source={{
            uri: "https://cdn.vectorstock.com/i/1000v/51/87/student-avatar-user-profile-icon-vector-47025187.jpg",
          }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{item.name}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.checkIcon}>✔️</Text>
        <Text style={styles.description}>{item.description}</Text>
        <TouchableOpacity
          style={[
            styles.button,
            item.buttonType === "primary"
              ? styles.primaryButton
              : styles.secondaryButton,
          ]}
        >
          <Text
            style={
              item.buttonType === "primary"
                ? styles.primaryButtonText
                : styles.secondaryButtonText
            }
          >
            {item.buttonLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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

      <View style={{ marginTop: 25 }}>
        <Text style={styles.label}>Danh sách con</Text>
        <FlatList
          data={data}
          renderItem={({ item }) => <ChildItem item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          contentContainerStyle={styles.flatListContainer}
          showsHorizontalScrollIndicator={false}
        />
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
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  required: {
    color: "red",
  },

  flatListContainer: {
    paddingHorizontal: 10,
  },
  boxWhite: {
    width: 300,
    marginRight: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "gray",
  },
  userInfo: {
    flexDirection: "row",
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
    alignItems: "center",
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
    backgroundColor: "#007BFF",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderColor: "red",
    borderWidth: 1,
  },
  secondaryButtonText: {
    color: "red",
    fontWeight: "bold",
  },
});

export default InfoTuition;
