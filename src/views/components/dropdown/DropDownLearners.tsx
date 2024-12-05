import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import User from "../../../models/User";
import Ionicons from '@expo/vector-icons/Ionicons';
import { LanguageContext } from "../../../configs/LanguageConfig";

type DropdownLearnersProps = {
  learners: User[];
  onSlectedLeanerId: (id: string) => void;
};

export default function DropdownLearners ({
  learners,
  onSlectedLeanerId,
}: DropdownLearnersProps) {
  const language = useContext(LanguageContext).language;
  const [value, setValue] = useState("");
  const [isFocus, setIsFocus] = useState(false);

  // Add the "Select All" option
  const enhancedLearners = [
    { id: "all", full_name: "Chọn tất cả" },
    ...learners,
  ];

  const renderItem = (item: any, selected: any) => {
    return (
      <View style={styles.item}>
        <Text
          style={[
            styles.selectedTextStyle
          ]}
        >
          {item.full_name}
        </Text>
      </View>
    );
  };


  return (
    <View style={styles.container}>
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
        placeholder={!isFocus ? `${language.SELECT_STUDENT}...` : "..."}
        searchPlaceholder={language.SEARCH_P}
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
          <Ionicons style={styles.icon} name="person-outline" size={20} color={isFocus ? "blue" : "black"} />
        )}

        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
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
});
