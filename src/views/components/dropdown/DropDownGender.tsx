import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from '@expo/vector-icons/Ionicons';
import Gender from "../../../models/Gender";
import { GenderContext } from "../../../configs/GenderContext";

type DropdownGenderProps = {
  selectedGender: number,
  onSlectedGenderId: (id: number) => void;
};

export default function DropdownGender ({
  selectedGender,
  onSlectedGenderId,
}: DropdownGenderProps) {
  const genderContext = useContext(GenderContext);

  const [isFocus, setIsFocus] = useState(false);
  const [genders, setGenders] = useState<Gender[]>([]);

  // Add the "Select All" option
  // const enhancedLearners = [
  //   { id: "all", vn_name: "Chọn tất cả" },
  //   ...genders,
  // ];

  useEffect(() => {
    if(genderContext) {
      setGenders(genderContext.genders)
    }
  },[genderContext])

  const renderItem = (item: any, selected: any) => {
    return (
      <View style={styles.item}>
        <Text
          style={[
            styles.selectedTextStyle
          ]}
        >
          {item.vn_name}
        </Text>
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <Text style={styles.titleDropdown}>Giớ tính</Text>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={genders}
        maxHeight={300}
        labelField="vn_name"
        valueField="id"
        placeholder={!isFocus ? "Chọn giới tính..." : "..."}
        value={selectedGender}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setIsFocus(false);
          onSlectedGenderId(item.id);
        }}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 5,
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
    fontSize: 16,
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

  titleDropdown: {
    fontSize: 15,
    marginBottom: 7,
    fontWeight: "500",
  },

});
