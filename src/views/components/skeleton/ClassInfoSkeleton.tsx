import React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BackgroundColor } from "../../../configs/ColorConfig";
import CustomShimmer from "./CustomShimmer";

export default function () {
  return (
    <View>
      {/* Class infomation */}
      <View style={styles.classInfoContainer}>
        {/* Tiêu đề môn học */}
        <CustomShimmer
          height={30}
          style={{ width: "100%", marginBottom: 15 }}
        />

        <View style={styles.row}>
          <View style={styles.itemInfoTwo}>
            <CustomShimmer height={20} style={{ width: "100%" }} />
          </View>

          <View style={[styles.itemInfoTwo, { justifyContent: "flex-end" }]}>
            <CustomShimmer height={20} style={{ width: "100%" }} />
          </View>
        </View>

        <View style={[styles.line, { marginTop: 10 }]}></View>

        <View style={styles.itemInfo}>
          <View style={styles.row}>
            <CustomShimmer height={20} width={100} />
          </View>
            <CustomShimmer height={20} width={100} />
        </View>

        <View style={styles.itemInfo}>
          <View style={styles.row}>
            <CustomShimmer height={20} width={100} />
          </View>
            <CustomShimmer height={20} width={200} />
        </View>

        <View style={styles.itemInfo}>
          <View style={styles.row}>
            <CustomShimmer height={20} width={100} />
          </View>
            <CustomShimmer height={20} width={150} />
        </View>

        <View style={styles.itemInfo}>
          <View style={styles.row}>
            <CustomShimmer height={20} width={100} />
          </View>
            <CustomShimmer height={20} width={50} />
        </View>

        <View style={styles.itemInfo}>
          <View style={styles.row}>
            <CustomShimmer height={20} width={100} />
          </View>
            <CustomShimmer height={20} width={50} />
        </View>

        <View style={styles.itemInfo}>
          <View style={styles.row}>
            <CustomShimmer height={20} width={100} />
          </View>
            <CustomShimmer height={20} width={200} />
        </View>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: BackgroundColor.gray_c6,
  },

  icImage: {
    width: 24,
    height: 24,
    borderRadius: 999,
  },

  classInfoContainer: {
    paddingHorizontal: 20,
  },

  classInfoTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  itemInfoTwo: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  itemInfo: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  itemContent: {
    flex: 1,
    textAlign: "right",
    color: BackgroundColor.primary,
    fontWeight: "bold",
  },

  itemContentBlack: {
    flex: 1,
    textAlign: "right",
    color: BackgroundColor.black,
    fontWeight: "bold",
  },

  itemContentFee: {
    flex: 1,
    textAlign: "right",
    color: BackgroundColor.danger,
    fontWeight: "bold",
  },
});
