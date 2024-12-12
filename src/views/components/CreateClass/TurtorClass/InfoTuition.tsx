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
  const languageContext = useContext(LanguageContext).language;

  // state
  const [tuition, setTuition] = useState<number | null>(null); // Giá trị gốc dạng số
  const [formattedTuition, setFormattedTuition] = useState<string>(""); // Giá trị hiển thị
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [errorPrice, setErrorPrice] = useState("");
  const [errorDate, setErrorDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerType, setDatePickerType] = useState<"start" | "end">();

  // state address
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [detail, setDetail] = useState("");

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

  // Kiểm tra logic ngày bắt đầu và ngày kết thúc
  const validateDates = (start: string, end: string) => {
    // Chuyển đổi dd/mm/yyyy thành Date object
    const parseDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split("/").map(Number);
      return new Date(year, month - 1, day); // Chú ý month - 1 vì tháng trong JavaScript bắt đầu từ 0
    };

    const startDate = parseDate(start).getTime();
    const endDate = parseDate(end).getTime();

    if (isNaN(startDate) || isNaN(endDate)) {
      setErrorDate(languageContext.ERROR_DATE); // Ngày không hợp lệ
      return false;
    }

    if (startDate >= endDate) {
      setErrorDate(languageContext.ERROR_DATE); // Ngày bắt đầu >= ngày kết thúc
      setDateEnd(""); // Reset ngày kết thúc
      return false;
    }

    setErrorDate(""); // Không có lỗi
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

  const handleChangeTuition = (value: string) => {
    if (value === "") {
      setTuition(null);
      setFormattedTuition("");
      setErrorPrice("");
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
        setErrorPrice(languageContext.ERROR_TUITION);
      } else if (numericValue < 10000) {
        setErrorPrice(languageContext.ERROR_TUITION_1);
      } else {
        setErrorPrice(""); // Reset lỗi nếu hợp lệ
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
      setErrorPrice(languageContext.ERROR_TUITION_2);
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
      <View>
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
      {errorPrice ? <Text style={styles.errorText}>{errorPrice}</Text> : null}

      {/* Ngày bắt đầu */}
      <View style={{marginTop: 25}}>
        <Text style={styles.label}>
          {languageContext.DATE_START_PLACEHOLDER}{" "}
          <Text style={styles.required}>*</Text>
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

      {errorDate ? <Text style={styles.errorText}>{errorDate}</Text> : null}

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
      <View style={styles.marginInput}>
        <Text style={styles.label}>
          {languageContext.DETAIL_ADDRESS}{" "}
          <Text style={styles.required}>*</Text>
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
    marginTop: 25,
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
