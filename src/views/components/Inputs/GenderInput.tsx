import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
type GenderInputProps = {
  value: number;
  onChange: (gender: number) => void;
  styleInputWidth?: object;
  style?: object
};

const FONT_SIZE = 14;

export default function genderInput({ value, onChange, styleInputWidth, style }: GenderInputProps) {
  const [gender, setGender] = useState<number>(value);
  const handleChangeGender = () => {
    const newGender = gender === 0 ? 1 : 0;
    setGender(newGender);
    onChange(newGender);
  };

  return (
    <View style={[styles.genderContainer, style]}>
      <TouchableOpacity
        onPress={() => handleChangeGender()}
        style={[styles.btnChange, styles.boxShadow, styleInputWidth]}
      >
        <Text style={[styles.btnChangeText]}>
          {gender === 1 ? "Male" : "Female"}
        </Text>
        {gender === 1 ? (
          <Ionicons name="male" size={20} color="black" />
        ) : (
          <Ionicons name="female" size={20} color="black" />
        )}
      </TouchableOpacity>
      {gender !== 1 ? (
          <Ionicons name="male" size={20} color="black" />
        ) : (
          <Ionicons name="female" size={20} color="black" />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  btnChangeText: {
    fontSize: FONT_SIZE,
    width: "70%"
  },
  btnChange: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginRight: 10,
  },
  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    elevation: 5,
  },

  genderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
