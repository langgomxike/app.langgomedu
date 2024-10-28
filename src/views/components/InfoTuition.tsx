import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomInput from "./Inputs/CustomInput";
import { useState } from "react";

const InfoTuition = () => {
  const [tuition, setTuition] = useState("");
  const [description, setDescription] = useState("");
  const [dateStart, setDateStare] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const handleNext = () => {
    alert("hi");
  }

  return (
    <View style={styles.container}>
      <View style={styles.marginInput}>
        <CustomInput
          label="Học phí"
          onChangeText={setTuition}
          placeholder="chọn mức học phí"
          required
          type="number"
        />
      </View>
      <View style={styles.marginInput}>
        <CustomInput
          label="Mô tả và yêu cầu"
          onChangeText={setDescription}
          placeholder="có thể không nhập.."
          required
          type="text"
        />
      </View>
      <View style={styles.marginInput}>
        <CustomInput
          label="Ngày bắt đầu"
          onChangeText={setDateStare}
          placeholder="chọn ngày bắt đầu cho buổi học"
          required={false}
          type="date"
          value={dateStart}
        />
      </View>
      <View>
        <CustomInput
          label="Ngày kết thúc"
          onChangeText={setDateEnd}
          placeholder="chọn ngày kết thúc cho buổi học"
          required={false}
          type="date"
          value={dateEnd}
        />
      </View>
      <TouchableOpacity style={styles.btnNext} onPress={handleNext}>
        <Text style={styles.txtNext}>Tạo Lớp</Text>
      </TouchableOpacity>
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
    btnNext: {
      justifyContent:"center",
      alignItems: "center",
      width: "60%",
      height: 40,
      backgroundColor: "#0D99FF",
      marginTop: 20,
      borderRadius: 10,
      marginLeft: 75,
    },
    txtNext: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "bold"
    }
})

export default InfoTuition;
