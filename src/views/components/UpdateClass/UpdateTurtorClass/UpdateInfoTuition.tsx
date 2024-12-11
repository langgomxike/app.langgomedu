import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useContext, useState, useEffect } from "react";
import DropDownLocation from "../../dropdown/DropDownLocation";
import { LanguageContext } from "../../../../configs/LanguageConfig";
import Class from "../../../../models/Class";
import moment from "moment";

type Props = {
  tuitionData: Class;
  onSetDataTuition: (data: Class) => void;
  tuition: number;
  setTuiton: (tuition: number) => void;
  dateStart: number;
  setDateStart: (dateStart: number) => void;
  dateEnd: number;
  setDateEnd: (dateEnd: number) => void;
  selectedProvince: string;
  setSelectedProvince: (tuition: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (tuition: string) => void;
  selectedWard: string;
  setSelectedWard: (tuition: string) => void;
  detail: string;
  setDetail: (tuition: string) => void;
};
// { onNext }: props
const UpdateInfoTuition = ({
  tuition,
  setTuiton,
  dateStart,
  setDateStart,
  dateEnd,
  setDateEnd,
  selectedProvince,
  setSelectedProvince,
  selectedDistrict,
  setSelectedDistrict,
  selectedWard,
  setSelectedWard,
  detail,
  setDetail,
}: Props) => {
  // context
  const languageContext = useContext(LanguageContext).language;
  // err
  const [error, setError] = useState("");

  // Dates state
  const [isDatePickerVisible, setDatePickerVisibility] = useState({
    start: false,
    end: false,
  });

  // format gia tien
  const formatCurrency = (value: string) => {
    if (!value) return "";
    // Loại bỏ tất cả ký tự không phải số
    const numericValue = value.replace(/\D/g, "");
    // Format số tiền
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format tuition on input change
  const handleTuitionChange = (value: string) => {
    formatCurrency(value);
    const numericValue = value.replace(/[^0-9]/g, "");
    setTuiton(Number(numericValue));
  };

  // Handle date picker visibility
  const showDatePicker = (type: any) =>
    setDatePickerVisibility({ ...isDatePickerVisible, [type]: true });
  const hideDatePicker = (type: any) =>
    setDatePickerVisibility({ ...isDatePickerVisible, [type]: false });

  // Handle date selection
  const handleDateConfirm = (type: "start" | "end", date: Date) => {
    // Convert Date to timestamp (number)
    const timestamp = date.getTime();
    if (type === "start") setDateStart(timestamp);
    if (type === "end") setDateEnd(timestamp);
    hideDatePicker(type);
  };

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
          value={formatCurrency(tuition.toString())}
          onChangeText={handleTuitionChange}
        />
      </View>

      {/* Date Inputs */}
      <View style={styles.marginInput}>
        <Text style={styles.label}>
          {languageContext.DATE_START_PLACEHOLDER}{" "}
          <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => showDatePicker("start")}
        >
          <Text>
            {dateStart
              ? moment(dateStart).format("DD/MM/YYYY")
              : languageContext.DATE_START_PLACEHOLDER}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>
        {languageContext.DATE_END} <Text style={styles.required}>*</Text>
      </Text>
      <TouchableOpacity
        onPress={() => showDatePicker("end")}
        style={styles.input}
      >
        <Text>
          {dateEnd
            ? moment(dateEnd).format("DD/MM/YYYY")
            : languageContext.DATE_END_PLACEHOLDER}
        </Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <DateTimePickerModal
        isVisible={isDatePickerVisible.start}
        mode="date"
        onConfirm={(date) => handleDateConfirm("start", date)}
        onCancel={() => hideDatePicker("start")}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible.end}
        mode="date"
        onConfirm={(date) => handleDateConfirm("end", date)}
        onCancel={() => hideDatePicker("end")}
      />

      {/* Address Inputs */}
      <View style={{ marginTop: 25 }}>
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

      <View style={{ marginTop: 25 }}>
        <Text style={styles.label}>
          {languageContext.DETAIL_ADDRESS}{" "}
          <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder={languageContext.DETAIL_ADDRESS_PLACEHOLDER}
          value={detail}
          onChangeText={setDetail}
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

export default UpdateInfoTuition;
