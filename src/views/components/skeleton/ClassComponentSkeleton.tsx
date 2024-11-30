import { Image, StyleSheet, Text, View, TouchableOpacity, Dimensions, FlatList} from "react-native";
import React from "react";
import { BackgroundColor } from "../../../configs/ColorConfig";
import CustomShimmer from "./CustomShimmer";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";

const {width, height} = Dimensions.get("screen");
const ICON_SIZE = 20;
export default function ClassComponentSkeleton() {
  
  return (
    <FlatList
    showsVerticalScrollIndicator={false}
    data={[1,2,3,4,5]}
    renderItem={() => (
      <View style={[styles.classItemContainer, styles.boxshadow,]}>
        <View style={styles.majorContainer}>
        <CustomShimmer height={45} width={45} isCircle={true} style={{marginRight: 10}}/>
        <CustomShimmer height={20} style={{marginRight: 10, flex: 1}}/>
        </View>
            
        <CustomShimmer height={10} width={width * 0.5} style={{marginTop: 15}}/>

        <View style={styles.line}></View>

        <View style={styles.classContent}>
          <View style={styles.textWithIconContainer}>
            <CustomShimmer height={10} style={{marginRight: 10, flex: 1}}/>
          </View>

          <View style={styles.textWithIconContainer}>
          <CustomShimmer height={10} style={{marginRight: 10, flex: 1}}/>
          </View>

          <View style={styles.textWithIconContainer}>
          <CustomShimmer height={10} style={{marginRight: 10, flex: 1}}/>
          </View>

          <CustomShimmer height={10} style={{marginRight: 10, flex: 1}}/>

          <View style={styles.textWithIconContainer}>
          <CustomShimmer height={10} style={{marginRight: 10, flex: 1}}/>
          </View>
        </View>

        <View style={styles.line}></View>
        <View style={styles.authorContainer}>
          <View style={styles.authorContent}>
          <CustomShimmer height={45} width={45} isCircle={true} style={{marginRight: 10}}/>
          <CustomShimmer height={20} width={width * 0.5} style={{marginRight: 10}}/>
          </View>
        </View>
      </View>
    )}
    contentContainerStyle={{paddingHorizontal: 10,}}
    />
  );
}

const styles = StyleSheet.create({
  classItemContainer: {
    marginTop: 20,
    backgroundColor: BackgroundColor.white,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
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

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15
  },


  createdTime: {
    backgroundColor: "rgba(143, 209, 79, 0.3)",
    paddingHorizontal: 15,
    paddingVertical: 3,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "500"
  },
  

  majorContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  majorImage: {
    width: 35,
    height: 35,
    marginBottom: 10,
  },

  majorName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  titleClass: {
    fontWeight: "500",
    fontSize: 15,
  },

  line: {
    height: 1,
    backgroundColor: BackgroundColor.gray_c6,
    marginTop: 10,
  },

  classContent: {
    marginTop: 10,
    gap: 10,
  },

  textWithIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  textWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  authorContainer: {
    marginTop: 10,
    gap: 10,
  },

  containerSubTitle: {
    fontWeight: "bold",
    fontSize: 15,
  },

  authorContent: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  authorAvatar: {
    width: 35,
    height: 35,
    borderRadius: 999,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
