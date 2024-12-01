import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import vietnamData from "../../../data/vietnam.json";
import Feather from "@expo/vector-icons/Feather";

// Định nghĩa kiểu dữ liệu cho JSON
interface Dropdown {
  label: string;
  value: string;
}

type DropDownAddressProps = {
  selectedCity: string;
  selectedDistrict: string;
  selectedWard: string;
  onSetSelectedCity: (cities: string) => void;
  onSetSelectedDistrict: (districts: string) => void;
  onSetSelectedWard: (wards: string) => void;
}

export default function DropDownLocation(
  {
    selectedCity,
    selectedDistrict,
    selectedWard,
    onSetSelectedCity,
    onSetSelectedDistrict,
    onSetSelectedWard,
  }: DropDownAddressProps){
    
  // states //////////////////////////////////////////////
  const [district, setDistrict] = useState<Dropdown[]>([]); // quan
  const [ward, setWard] = useState<Dropdown[]>([]); // xa

  const [isFocus, setIsFocus] = useState(false);

  // handle /////////////////////////////////////////////

  // effect ////////////////////////////////////////////

  // Lấy danh sách quận huyện
  useEffect(() => {
    // Cập nhật danh sách quận/huyện khi thay đổi danh sách thành phố
    const updatedDistricts: { label: string; value: string }[] = [];

    const city = vietnamData.find((c) => c.name === selectedCity);
    if (city) {
      city.districts.forEach((district) => {
        updatedDistricts.push({ label: district.name, value: district.name });
      });
    }


    setDistrict(updatedDistricts);
    onSetSelectedDistrict("");
  }, [selectedCity]);

  // Lấy danh sách xã phường theo quận, huyện
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
    onSetSelectedWard("");
  }, [selectedDistrict]);

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

  return (
    <View style={styles.container}>
      {/* TINH, THANH PHO */}
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
          onSetSelectedCity(item.value);
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

      {/* QUAN, HUYEN */}
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
          onSetSelectedDistrict(item.value);
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
      {/* XA */}
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
          onSetSelectedWard(item.value);
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
    borderColor: "#E0E0E0", // Màu viền xám nhạt
    borderWidth: 1,
    borderRadius: 8, // Bo tròn viền
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF", // Nền dropdown trắng
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05, // Hiệu ứng bóng nhẹ
    shadowRadius: 4,
    elevation: 1,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: -10,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "#6E6E6E", // Màu chữ nhạt cho label
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#B0B0B0", // Màu placeholder xám nhạt
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "#4F4F4F", // Màu chữ khi đã chọn
    fontWeight: "400",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    borderColor: "#E0E0E0", // Viền xám nhạt
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#F7F7F7", // Nền ô search xám nhạt
    color: "#333333", // Màu chữ trong ô search
  },
  item: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // Nền của mỗi item trắng
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0", // Đường phân cách giữa các item
  },
  selectedItemText: {
    color: "#0D99FF",
    fontWeight: "500",
  },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#EFEFEF", // Nền khi được chọn
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
