import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MajorsLevelsContext } from "../../../configs/MajorsLevelsContext";
import Major from "../../../models/Major";
import ReactAppUrl from "../../../configs/ConfigUrl";
import ClassLevel from "../../../models/ClassLevel";
import { Feather } from "@expo/vector-icons";
import { LanguageContext } from "../../../configs/LanguageConfig";



type DropdownMajorProps = {
  selectedMajors: string[];
  selectedClassLevels: string[];
  onSetSelectedMajors: (major: string[]) => void;
  onSetSelectedClassLevels: (classLevel: string[]) => void;
};

export default function DropDownMajors({
  selectedMajors,
  selectedClassLevels,
  onSetSelectedMajors,
  onSetSelectedClassLevels,
}: DropdownMajorProps) {
  //context
  const languageContext = useContext(LanguageContext).language;
  const majorsLevelsContext = useContext(MajorsLevelsContext);
  // console.log(majorsLevelsContext?.classLevels);

  // states
  // const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  // const [selectedClassLevels, setSelectedClassLevels] = useState<string[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [classLevels, setClassLevels] = useState<ClassLevel[]>([]);

  useEffect(() => {
    if (majorsLevelsContext?.majors && majorsLevelsContext.classLevels) {
      setMajors(majorsLevelsContext?.majors);
      setClassLevels(majorsLevelsContext?.classLevels);
    }
  }, [majorsLevelsContext?.majors]);

  const renderMajors = (item: Major) => {
    return (
      <View style={styles.item}>
        <Image
          source={{ uri: `${ReactAppUrl.PUBLIC_URL}${item.icon}` }}
          style={styles.majorIcon}
        />
        <Text style={styles.selectedTextStyle}>
          {
            languageContext.TYPE === "vi"
              ? item.vn_name
              : languageContext.TYPE === "en"
              ? item.en_name
              : languageContext.TYPE === "ja"
              ? item.ja_name
              : item.vn_name 
          }
        </Text>
      </View>
    );
  };

  const renderClassLevels = (item: ClassLevel) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.vn_name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.titleDropdown}>{languageContext.CHOOSE_MAJORS}</Text>
        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={majors}
          labelField="vn_name"
          valueField="id"
          placeholder={languageContext.CHOOSE_MAJORS+"..."}
          value={selectedMajors}
          search
          searchPlaceholder={languageContext.SEARCH}

          onChange={(item) => {
            // setSelectedMajors(item);
            onSetSelectedMajors(item);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color="black"
              name="Safety"
              size={20}
            />
          )}
          renderItem={renderMajors}
          renderSelectedItem={(item, unSelect) => (
            <TouchableOpacity
              style={styles.selectedStyle}
              onPress={() => unSelect && unSelect(item)}
            >
              <Text style={styles.textSelectedStyle}> {
            languageContext.TYPE === "vi"
              ? item.vn_name
              : languageContext.TYPE === "en"
              ? item.en_name
              : languageContext.TYPE === "ja"
              ? item.ja_name
              : item.vn_name 
          }</Text>
              <Feather name="trash-2" size={15} color="gray" />
            </TouchableOpacity>
          )}
        />
      </View>

      <View>
        <Text style={styles.titleDropdown}>{languageContext.CHOOSE_CLASS_LEVEL}</Text>
        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={classLevels}
          labelField="vn_name"
          valueField="id"
          placeholder={languageContext.CHOOSE_CLASS_LEVEL+"..."}
          value={selectedClassLevels}
          search
          searchPlaceholder={languageContext.SEARCH}
          onChange={(item) => {
            onSetSelectedClassLevels(item);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color="black"
              name="Safety"
              size={20}
            />
          )}
          renderItem={renderClassLevels}
          renderSelectedItem={(item, unSelect) => (
            <TouchableOpacity
              style={styles.selectedStyle}
              onPress={() => unSelect && unSelect(item)}
            >
              <Text style={styles.textSelectedStyle}>{
            languageContext.TYPE === "vi"
              ? item.vn_name
              : languageContext.TYPE === "en"
              ? item.en_name
              : languageContext.TYPE === "ja"
              ? item.ja_name
              : item.vn_name 
          }</Text>
              <Feather name="trash-2" size={15} color="gray" />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 5, gap: 20 },
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
    gap: 10,
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

  majorIcon: {
    width: 25,
    height: 25,
  },
});
