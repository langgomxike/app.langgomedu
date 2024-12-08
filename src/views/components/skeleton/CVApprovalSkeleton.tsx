import { Text, View, StyleSheet, Image, ScrollView, FlatList, TouchableOpacity, Dimensions } from "react-native";
import React, { useContext, useEffect, useState } from "react";
//config
import { BackgroundColor, TextColor } from "../../../configs/ColorConfig";
//icon
//orther component
import HLine, { HLineType } from "../HLine";
import CustomShimmer from "./CustomShimmer";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");
export default function CVApprovalSkeleton() {


  return (
    <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
        <CustomShimmer width={80} height={80} isCircle={true} style={{marginTop: 10, marginBottom: 10}}/>
        <CustomShimmer width={SCREEN_WIDTH * 0.4} height={20}/>
          {/* TITLE */}
          <CustomShimmer width={SCREEN_WIDTH * 0.4} height={10} style={{marginTop: 10, marginBottom: 20}}/>

        </View>
        {/* main - view */}
        <View style={styles.main}>
          {/* informations */}
          <View style={styles.infor}>
            <View style={styles.inforItem}>
              {/* day of birth */}
              <View style={styles.inforItemChild}>
              <CustomShimmer width={SCREEN_WIDTH * 0.4} height={15}/>
              </View>
              {/* phone number */}
              <View style={styles.inforItemChild}>
              <CustomShimmer width={SCREEN_WIDTH * 0.4} height={15}/>
              </View>
            </View>
            <View style={styles.inforItem}>
              {/* interested major */}
              <View style={styles.inforItemChild}>
                <CustomShimmer width={SCREEN_WIDTH * 0.6} height={15}/>
              </View>
            </View>
            <View style={styles.inforItem}>
              {/* location */}
              <View style={styles.inforItemChild}>
                <CustomShimmer height={15} style={{flex: 1}}/>
              </View>
            </View>
          </View>
          <HLine type={HLineType.LIGHT} />
          {/* about me */}
          <View style={styles.aboutView}>
          <CustomShimmer height={100} width={SCREEN_WIDTH * 0.9}/>
          </View>

          {/* education */}
          <CustomShimmer height={200} width={SCREEN_WIDTH - 20 * 1}/>
          {/* Certificate */}
          <CustomShimmer height={200} width={SCREEN_WIDTH - 20 * 1} style={{marginTop: 20}}/>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.primary,
  },
  header: {
    backgroundColor: BackgroundColor.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  main: {
    marginTop: 30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: BackgroundColor.white,
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 999,
    marginTop: 10,
  },
  badge: {
    backgroundColor: BackgroundColor.schedule_leaner,
    color: TextColor.black,
    fontWeight: "bold",
    paddingHorizontal: 25,
    paddingVertical: 3,
    borderRadius: 10,
    transform: [{ translateY: -10 }],
  },
  name: {
    color: TextColor.white,
    fontWeight: "bold",
    fontSize: 20,
  },
  title: {
    margin: 0,
    padding: 5,
    color: TextColor.white,
    borderWidth: 1,
    borderRadius: 5,
  },
  infor: {
    flexDirection: "column",
    marginHorizontal: 15,
    marginTop: 10,
  },
  inforItem: {
    flexDirection: "row",
  },
  inforItemChild: {
    flexDirection: "row",
    flex: 1,
    marginBottom: 15,
  },
  inforItemText: {
    fontSize: 14,
  },
  aboutView: {
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  aboutText: {
    margin: 0,
    padding: 5,
    fontSize: 14,
    color: TextColor.black,
    borderWidth: 1,
    borderRadius: 5,
  },
  approveCVBox: {
    backgroundColor: BackgroundColor.white,
    borderColor: BackgroundColor.gray_e6,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  approveCVText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  approveTitleBox: {
    backgroundColor: BackgroundColor.primary,
    borderColor: BackgroundColor.gray_e6,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  approveBioBox: {
    backgroundColor: BackgroundColor.white,
    borderColor: BackgroundColor.gray_e6,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    gap: 5,
  },
  oldBorder: {
    borderColor: BackgroundColor.warning,
  },
  oldBackground: {
    backgroundColor: BackgroundColor.warning,
  },
  newBorder: {
    borderColor: BackgroundColor.success,
  },
  newBackground: {
    backgroundColor: BackgroundColor.success,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  btnCotainer: {
    flexDirection: "row",
    gap: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: BackgroundColor.white,
    borderTopWidth: 2,
    borderTopColor: BackgroundColor.gray_e6
  },

  btn: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 20,
    alignItems: "center",
    borderRadius: 8,
  },

  btnDeny: {
    borderWidth: 1,
    borderColor: "#ff0000",
  },

  btnDenyText: {
    color: "#ff0000",
  },

  btnAccept: {
    backgroundColor: BackgroundColor.primary,
  },

  btnAcceptText: {
    color: BackgroundColor.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 4,
  },
  oldBadge: {
    borderWidth: 1,
    borderRadius: 5, 
    backgroundColor: BackgroundColor.warning,
    borderColor: BackgroundColor.warning,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  newBadge: {
    borderWidth: 1,
    borderRadius: 5, 
    backgroundColor: BackgroundColor.success,
    borderColor: BackgroundColor.success,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  bagdeText: {
    fontSize: 12,
    color: TextColor.white,
  }
});
