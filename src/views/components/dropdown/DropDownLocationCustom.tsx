import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import vietnamData from "../../../data/vietnam.json";

interface DropdownOption {
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
  onContentChange: (content: string) => void; // Callback mới để xử lý nội dung
};

export default function DropDownLocationCustom({
  selectedCity,
  selectedDistrict,
  selectedWard,
  onSelectedCity,
  onSelectedDistrict,
  onSelectedWard,
  content,
  onContentChange,
}: DropDownLocationCustomProps) {
  const [districtOptions, setDistrictOptions] = useState<DropdownOption[]>([]);
  const [wardOptions, setWardOptions] = useState<DropdownOption[]>([]);
  const [isFocus, setIsFocus] = useState(false);
  const [detail, setDetail] = useState(content);

  // Lấy danh sách quận/huyện khi thành phố thay đổi
  useEffect(() => {
    const city = vietnamData.find((c) => c.name === selectedCity);
    const districts = city
      ? city.districts.map((district) => ({
          label: district.name,
          value: district.name,
        }))
      : [];

    setDistrictOptions(districts);

    // Nếu quận/huyện không hợp lệ, reset
    if (!districts.some((d) => d.value === selectedDistrict)) {
      onSelectedDistrict("");
    }
  }, [selectedCity]);

  // Lấy danh sách xã/phường khi quận/huyện thay đổi
  useEffect(() => {
    const city = vietnamData.find((c) =>
      c.districts.some((d) => d.name === selectedDistrict)
    );
    const district = city?.districts.find((d) => d.name === selectedDistrict);
    const wards = district
      ? district.wards.map((ward) => ({
          label: ward.name,
          value: ward.name,
        }))
      : [];

    setWardOptions(wards);

    // Nếu xã/phường không hợp lệ, reset
    if (!wards.some((w) => w.value === selectedWard)) {
      onSelectedWard("");
    }
  }, [selectedDistrict]);

  // Cập nhật nội dung chi tiết khi content thay đổi từ bên ngoài
  useEffect(() => {
    setDetail(content);
  }, [content]);

  const renderItem = (item: DropdownOption, isSelected: boolean) => (
    <View style={styles.item}>
      <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
        {item.label}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Thành phố */}
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
        searchPlaceholder="Tìm kiếm..."
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
        renderItem={(item) => renderItem(item, item.value === selectedCity)}
      />

      {/* Quận/huyện */}
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={districtOptions}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Chọn quận/huyện"
        searchPlaceholder="Tìm kiếm..."
        value={selectedDistrict}
        onChange={(item) => onSelectedDistrict(item.value)}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color="black"
            name="Safety"
            size={20}
          />
        )}
        renderItem={(item) =>
          renderItem(item, item.value === selectedDistrict)
        }
      />

      {/* Xã/phường */}
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={wardOptions}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Chọn xã/phường"
        searchPlaceholder="Tìm kiếm..."
        value={selectedWard}
        onChange={(item) => onSelectedWard(item.value)}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color="black"
            name="Safety"
            size={20}
          />
        )}
        renderItem={(item) => renderItem(item, item.value === selectedWard)}
      />

      {/* Nội dung */}
      <TextInput
        style={styles.textInput}
        placeholder="Nhập nội dung"
        placeholderTextColor="#888"
        multiline
        value={detail}
        onChangeText={(text) => {
          setDetail(text); // Cập nhật state nội bộ
          onContentChange(text); // Gửi nội dung ra ngoài
        }}
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
    borderWidth: .5,
    borderColor: "gray",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  itemText: { color: "#000" },
});
