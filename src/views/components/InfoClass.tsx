import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import CustomInput from "./Inputs/CustomInput";

const InfoClass = () => {
  const [title, setTitle] = useState("");

  return (
    <View style={{ margin: 10 }}>
      <CustomInput
        placeholder="Nhập tiêu đề..."
        type="text"
        label="Tiêu đề"
        onChangeText={setTitle}
        required
      />
      <CustomInput
        placeholder="Nhập mô tả..."
        type="textarea"
        label="Mô tả"
        onChangeText={setTitle}
        required
      />
      <View style={styles.container}>
        <View style={[styles.inputContainer, { flex: 8 }]}>
          <CustomInput
            placeholder="Nhập môn học..."
            type="text"
            label="Chọn môn học cho lớp"
            onChangeText={setTitle}
            required
          />
        </View>
        <View style={[styles.inputContainer, { flex: 4 }]}>
          <CustomInput
            placeholder="Cấp học..."
            type="text"
            label="Cấp học"
            onChangeText={setTitle}
            required
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    marginRight: 10, // khoảng cách giữa 2 input
  },
});

export default InfoClass;
