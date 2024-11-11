import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import CustomInput from "./Inputs/CustomInput";
import { Picker } from "@react-native-picker/picker";
import AClassLevel from "../../apis/AClassLevel";
import ClassLevel from "../../models/ClassLevel";
import Major from "../../models/Major";
import AMajor from "../../apis/AMajor";

type props = {
  // dataTitle: string;
  // onDataTitle: (value: string) => void;
  onNext: (
    title?: string,
    desc?: string,
    monHoc?: string,
    capHoc?: number
  ) => void;
};

const InfoClass = ({ onNext }: props) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [capHocList, setCapHocList] = useState<ClassLevel[]>([]); // đặt select
  const [selectedCapHoc, setSelectedCapHoc] = useState<number>(-1);

  // useState MÔN HỌC, FETCH DATA
  const [monHoc, setMonHoc] = useState<number>(-1); // đặt select
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
        label: major.vn_name,
        value: major.id,
      }));
      setPickerItems((prevItems) => {
        const existingIds = new Set(prevItems.map((item) => item.value));
        const uniqueMajorItems = majorItems.filter(
          (item) => !existingIds.has(item.value)
        );
        return [...uniqueMajorItems, ...prevItems];
      });
    }, setIsLoading);
  }, []);

  const handleSelectChange = (itemValue: any | "other") => {
    if (itemValue === "other") {
      setIsOtherSelected(true); // Chuyển Picker thành TextInput nếu chọn "Khác"
    } else {
      setMonHoc(itemValue); // Cập nhật giá trị đã chọn từ Picker
      onNext(undefined, undefined, itemValue, undefined);
      setIsOtherSelected(false); // Ẩn TextInput nếu chọn lại từ các mục khác
    }
  };

  const handleAddCustomValue = () => {
    if (customInput.trim() !== "") {
      const newItem = {
        label: customInput,
        value: Date.now(), // Giả sử đặt tạm 0 cho value nếu cần
      };
      setPickerItems((prevItems) => {
        const otherItem = prevItems.find((item) => item.value === "other");
        const itemsWithoutOther = prevItems.filter(
          (item) => item.value !== "other"
        );
        return otherItem
          ? [newItem, ...itemsWithoutOther, otherItem] // Thêm giá trị mới vào trước mục "Khác"
          : [newItem, ...itemsWithoutOther]; // Trường hợp "Khác" không tồn tại
      });
      setMonHoc(newItem.value); // Cập nhật giá trị được chọn là giá trị mới nhập
      setCustomInput(""); // Reset lại ô nhập
      setIsOtherSelected(false); // Quay lại Picker sau khi nhập xong
    }
  };

  /** ========================================= */

  /**
   * FETCH DATA CẤP HỌC
   */

  useEffect(() => {
    AClassLevel.getAllClassLevels((classLevels) => {
      setCapHocList(classLevels);
      // console.log("hihi ", classLevels);
    });
  }, []);

  const handleChangeCapHoc = (value: number) => {
    setSelectedCapHoc(value);
    console.log("value cap hoc: ", value);
    
    onNext(undefined, undefined, undefined, value);
  };

  /**
   * ===========================================
   */

  // TITLE
  const handleChangeTitle = (value: any) => {
    setTitle(value);
    onNext(value);
  };

  // DESCRIPTION
  const handleChangeDesc = (value: any) => {
    setDesc(value);
    onNext(undefined, value, undefined, undefined);
  };
  return (
    <View style={styles.container}>
      <View style={styles.marginInput}>
        <CustomInput
          placeholder="Nhập tiêu đề..."
          type="text"
          label="Tiêu đề"
          onChangeText={handleChangeTitle}
          required
          value={title}
        />
      </View>
      <View style={styles.marginInput}>
        <CustomInput
          placeholder="Nhập mô tả..."
          type="textarea"
          label="Mô tả"
          onChangeText={handleChangeDesc}
          required
          value={desc}
        />
      </View>
      <View style={[styles.containerRow, styles.marginInput]}>
        <View style={[styles.inputContainer, { flex: 6 }]}>
          <Text style={styles.label}>
            Chọn môn học cho lớp <Text style={styles.required}>*</Text>
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
                onValueChange={(itemValue) => handleSelectChange(itemValue)}
                style={styles.picker}
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
        <View style={[styles.inputContainer, { flex: 6 }]}>
          <Text style={styles.label}>
            Cấp học <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCapHoc}
              onValueChange={(itemValue) => handleChangeCapHoc(itemValue)}
              style={styles.picker}
            >
              {/* <Picker.Item label="Sơ cấp" value="0" />
              <Picker.Item label="Trung cấp" value="1" />
              <Picker.Item label="Cao cấp" value="2" /> */}
              {capHocList.map((classLevel) => (
                <Picker.Item
                  label={classLevel.vn_name}
                  value={classLevel.id}
                  key={classLevel.id}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFF",
  },
  containerRow: {
    flexDirection: "row",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    marginRight: 10, // khoảng cách giữa 2 input
  },
  marginInput: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  required: {
    color: "red",
  },
  picker: {
    height: 50,
    width: 150,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
});

export default InfoClass;
