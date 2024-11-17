import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { BackgroundColor } from "../../../configs/ColorConfig";
import { Dimensions } from "react-native";

type ChildItemProps = {
  onPay: () => void
}

const {width:SCREEN_WIDTH } = Dimensions.get("window");

export default function ChildItem({onPay}: ChildItemProps) {
  
  return (
    <View style={[styles.childItemContainer, styles.boxshadow]}>
      <View style={styles.points}>
        <View style={[styles.point, {backgroundColor: BackgroundColor.green_light}]}></View>
      </View>
      <View style={styles.childInfo}>
        <Image
          source={{
            uri: `https://cdn-icons-png.flaticon.com/128/4322/4322991.png`,
          }}
          style={styles.avtarImage}
        />
        <Text style={styles.fullName}>Nguyễn Thanh Thanh</Text>
      </View>

      <View style={styles.notificationContent}>
            <Image 
        source={require("../../../../assets/images/ic_pay.png")} 
        style={styles.payIcon} 
      />
        <Text style={styles.infomationText}>
          Hãy thanh toán cho con của bạn
          </Text>
      </View>

      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={[styles.btn, styles.btnDeny, styles.boxshadow]}>
          <Text style={styles.btnText}>Trì hoãn</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPay}
          style={[styles.btn, styles.btnAccpet, styles.boxshadow]}>
          <Text
            style={[styles.btnText, { color: BackgroundColor.white }]}
          >
            Thanh toán
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  childItemContainer: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: BackgroundColor.white,
    marginRight: 10,
    borderRadius: 8,
  },

  points: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "flex-end"
  },

  point: {
    width: 25,
    height: 10,
    borderRadius: 99,
  },

  boxshadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  avtarImage: {
    width: 40,
    height: 40,
    borderRadius: 999,
  },

  fullName: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 16
  },

  childInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: SCREEN_WIDTH * 0.7,
  },

  notificationContent: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },

  infomationText: {
    color: BackgroundColor.gray_text
  },

  payIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },

  btnContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  btn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    flex: 1,
    width: SCREEN_WIDTH * 0.3,
  },

  btnText: {
    fontWeight: "bold",
    textAlign: "center",
  },

  btnDeny: {
    backgroundColor: BackgroundColor.warning,
  },

  btnAccpet: {
    backgroundColor: BackgroundColor.primary,
    color: BackgroundColor.white,
  },


});
