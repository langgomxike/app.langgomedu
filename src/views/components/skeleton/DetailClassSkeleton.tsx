import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { BackgroundColor, BorderColor } from "../../../configs/ColorConfig";
import CourseItem from "../CourseItem";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomShimmer from "./CustomShimmer";

export default function ClassDetail() {

  // render
  return (
    <View style={styles.container}>
      <View style={{ flex: 9 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              {/* Header */}
              <View style={styles.headerContainer}>
                <CustomShimmer width={80} height={80} isCircle={true}/>
                <CustomShimmer width={200} height={30} style={{marginTop: 20}}/>
              </View>
              {/* Body */}
              <View style={styles.bodyContainer}>
                {/* Class infomation */}
                <View style={styles.classInfoContainer}>
                  {/* Tiêu đề môn học */}
                  <CustomShimmer width={200} height={20}/>

                  <CustomShimmer width={300} height={20} style={{marginTop: 10}}/>
                  <View style={[styles.line, { marginTop: 10 }]}></View>

                  <View style={styles.itemInfo}>
                    <CustomShimmer width={250} height={20}/>
                  </View>

                  <View style={styles.itemInfo}>
                  <CustomShimmer width={250} height={20}/>
                  </View>

                  <View style={styles.itemInfo}>
                  <CustomShimmer width={250} height={20}/>
                  </View>

                  <View style={styles.itemInfo}>
                  <CustomShimmer width={250} height={20}/>
                  </View>

                  <View style={[styles.line, { marginTop: 10 }]}></View>

                  <View style={[styles.itemInfo, { marginTop: 20 }]}>
                  <CustomShimmer width={250} height={20}/>
                  </View>
                </View>

                {/* Stduent infomation */}
                <View style={styles.studentInfomationContainer}>
                  <Text style={[styles.containerTitle, { marginBottom: 10 }]}>
                    Mô tả
                  </Text>
                  <CustomShimmer width={350} height={50}/>
                </View>

                {/* Các lớp học liên quan */}
                <View style={styles.relatedClassContainer}>
                  <Text style={[styles.containerTitle, { padding: 20 }]}>
                    Các lớp liên quan
                  </Text>
                  <FlatList
                    data={[1,2]}
                    renderItem={({ item:relatedClass }) => (
                      <View style={styles.classItem}>
                        <Pressable>
                        <CustomShimmer width={300} height={300}/>
                        </Pressable>
                      </View>
                    )}
                    keyExtractor={(index) => index.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[
                      styles.classList,
                    ]}
                  />
                 
                </View>
              </View>
            </View>
          </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.gray_e6,
  },

  headerContainer: {
    backgroundColor: BackgroundColor.primary,
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,

    elevation: 18,
  },

  bodyContainer: {},

  line: {
    height: 1,
    backgroundColor: BackgroundColor.gray_c6,
  },

  imageContainer: {
    padding: 10,
    borderRadius: 999,
    backgroundColor: BackgroundColor.white,
  },
  headerImage: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: BackgroundColor.white,
  },

  classInfoContainer: {
    backgroundColor: BackgroundColor.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -50,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 10,
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
    marginTop: 10,
  },

  itemContent: {
    flex: 1,
    textAlign: "right",
    color: BackgroundColor.primary,
    fontWeight: "bold",
  },

  itemContentFee: {
    flex: 1,
    textAlign: "right",
    color: BackgroundColor.danger,
    fontWeight: "bold",
  },

  studentInfomationContainer: {
    backgroundColor: BackgroundColor.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 10,
  },

  containerTitle: {
    fontWeight: "bold",
    fontSize: 15,
  },

  itemInfoTitle: {
    fontWeight: "bold",
  },

  itemInfoText: {
    flex: 1,
    textAlign: "right",
  },

  btnReceiveClass: {
    backgroundColor: BackgroundColor.primary,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginHorizontal: 50,
    borderRadius: 10,
  },

  btnReceiveClassText: {
    color: BackgroundColor.white,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },

  buttonContainer: {
    flex: 1,
    backgroundColor: BackgroundColor.white,
    justifyContent: "center",
    borderTopColor: BorderColor.gray_30,
    borderTopWidth: 1,
  },

  relatedClassContainer: {
    backgroundColor: BackgroundColor.white,
    marginBottom: 20,
    paddingBottom: 20,
  },

  classItem: {
    padding: 10,
    width: 350,
  },

  classList: {
    paddingBottom: 10,
    paddingHorizontal: 10,
  },

  centeredItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
