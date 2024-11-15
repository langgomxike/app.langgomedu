import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import User from "../../../models/User";

type DropdownParentProps = {
  learners: User[];
  onSlectedLeanerId: (id: string) => void;
};

const DropdownParent = ({
  learners,
  onSlectedLeanerId,
}: DropdownParentProps) => {
  const [value, setValue] = useState("");
  const [isFocus, setIsFocus] = useState(false);

  // Add the "Select All" option
  const enhancedLearners = [
    { id: "all", full_name: "Chọn tất cả" },
    ...learners,
  ];

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "blue" }]}>
          Phụ huynh
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={enhancedLearners}
        search
        maxHeight={300}
        labelField="full_name"
        valueField="id"
        placeholder={!isFocus ? "Chọn..." : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.id);
          setIsFocus(false);

          // Handle "select all" functionality
          if (item.id === "all") {
            onSlectedLeanerId("all");
          } else {
            onSlectedLeanerId(item.id);
          }
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? "blue" : "black"}
            name="Safety"
            size={20}
          />
        )}
      />
    </View>
  );
};

export default DropdownParent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
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
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
