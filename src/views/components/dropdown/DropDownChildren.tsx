import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Feather from '@expo/vector-icons/Feather';
import User from "../../../models/User";
import { LanguageContext } from "../../../configs/LanguageConfig";

type DropdownChildrenProps = {
  user_default: User;
  learners: User[];
  onSelectedLearner: (id: User) => void;
  onChangeType: (id: number) => void;
};

// const learnersData = [
//   {id: "1234", full_name:"Nguyễn Văn Văn"},
//   {id: "1233", full_name:"Nguyễn Văn C"},
// ]

const DropdownChildren = ({user_default, learners, onSelectedLearner, onChangeType}: DropdownChildrenProps) => {
  //state
  // console.log("dropdownChildren: "+ user_default);
  const languageContext = useContext(LanguageContext);
  const [value, setValue] = useState(user_default);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    setValue(user_default);
  }, [user_default]);
  
  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "green" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        itemTextStyle={styles.itemTextStyle}
        data={learners}
        maxHeight={300}
        labelField="full_name"
        valueField="id"
        placeholder={!isFocus ? languageContext.language.CHOOSE  : "..." }
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item);
          setIsFocus(false);
          onSelectedLearner(item)
          item.roles.forEach(role => {
            switch (role.id) {
              case 9:
                onChangeType(1);
                break;
              case 10:
                onChangeType(2);
                break;
              default:
                break;
            }
          });
        }}
        renderLeftIcon={() => (
          <Feather  style={styles.icon}  name="user" size={20} color={isFocus ? "green" : "black"} />
        )}
      />
    </View>
  );
};

export default DropdownChildren;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingVertical: 10,
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
    fontSize: 16,
  },

  itemTextStyle : {
    fontSize: 14,
  }
});
