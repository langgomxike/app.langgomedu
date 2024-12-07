import {View, Text, TouchableOpacity, FlatList, StyleSheet} from "react-native";
import React, { useContext } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import User from "../../models/User";
import { BackgroundColor } from "../../configs/ColorConfig";
import { Image } from "react-native";
import { LanguageContext } from "../../configs/LanguageConfig";
import ReactAppUrl from "../../configs/ConfigUrl";
import { Dimensions } from "react-native";

type MembersInClassProps = {
    members: User[]
}

const URL = ReactAppUrl.PUBLIC_URL;
const {width: SCREEN_WIDTH} = Dimensions.get("screen");
export default function MembersInClass({members}: MembersInClassProps) {
    const language = useContext(LanguageContext).language;
  return (
    <View>
      <FlatList
        data={members}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({item: student}) => {
          return (
            <View>
              <View  style={[styles.checkbox,styles.boxShadow]}>
                <View style={styles.studentSelect}>
                  <View style={styles.studentContainer}>
                    <Image
                      source={{
                        uri: `${URL}${student.avatar}`,
                      }}
                      style={styles.avtarImage}
                    />
                    <Text style={styles.activeText}>{student.full_name}</Text>
                  </View>
                </View>

                <View style={styles.notificationContent}>
                    <Feather name="check-circle" size={24} color="green" />
                    <Text style={styles.notificationText}>
                     {language.CHILD_ALREADY_ENROLLED}
                    </Text>
                  </View>

              </View>
            </View>
          );
        }}
        contentContainerStyle={[{
          paddingHorizontal: 15,
          paddingVertical: 5,}, members.length === 1 && styles.centeredItem,] }
      />
    </View>
  );
}

const styles = StyleSheet.create({

    boxShadow: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    
        elevation: 3,
      },

  checkbox: {
    backgroundColor: BackgroundColor.white,
    borderWidth: 1,
    borderColor: BackgroundColor.gray_e6,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 15,
    marginBottom: 15,
    width: SCREEN_WIDTH * 0.7,
    marginRight: 15,
  },

  activeCheckbox: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: BackgroundColor.gray_e6,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 15,
    marginBottom: 12,
  },

  checkboxText: {
    color: "#6b7280",
    fontSize: 14,
  },

  activeText: {
    color: "#374151",
    fontSize: 14,
  },

  studentSelect: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },

  studentContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  avtarImage: {
    width: 40,
    height: 40,
    borderRadius: 999,
  },

  borderWarming: {
    borderWidth: 1,
    borderColor: BackgroundColor.warning,
  },

  notificationContent: {
    alignItems: "center",
  },
  notificationText: {
    marginTop: 5,
    color: BackgroundColor.gray_text,
    textAlign: "center",
  },

  addStudentContainer: {
    alignItems: "center",
  },

  addStudent: {
    backgroundColor: BackgroundColor.primary,
    borderRadius: 10,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  addStudentText: {
    width: "100%",
    textAlign: "center",
    color: BackgroundColor.white,
    fontWeight: "bold",
  },

  centeredItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
