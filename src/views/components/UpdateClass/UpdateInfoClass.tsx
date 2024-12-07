import React, { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import CustomInput from "../Inputs/CustomInput";
import { Picker } from "@react-native-picker/picker";
import AClassLevel from "../../../apis/AClassLevel";
import ClassLevel from "../../../models/ClassLevel";
import AMajor from "../../../apis/AMajor";
import { LanguageContext } from "../../../configs/LanguageConfig";
import Class from "../../../models/Class";

type props = {
  classData: Class;
};
// { onNext }: props
const UpdateInfoClass = ({classData} : props) => {
  // context
  const languageContext = useContext(LanguageContext).language;

  // state
  const [title, setTitle] = useState(classData.title || "");
  const [desc, setDesc] = useState(classData.description || "");
  const [capHocList, setCapHocList] = useState<ClassLevel[]>([]); // đặt select
  const [selectedCapHoc, setSelectedCapHoc] = useState<number>(classData.class_level?.id ?? -1);
  const [maxLearners, setMaxLearners] = useState<number>(classData.max_learners ?? 0);
  // useState MÔN HỌC, FETCH DATA
  const [monHoc, setMonHoc] = useState<number>(classData.major?.id ?? -1); // đặt select
  const [isOtherSelected, setIsOtherSelected] = useState(false); // Kiểm tra khi chọn "Khác"
  const [customInput, setCustomInput] = useState(""); // Giá trị nhập khi chọn "Khác"
  const [isLoading, setIsLoading] = useState(false);
  const [pickerItems, setPickerItems] = useState<
    { label: string; value: number | "other" }[]
  >([{ label: "Khác", value: "other" }]); // Danh sách các buổi học

  // useEffect
  useEffect(() => {
    AMajor.getAllMajors((majors) => {
      const majorItems = majors.map((major) => ({
        label:
          languageContext.TYPE === "vi"
            ? major.vn_name
            : languageContext.TYPE === "en"
            ? major.en_name
            : major.ja_name,
        value: major.id,
      }));
      setPickerItems([...majorItems, { label: "Khác", value: "other" }]);
      
    }, setIsLoading);
  }, [languageContext.TYPE]);

   // Fetch danh sách cấp học
  useEffect(() => {
    AClassLevel.getAllClassLevels((classLevels) => {
      setCapHocList(classLevels);
    });
  }, []);

  // handle
  // xử lý thay đổi chọn môn học
  const handleSelectChange = (itemValue: any | "other") => {
    if (itemValue === "other") {
      setIsOtherSelected(true); // Chuyển Picker thành TextInput nếu chọn "Khác"
    } else {
      setMonHoc(itemValue); // Cập nhật giá trị đã chọn từ Picker
      setIsOtherSelected(false); // Ẩn TextInput nếu chọn lại từ các mục khác
    }
  };

   // Thêm giá trị tùy chỉnh vào danh sách môn học
   const handleAddCustomValue = () => {
    if (customInput.trim() !== "") {
      const newItem = {
        label: customInput,
        value: Date.now(),
      };
      setPickerItems((prevItems) => [
        newItem,
        ...prevItems.filter((item) => item.value !== "other"),
        { label: "Khác", value: "other" },
      ]);
      setMonHoc(newItem.value);
      setCustomInput("");
      setIsOtherSelected(false);
    }
  };

  const handleChangeCapHoc = (value: number) => {
    setSelectedCapHoc(value);
    console.log("value cap hoc: ", value);
  };


  // MAX LEARNER
  const handleChangeMaxLearner = (value: string) => {
    setMaxLearners(parseInt(value) || 1); // Cập nhật state của component con
  };

  return (
    <View style={styles.container}>
      <View style={styles.marginInput}>
        <CustomInput
          placeholder={languageContext.TITLE_PLACEHOLDER}
          type="text"
          label={languageContext.TITLE}
          onChangeText={setTitle}
          required
          value={title}
        />
      </View>
      <View style={styles.marginInput}>
        <CustomInput
          placeholder={languageContext.DESCRIPTION_PLACEHOLDER}
          type="textarea"
          label={languageContext.DESCRIPTION}
          onChangeText={setDesc}
          required
          value={desc}
        />
      </View>
      <View style={[styles.marginInput]}>
        <View style={[styles.inputContainer]}>
          <Text style={styles.label}>
            {languageContext.MAJOR} <Text style={styles.required}>*</Text>
          </Text>

          {isLoading ? (
            <Text>Đang tải...</Text>
          ) : isOtherSelected ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Nhập môn học..."
                value={customInput}
                onChangeText={setCustomInput}
              />
              <Button title="Thêm" onPress={handleAddCustomValue} />
            </View>
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={monHoc}
                onValueChange={handleSelectChange}
                style={styles.picker}
                key={languageContext.TYPE}
              >
                {pickerItems.map((item) => (
                  <Picker.Item
                    label={item.label}
                    value={item.value}
                    key={item.value}
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>

        {/* CẤP HOC */}
        <View style={[styles.inputContainer]}>
          <Text style={styles.label}>
            {languageContext.CLASS_LEVEL} <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCapHoc}
              onValueChange={handleChangeCapHoc}
              style={styles.picker}
            >
              {capHocList.map((classLevel) => (
                <Picker.Item
                  label={
                    languageContext.TYPE === "vi"
                      ? classLevel.vn_name
                      : languageContext.TYPE === "en"
                      ? classLevel.en_name
                      : classLevel.ja_name
                  }
                  value={classLevel.id}
                  key={classLevel.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* MAX LEARNER */}
        <Text style={styles.label}>
          {languageContext.MAX_LEARNER} <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số lượng người học"
          keyboardType="numeric"
          value={maxLearners.toString()} // Chuyển `number` sang `string`
          onChangeText={handleChangeMaxLearner}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFF",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0", // Màu viền xám nhạt
    borderRadius: 10, // Bo tròn góc
    overflow: "hidden", // Đảm bảo picker không tràn
  },
  picker: {
    height: 50,
    fontSize: 16,
    paddingHorizontal: 10,
    color: "#4F4F4F", // Màu chữ
  },
  marginInput: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333333",
    marginBottom: 8,
  },
  required: {
    color: "red", // Màu đỏ nhẹ cho dấu sao
    fontWeight: "600",
  },
  inputContainer: {
    marginBottom: 15,
  },
  textInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    color: "#333333",
    fontSize: 14,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    justifyContent: "center",
  },
});

export default UpdateInfoClass;