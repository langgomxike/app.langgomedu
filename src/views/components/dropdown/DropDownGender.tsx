import React, {useContext, useEffect, useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {MultiSelect} from "react-native-element-dropdown";
import Gender from "../../../models/Gender";
import {GenderContext} from "../../../configs/GenderContext";
import {Feather} from "@expo/vector-icons";

type DropdownGenderProps = {
  selectedGenders: string[];
  onSlectedGenders: (genders: string[]) => void;
};

export default function DropdownGender({
  selectedGenders,
  onSlectedGenders,
}: DropdownGenderProps) {
  const genderContext = useContext(GenderContext);
  const [genders, setGenders] = useState<Gender[]>([]);

  useEffect(() => {
    if (genderContext) {
      setGenders(genderContext.genders);
    }
  }, [genderContext]);

  const renderItem = (item: any, selected: any) => {
    return (
      <View style={styles.item}>
        <Text style={[styles.selectedTextStyle]}>{item.vn_name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleDropdown}>Giớ tính</Text>
      <MultiSelect
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={genders}
        maxHeight={300}
        labelField="vn_name"
        valueField="id"
        placeholder={"Chọn giới tính..."}
        value={selectedGenders}
        onChange={(item) => {
          onSlectedGenders(item);
        }}
        renderItem={renderItem}
        renderSelectedItem={(item, unSelect) => (
          <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
            <View style={styles.selectedStyle}>
              <Text style={styles.textSelectedStyle}>{item.vn_name}</Text>
              <Feather name="trash-2" size={15} color="gray" />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {padding: 5},
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
