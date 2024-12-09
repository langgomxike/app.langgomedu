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

type Props = {
  tuitionData: Class;
};
// { onNext }: props
const UpdateInfoTuition = ({ tuitionData }: Props) => {
  // context
  const languageContext = useContext(LanguageContext).language;

  // Tuition state
  const [tuition, setTuition] = useState<number | null>(
    tuitionData.price || null
  );
  const [formattedTuition, setFormattedTuition] = useState<string>(
    tuition?.toLocaleString("en-US") || ""
  );
  // err
  const [error, setError] = useState("");

  // Dates state
  const [dateStart, setDateStart] = useState<Date | null>(
    tuitionData.started_at ? new Date(tuitionData.started_at) : null
  );
  const [dateEnd, setDateEnd] = useState<Date | null>(
    tuitionData.ended_at ? new Date(tuitionData.ended_at) : null
  );
  const [isDatePickerVisible, setDatePickerVisibility] = useState({
    start: false,
    end: false,
  });

  // Address state
  const [selectedProvince, setSelectedProvince] = useState(
    tuitionData.address?.province || ""
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    tuitionData.address?.district || ""
  );
  const [selectedWard, setSelectedWard] = useState(
    tuitionData.address?.ward || ""
  );
  const [detail, setDetail] = useState(tuitionData.address?.detail || "");

  console.log("city-: ", selectedProvince);
  console.log("district-: ", selectedDistrict);
  console.log("ward-: ", selectedWard);

  // Format tuition on input change
  const handleTuitionChange = (value: any) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setTuition(Number(numericValue));
    setFormattedTuition(Number(numericValue).toLocaleString("en-US"));
  };

  // Handle date picker visibility
  const showDatePicker = (type: any) =>
    setDatePickerVisibility({ ...isDatePickerVisible, [type]: true });
  const hideDatePicker = (type: any) =>
    setDatePickerVisibility({ ...isDatePickerVisible, [type]: false });

  // Handle date selection
  const handleDateConfirm = (type: any, date: any) => {
    if (type === "start") setDateStart(date);
    if (type === "end") setDateEnd(date);
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
          value={formattedTuition}
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
              ? dateStart.toLocaleDateString()
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
            ? dateEnd.toLocaleDateString()
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
