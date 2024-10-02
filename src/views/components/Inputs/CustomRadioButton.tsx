import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Option = {
  label: string;
  value: string;
};

type CheckBoxProps = {
  options: Option[];
  onSelect: (selectedValues: string[]) => void;
};

const CheckBox = ({ options, onSelect }: CheckBoxProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handlePress = (optionValue: string) => {
    let updatedOptions = [...selectedOptions];

    if (updatedOptions.includes(optionValue)) {
      updatedOptions = updatedOptions.filter((value) => value !== optionValue);
    } else {
      updatedOptions.push(optionValue);
    }

    setSelectedOptions(updatedOptions);
    onSelect(updatedOptions);
  };

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.checkBoxContainer}
          onPress={() => handlePress(option.value)}
        >
          <View style={styles.checkBox}>
            {selectedOptions.includes(option.value) && (
              <View style={styles.selectedCheckBox} />
            )}
          </View>
          <Text style={styles.checkBoxText}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 10,
  },

  checkBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginRight: 50,
  },

  checkBox: {
    height: 20,
    width: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCheckBox: {
    width: 12,
    height: 12,
    backgroundColor: "#0D99FF",
  },
  checkBoxText: {
    marginLeft: 10,
  },
});

export default CheckBox;
