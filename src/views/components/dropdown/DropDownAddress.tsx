import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import vietnamData from "../../../data/vietnam.json";
import Feather from '@expo/vector-icons/Feather';
import { LanguageContext } from "../../../configs/LanguageConfig";

// Định nghĩa kiểu dữ liệu cho JSON
type Dropdown  = {
  label: string;
  value: string;
}

type DropDownAddressProps = {
  selectedCities: string[];
  selectedDistricts: string[];
  selectedWards: string[];
  onSetSelectedCities: (cities: string[]) => void;
  onSetSelectedDistricts: (districts: string[]) => void;
  onSetSelectedWards: (wards: string[]) => void;
}



export default function DropDownAddress({
  selectedCities,
  selectedDistricts,
  selectedWards,
  onSetSelectedCities,
  onSetSelectedDistricts,
  onSetSelectedWards,
}: DropDownAddressProps) {
  // conntext --------------------------------------------------------------
  const language = useContext(LanguageContext).language;
  // states ----------------------------------------------------------------
  const [districts, setDistricts] = useState<Dropdown[]>([]);
  const [wards, setWards] = useState<Dropdown[]>([]);

  // effect  ----------------------------------------------------------------
  // Lấy danh sách quận huyện
  useEffect(() => {
    // Cập nhật danh sách quận/huyện khi thay đổi danh sách thành phố
    const selectedCityNames = selectedCities.map((city) => city);
    const updatedDistricts: { label: string; value: string }[] = [];

    selectedCityNames.forEach((cityName) => {
      const city = vietnamData.find((c) => c.name === cityName);
      if (city) {
        city.districts.forEach((district) => {
          updatedDistricts.push({ label: district.name, value: district.name });
        });
      }
    });
    setDistricts(updatedDistricts);
  }, [selectedCities]);

  // Lấy danh sách quận/huyện khi thay đổi danh sách thành phố
  useEffect(() => {
    const updatedDistricts: { label: string; value: string }[] = [];

        vietnamData.map((city) => {
          if (city) {
            city.districts.forEach((district) => {
              updatedDistricts.push({ label: district.name, value: district.name });
            });
          }
      });
    setDistricts(updatedDistricts);
  }, []);

  // Lấy danh sách xã phường theo quận, huyện
  useEffect(() => {
    const selectedDistrictNames = selectedDistricts.map(
      (districts) => districts
    );
    const updatedWards: { label: string; value: string }[] = [];

    selectedDistrictNames.forEach((districtName) => {
      vietnamData.forEach((city) => {
        const district = city.districts.find((d) => d.name === districtName);
        if (district) {
          district.wards.forEach((ward) => {
            updatedWards.push({ label: ward.name, value: ward.name });
          });
        }
      });
    });

    setWards(updatedWards);
  }, [selectedDistricts]);

  useEffect(() => {
    const updatedWards: { label: string; value: string }[] = [];
        vietnamData.map((city) => {
          if (city) {
            city.districts.forEach((district) => {
                district.wards.forEach((ward) => {
                    updatedWards.push({ label: ward.name, value: ward.name });
                  });
            });
          }
      });
      setWards(updatedWards);
  }, []);

  const renderItem = (item: any) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.titleDropdown}>{language.CITY_PROVINCE}:</Text>
        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={vietnamData.map((city) => ({
            label: city.name,
            value: city.name,
          }))}
          labelField="label"
          valueField="value"
          placeholder={language.SELECT}
          value={selectedCities}
          search
          searchPlaceholder={language.SEARCH_P}
          onChange={(item) => {
            onSetSelectedCities(item);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color="black"
              name="Safety"
              size={20}
            />
          )}
          renderItem={renderItem}
          renderSelectedItem={(item, unSelect) => (
            <View style={styles.selectedStyle}>
              <TouchableOpacity style={styles.selectedStyleButton} onPress={() => unSelect && unSelect(item)}>
                <Text style={styles.textSelectedStyle}>{item.label}</Text>
               <Feather name="trash-2" size={15} color="gray" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <View>
        <Text style={styles.titleDropdown}>{language.DISTRICT_A}:</Text>
        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={districts}
          labelField="label"
          valueField="value"
          placeholder={language.SELECT}
          value={selectedDistricts}
          search
          searchPlaceholder={language.SEARCH_P}
          onChange={(items) => {
             // Cập nhật danh sách quận/huyện đã chọn
            onSetSelectedDistricts(items);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color="black"
              name="Safety"
              size={20}
            />
          )}
          renderItem={renderItem}
          renderSelectedItem={(item, unSelect) => (
            <View style={styles.selectedStyle}>
              <TouchableOpacity  style={styles.selectedStyleButton} onPress={() => unSelect && unSelect(item)}>
                <Text style={styles.textSelectedStyle}>{item.label}</Text>
               <Feather name="trash-2" size={15} color="gray" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <View>
        <Text style={styles.titleDropdown}>{language.COMMUNE_WARD}</Text>
        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={wards}
          labelField="label"
          valueField="value"
           placeholder={language.SELECT}
          value={selectedWards}
          search
          searchPlaceholder={language.SEARCH_P}
          onChange={(item) => {
            onSetSelectedWards(item);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color="black"
              name="Safety"
              size={20}
            />
          )}
          renderItem={renderItem}
          renderSelectedItem={(item, unSelect) => (
            <View style={styles.selectedStyle}>
              <TouchableOpacity  style={styles.selectedStyleButton} onPress={() => unSelect && unSelect(item)}>
                <Text style={styles.textSelectedStyle}>{item.label}</Text>
               <Feather name="trash-2" size={15} color="gray" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    gap: 10,
  },
  dropdown: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
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
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
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

  selectedStyleButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  textSelectedStyle: {
    marginRight: 5,
    fontSize: 14,
  },

  titleDropdown: {
    fontSize: 15,
    marginBottom: 7,
    fontWeight: "500",
  },
});
