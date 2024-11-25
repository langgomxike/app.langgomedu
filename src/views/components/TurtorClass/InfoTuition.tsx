import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useContext, useState, useEffect } from "react";
import DropDownLocation from "../dropdown/DropDownLocation";
import { AppInfoContext } from "../../../configs/AppInfoContext";

type props = {
  onNext: (
    tuition?: string,
    dateStart?: string,
    dateEnd?: string,
    province?: string[],
    district?: string[],
    ward?: string[],
    detail?: string
  ) => void;
};

const InfoTuition = ({ onNext }: props) => {
  // context
  const appInfos = useContext(AppInfoContext);
  console.log("code: ", appInfos.infos.banking_code);
  console.log("number: ", appInfos.infos.banking_number);

  // state
  const [tuition, setTuition] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [error, setError] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerType, setDatePickerType] = useState<"start" | "end">();

  // state address
  const [selectedProvince, setSelectedProvince] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string[]>([]);
  const [selectedWard, setSelectedWard] = useState<string[]>([]);
  const [detail, setDetail] = useState("");

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
    } else if (datePickerType === "end") {
      if (dateStart && !validateDates(dateStart, formattedDate)) {
        setDateEnd(""); // Reset ngày kết thúc nếu không hợp lệ
      } else {
        setDateEnd(formattedDate);
      }
    }

    onNext(
      tuition,
      dateStart,
      dateEnd,
      selectedProvince,
      selectedDistrict,
      selectedWard
    );
    hideDatePicker();
  };

  const handleChangeTuition = (value: string) => {
    setTuition(value); // Lưu lại giá trị người dùng nhập vào

    // Kiểm tra khi người dùng nhập xong
    if (value !== "") {
      const numericValue = Number(value);

      if (isNaN(numericValue) || numericValue < 0) {
        setError("Mức học phí phải là số dương và không được âm.");
      } else if (numericValue < 10000) {
        setError("Mức học phí phải từ 10,000 trở lên.");
      } else {
        setError(""); // Reset lỗi nếu hợp lệ
      }
    } else {
      setError("");
    }

    onNext(
      value,
      dateStart,
      dateEnd,
      selectedProvince,
      selectedDistrict,
      selectedWard,
      detail
    );
  };

  useEffect(() => {
    // Gửi dữ liệu địa chỉ khi có sự thay đổi
    onNext(
      tuition,
      dateStart,
      dateEnd,
      selectedProvince,
      selectedDistrict,
      selectedWard,
      detail
    );
  }, [selectedProvince, selectedDistrict, selectedWard, detail]);

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

      {/* Địa chỉ */}
      <View style={styles.marginInput}>
        <Text style={styles.label}>
          Địa chỉ <Text style={styles.required}>*</Text>
        </Text>
        <DropDownLocation
          selectedCities={selectedProvince}
          selectedDistricts={selectedDistrict}
          selectedWards={selectedWard}
          onSetSelectedCities={setSelectedProvince}
          onSetSelectedDistricts={setSelectedDistrict}
          onSetSelectedWards={setSelectedWard}
        />
      </View>
      <Text style={[styles.label]}>
        Địa chỉ cụ thể <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Thêm địa chỉ của bạn"
        value={detail}
      />
      <Text style={[styles.label, { marginTop: 25 }]}>
        Phí tạo lớp <Text style={styles.required}>*</Text>
      </Text>
      <View style={{width: 400, height: 500}}>
        <Image
          src={`https://img.vietqr.io/image/${appInfos.infos.banking_code}-${appInfos.infos.banking_number}-compact2.jpg?amount=79000&addInfo=dong%20tien%20phi%20tao%20lop&accountName=Phi%20Tao%20Lop`}
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
