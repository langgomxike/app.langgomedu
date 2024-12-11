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
import DropDownLocation from "../../dropdown/DropDownLocation";
import { AppInfoContext } from "../../../../configs/AppInfoContext";
import { LanguageContext } from "../../../../configs/LanguageConfig";

type props = {
  onNext: (
    tuition?: string,
    dateStart?: string,
    dateEnd?: string,
    province?: string,
    district?: string,
    ward?: string,
    detail?: string
  ) => void;
};

const InfoTuition = ({ onNext }: props) => {
  // context
  const appInfos = useContext(AppInfoContext);
  const languageContext = useContext(LanguageContext).language;
  // console.log("code: ", appInfos.infos.banking_code);
  // console.log("number: ", appInfos.infos.banking_number);

  // state
  const [tuition, setTuition] = useState<number | null>(null); // Giá trị gốc dạng số
  const [formattedTuition, setFormattedTuition] = useState<string>(""); // Giá trị hiển thị
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [error, setError] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerType, setDatePickerType] = useState<"start" | "end">();

  // state address
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [detail, setDetail] = useState("");

  // Kiểm tra logic ngày bắt đầu và ngày kết thúc
  const validateDates = (start: string, end: string) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();

    if (startDate > endDate) {
      setError(languageContext.ERROR_DATE);
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
    const formattedDate = date.toLocaleDateString("vi-VN");

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
      tuition?.toString(),
      dateStart,
      dateEnd,
      selectedProvince,
      selectedDistrict,
      selectedWard,
      detail
    );
    hideDatePicker();
  };

  const handleChangeTuition = (value: string) => {
    if (value === "") {
      setTuition(null);
      setFormattedTuition("");
      setError("");
      onNext(
        undefined,
        dateStart,
        dateEnd,
        selectedProvince,
        selectedDistrict,
        selectedWard,
        detail
      );
      return;
    }

    // Loại bỏ dấu phẩy khỏi giá trị nhập vào
    const numericValue = Number(value.replace(/,/g, ""));

    // Kiểm tra nếu giá trị là số hợp lệ
    if (!isNaN(numericValue)) {
      if (numericValue < 0) {
        setError(languageContext.ERROR_TUITION);
      } else if (numericValue < 10000) {
        setError(languageContext.ERROR_TUITION_1);
      } else {
        setError(""); // Reset lỗi nếu hợp lệ
      }

      // Lưu giá trị không có dấu phẩy vào state (để dùng cho tính toán)
      setTuition(numericValue);

      setFormattedTuition(numericValue.toLocaleString("en-US")); // định dạng hiển thị ra gia diện

      // Gửi giá trị không dấu phẩy qua onNext
      onNext(
        numericValue.toString(),
        dateStart,
        dateEnd,
        selectedProvince,
        selectedDistrict,
        selectedWard,
        detail
      );
    } else {
      setError(languageContext.ERROR_TUITION_2);
    }
  };

  useEffect(() => {
    // Gửi dữ liệu địa chỉ khi có sự thay đổi
    console.log("tuition: ", tuition);
    console.log("dateStart: ", dateStart);
    console.log("dateEnd", dateEnd);
    console.log("selectedProvince: ", selectedProvince);
    console.log("selectedDistrict: ", selectedDistrict);
    console.log("selectedWard: ", selectedWard);
    console.log("detail: ", detail);

    onNext(
      tuition?.toString(),
      dateStart,
      dateEnd,
      selectedProvince,
      selectedDistrict,
      selectedWard,
      detail
    );
  }, [
    tuition,
    dateStart,
    dateEnd,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    detail,
  ]);

  return (
    <View style={styles.container}>
      {/* Học phí */}
      <View style={styles.marginInput}>
        <Text style={styles.label}>
          {languageContext.TUITION} <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder={languageContext.TUITION_PLACEHOLDER}
          keyboardType="numeric"
          value={formattedTuition}
          onChangeText={handleChangeTuition}
        />
      </View>

      {/* Ngày bắt đầu */}
      <View style={styles.marginInput}>
        <Text style={styles.label}>
          {languageContext.DATE_START_PLACEHOLDER} <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => showDatePicker("start")}
        >
          <Text>{dateStart || languageContext.DATE_START_PLACEHOLDER}</Text>
        </TouchableOpacity>
      </View>

      {/* Ngày kết thúc */}
      <View style={styles.marginInput}>
        <Text style={styles.label}>
          {languageContext.DATE_END} <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => showDatePicker("end")}
        >
          <Text>{dateEnd || languageContext.DATE_END_PLACEHOLDER}</Text>
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
          {languageContext.ADDRESS} <Text style={styles.required}>*</Text>
        </Text>
        <DropDownLocation
          selectedCity={selectedProvince}
          selectedDistrict={selectedDistrict}
          selectedWard={selectedWard}
          onSetSelectedCity={setSelectedProvince}
          onSetSelectedDistrict={setSelectedDistrict}
          onSetSelectedWard={setSelectedWard}
        />
      </View>
      <View>
        <Text style={styles.label}>
          {languageContext.DETAIL_ADDRESS} <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder={languageContext.DETAIL_ADDRESS_PLACEHOLDER}
          value={detail}
          onChangeText={(text) => {
            setDetail(text);
            onNext(
              tuition?.toString(),
              dateStart,
              dateEnd,
              selectedProvince,
              selectedDistrict,
              selectedWard,
              text
            );
          }}
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
