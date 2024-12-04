import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import React from "react";
import {BackgroundColor} from "../../../configs/ColorConfig";

type ButtonDisableInClassDetailProps = {
  content: string;
};

export default function ButtonDisableInClassDetail({content}: ButtonDisableInClassDetailProps) {
  return (
    <TouchableOpacity
      disabled={true}
      style={[styles.btn, styles.btnAcceptDisable, styles.boxShadow]}
    >
      <Text style={styles.btnAcceptText}>{content}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 3,
  },

  btn: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  btnAccept: {
    flex: 9,
    borderWidth: 1,
    borderColor: BackgroundColor.gray_e6,
    backgroundColor: BackgroundColor.white,
  },

  btnAcceptDisable: {
    flex: 10,
    borderWidth: 1,
    borderColor: BackgroundColor.gray_e6,
    backgroundColor: BackgroundColor.gray_e6,
  },

  btnAcceptText: {
    color: BackgroundColor.primary,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
