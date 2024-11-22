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

export default function DropDownLocation() {
  // states //////////////////////////////////////////////
  const [selectedCity, setSelectedCity] = useState<string>(""); // mang duoc chon
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [district, setDistrict] = useState<Dropdown[]>([]); // quan
  const [ward, setWard] = useState<Dropdown[]>([]); // xa

  const [value, setValue] = useState(null);
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

    console.log("city: ", selectedCity);

    setDistrict(updatedDistricts);
    setSelectedDistrict("");
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
    setSelectedWard("");
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
          setSelectedCity(item.value);
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
          setSelectedDistrict(item.value);
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
          setSelectedWard(item.value);
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
});
