import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomInput from "./Inputs/CustomInput";
import { useState } from "react";
import ViewShot from "react-native-view-shot";

type props = {
  onNext: (tuition?: string, dateStart?: Date, dateEnd?: Date) => void;
}

const InfoTuition = ({onNext}: props) => {
  const [tuition, setTuition] = useState("");
  const [dateStart, setDateStare] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const handleChangeTuition = (value: any) => {
    setTuition(value);
    onNext(value, undefined, undefined);
  }
  const handleChangeDateStart = (value: any) => {
    setDateStare(value);
    onNext(undefined, value, undefined);
  }

  const handleChangeDateEnd = (value: any) => {
    setDateEnd(value);
    onNext(undefined, undefined, value);
  }

  return (
    <View style={styles.container}>
      <View style={styles.marginInput}>
        <CustomInput
          label="Học phí"
          onChangeText={handleChangeTuition}
          placeholder="chọn mức học phí"
          required
          type="number"
          value={tuition}
        />
      </View>
      <View style={styles.marginInput}>
        <CustomInput
          label="Ngày bắt đầu"
          onChangeText={handleChangeDateStart}
          placeholder="chọn ngày bắt đầu cho buổi học"
          required={false}
          type="date"
          value={dateStart}
        />
      </View>
      <View>
        <CustomInput
          label="Ngày kết thúc"
          onChangeText={handleChangeDateEnd}
          placeholder="chọn ngày kết thúc cho buổi học"
          required={false}
          type="date"
          value={dateEnd}
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
        marginBottom: 20,
    },
})

export default InfoTuition;
