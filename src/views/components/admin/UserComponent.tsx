import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BackgroundColor } from "../../../configs/ColorConfig";
import User from "../../../models/User";
import ReactAppUrl from "../../../configs/ConfigUrl";
import DateTimeConfig from "../../../configs/DateTimeConfig";
import moment from "moment";

type UserComponentProps = {
  isButtonDetailReport?: boolean;
  userData: User;
};

const URL = ReactAppUrl.PUBLIC_URL;

export default function UserComponent({
  isButtonDetailReport,
  userData,
}: UserComponentProps) {
  // states -------------------------------------------------------------------

  // handler ------------------------------------------------------------------

  // effect -------------------------------------------------------------------

  //render --------------------------------------------------------------------
  return (
    <View style={styles.userHeaderContainer}>
      <View style={styles.userInfoBlock}>
        <View style={styles.userAvatarContainer}>
          <Image
            source={{ uri: `${URL}${userData.avatar}` }}
            style={styles.userAvatar}
          />
          <Text style={styles.userFullName}>{userData.full_name}</Text>

        </View>
        {userData.is_reported && <Text style={styles.badge}>Bị báo cáo</Text>}
      </View>

      <View style={styles.line}></View>

      <View style={styles.userHeaderContent}>
        <View style={[styles.row, { marginBottom: 5 }]}>
          <Text style={[styles.title, { color: BackgroundColor.primary }]}>
            Điểm uy tín:
          </Text>
          <Text style={styles.content}>{userData.point}</Text>
        </View>

        <View style={styles.rowItem}>
          <View style={[styles.row, { flex: 1 }]}>
            <Ionicons name="calendar-outline" size={20} color="black" />
            <Text style={styles.content}>
              {moment(userData.birthday).format("DD/MM/YYYY")}
            </Text>
          </View>

          <View style={[styles.row, { flex: 1 }]}>
            <Ionicons name="call-outline" size={20} color="black" />
            <Text style={styles.content}>{userData.phone_number}</Text>
          </View>
        </View>

        <View style={styles.row}>
        <Ionicons name={userData.gender?.id == 2 ? "female-outline" : "male-outline"} size={20} color="black" />
          <Text style={[styles.content]}>
            {userData.gender?.vn_name}
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="location-outline" size={20} color="black" />
          <Text style={[styles.content]}>
            {`${userData.address?.ward}, ${userData.address?.district}, ${userData.address?.province}`}
          </Text>
        </View>
      </View>

      {isButtonDetailReport && (
        <TouchableOpacity style={styles.btnShowDetail}>
          <Text style={styles.btnShowDetailText}>Chi tiết báo cáo</Text>
        </TouchableOpacity>
      )}
    </View>
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
