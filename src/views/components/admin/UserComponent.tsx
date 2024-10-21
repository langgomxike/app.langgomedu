import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BackgroundColor } from "../../../configs/ColorConfig";
import { color } from "react-native-elements/dist/helpers";
import CourseItem from "../CourseItem";

type UserComponentProps = {
  onPressOpenSheet: () => void;
}

export default function UserComponent ({
  onPressOpenSheet
}:UserComponentProps) {
    //state 
    const [report, setReport] = useState(false)
  //render
  return (
    <View style={[styles.container, report === true ?  [styles.boxshadowDanger, styles.borderDanger]: styles.boxshadow]}>
      <TouchableOpacity onPress={onPressOpenSheet}>
        <View style={styles.userHeaderContainer}>
          <View style={styles.userInfoBlock}>
            <View style={styles.userAvatarContainer}>
              <Image
                source={require("../../../../assets/avatar/img_avatar_cat.png")}
                style={styles.userAvatar}
              />
              <Text style={styles.userFullName}>Nguyen Van A</Text>
            </View>
            {
              report &&
                <Text style={styles.badge}>Bị báo cáo</Text>

            }
          </View>

          <View style={styles.line}></View>

          <View style={styles.userHeaderContent}>
            <View style={[styles.row, { marginBottom: 10 }]}>
              <Text style={[styles.title, { color: BackgroundColor.primary }]}>
                Điểm uy tín:
              </Text>
              <Text style={styles.content}>1000</Text>
            </View>

            <View style={styles.rowItem}>
              <View style={[styles.row, { flex: 1 }]}>
                <Ionicons name="calendar-outline" size={20} color="black" />
                <Text style={styles.content}>10/10/2024</Text>
              </View>

              <View style={[styles.row, { flex: 1 }]}>
                <Ionicons name="call-outline" size={20} color="black" />
                <Text style={styles.content}>0999999999</Text>
              </View>
            </View>

            <View style={styles.row}>
              <MaterialIcons name="location-history" size={20} color="black" />
              <Text style={styles.content}>
                Đường số 6, phường Linh Chiểu, TP Thủ Đức
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
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
  },

  userHeaderContainer: {
  },

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

  userHeaderContent: {},

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  rowItem: {
    flexDirection: "row",
    marginBottom: 10,
  },

  title: {
    fontSize: 14,
    fontWeight: "bold",
  },

  content: {
    fontSize: 14,
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
});
