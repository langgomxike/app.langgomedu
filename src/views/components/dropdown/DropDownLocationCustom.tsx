import React, { useEffect, useState } from "react";
import { StyleSheet, View, TextInput, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import vietnamData from "../../../data/vietnam.json";

// Định nghĩa kiểu dữ liệu cho JSON
interface Dropdown {
  label: string;
  value: string;
}

type DropDownLocationCustomProps = {
  selectedCity: string;
  selectedDistrict: string;
  selectedWard: string;
  content: string;
  onSelectedCity: (city: string) => void;
  onSelectedDistrict: (district: string) => void;
  onSelectedWard: (ward: string) => void;
  onSelectedContent: (content: string) => void; // Cập nhật kiểu hàm này
};

export default function DropDownLocationCustom({
  selectedCity,
  selectedDistrict,
  selectedWard,
  onSelectedCity,
  onSelectedDistrict,
  onSelectedWard,
  onSelectedContent,
  content,
}: DropDownLocationCustomProps) {
  // states //////////////////////////////////////////////
  const [district, setDistrict] = useState<Dropdown[]>([]); // Quận
  const [ward, setWard] = useState<Dropdown[]>([]); // Xã
  const [isFocus, setIsFocus] = useState(false);
  const [detail, setDetail] = useState<string>(content || ""); // Giữ nội dung TextInput

  // effect /////////////////////////////////////////////

  // Lấy danh sách quận huyện khi city thay đổi
  useEffect(() => {
    const updatedDistricts: { label: string; value: string }[] = [];
    const city = vietnamData.find((c) => c.name === selectedCity);

    if (city) {
      city.districts.forEach((district) => {
        updatedDistricts.push({ label: district.name, value: district.name });
      });
    }

    setDistrict(updatedDistricts);

    if (!updatedDistricts.some((d) => d.value === selectedDistrict)) {
      onSelectedDistrict(""); // Reset district nếu không có trong danh sách
    }
  }, [selectedCity]);

  // Lấy danh sách xã phường khi district thay đổi
  useEffect(() => {
    const updatedWards: { label: string; value: string }[] = [];

    vietnamData.forEach((city) => {
      const district = city.districts.find((d) => d.name === selectedDistrict);
      if (district) {
        district.wards.forEach((ward) => {
          updatedWards.push({ label: ward.name, value: ward.name });
        });
      }
    });

    setWard(updatedWards);

    if (!updatedWards.some((w) => w.value === selectedWard)) {
      onSelectedWard(""); // Reset ward nếu không có trong danh sách
    }
  }, [selectedDistrict]);

  // Cập nhật detail khi content thay đổi từ ngoài
  useEffect(() => {
    setDetail(content || "");
  }, [content]);

  // Hàm render item cho dropdown
  const renderItem = (item: any, selected: any) => {
    return (
      <View style={styles.item}>
        <Text
          style={[
            styles.selectedTextStyle,
            selected && styles.selectedItemText,
          ]}
        >
          {item.label}
        </Text>
      </View>
    );
  };

  // Hàm xử lý khi giá trị trong TextInput thay đổi
  const handleContentChange = (text: string) => {
    setDetail(text); // Cập nhật giá trị trong state
    onSelectedContent(text); // Gửi giá trị mới cho hàm onSelectedContent
  };

  return (
    <View style={styles.container}>
      {/* Dropdown for City */}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={vietnamData.map((city) => ({
          label: city.name,
          value: city.name,
        }))}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Chọn tỉnh" : "Tỉnh"}
        searchPlaceholder="Search..."
        value={selectedCity}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onSelectedCity(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? "blue" : "black"}
            name="Safety"
            size={20}
          />
        )}
        renderItem={renderItem}
      />

      {/* Dropdown for District */}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={district}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Chọn quận/ huyện" : "Quận/ huyện"}
        searchPlaceholder="Search..."
        value={selectedDistrict}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onSelectedDistrict(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? "blue" : "black"}
            name="Safety"
            size={20}
          />
        )}
        renderItem={renderItem}
      />

      {/* Dropdown for Ward */}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={ward}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Chọn xã" : "Xã"}
        searchPlaceholder="Search..."
        value={selectedWard}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onSelectedWard(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? "blue" : "black"}
            name="Safety"
            size={20}
          />
        )}
        renderItem={renderItem}
      />

      {/* Text Input for Content */}
      <TextInput
        style={styles.textInput}
        placeholder="Nhập nội dung"
        placeholderTextColor="#888"
        multiline
        value={detail}
        onChangeText={handleContentChange} // Cập nhật khi người dùng thay đổi
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    gap: 15,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "white",
    shadowColor: "#000",
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  selectedItemText: {
    color: "blue",
    fontWeight: "bold",
  },
  textInput: {
    height: 50,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
});
