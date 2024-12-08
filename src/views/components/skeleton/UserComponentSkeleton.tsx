import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { BackgroundColor } from "../../../configs/ColorConfig";
import CustomShimmer from "./CustomShimmer";

const {width, height} = Dimensions.get("screen");
export default function UserComponentSkeleton() {

  return (
      <FlatList
        data={[1, 1, 1]}
        renderItem={(item) => (
          <View style={[styles.container, styles.boxshadow]}>
            <View style={styles.userInfoBlock}>
              <View style={styles.userAvatarContainer}>
              <CustomShimmer height={45} width={45} isCircle={true} style={{marginRight: 10}}/>
              <CustomShimmer height={20} style={{marginRight: 10, flex: 1}}/>
              </View>
            </View>

            <View style={styles.line}></View>

            <View style={styles.userHeaderContent}>
              <View style={[styles.row, { marginBottom: 5 }]}>
                <CustomShimmer height={10} width={width * 0.5} style={{marginRight: 10}}/>
              </View>

              <View style={styles.rowItem}>
                <View style={[styles.row, { flex: 1 }]}>
                <CustomShimmer height={10} style={{marginRight: 10, flex: 1}}/>
                </View>

                <View style={[styles.row, { flex: 1 }]}>
                <CustomShimmer height={10} style={{marginRight: 10, flex: 1}}/>
                </View>
              </View>

              <View style={styles.row}>
              <CustomShimmer height={10} width={width * 0.2} style={{marginRight: 10}}/>
              </View>

              <View style={styles.row}>
              <CustomShimmer height={10} width={width * 0.7} style={{marginRight: 10}}/>
              </View>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 15}}
      />
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingTop: 15,
    paddingBottom: 25,
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  borderDanger: {
    borderColor: "#FF5050",
    borderWidth: 1,
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

  boxshadowDanger: {
    shadowColor: "#FF5050",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
  },

  userHeaderContainer: {},

  userAvatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  userInfoBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  badge: {
    backgroundColor: "#FF5050",
    color: "#fff",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 2,
    fontWeight: "medium",
  },

  userFullName: {
    fontSize: 16,
    fontWeight: "bold",
  },

  userHeaderContent: {
    gap: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  rowItem: {
    flexDirection: "row",
  },

  title: {
    fontSize: 14,
    fontWeight: "bold",
  },

  content: {
    fontSize: 14,
    lineHeight: 20,
  },

  showMoreContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  showMoreText: {
    color: BackgroundColor.gray_c9,
  },

  line: {
    backgroundColor: BackgroundColor.gray_c6,
    height: 1,
    marginVertical: 10,
  },

  btnShowDetail: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 20,
  },

  btnShowDetailText: {
    // color: BackgroundColor.white,
    color: BackgroundColor.warning,
    fontWeight: "bold",
    textAlign: "center",
  },
});
