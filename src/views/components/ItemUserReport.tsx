import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import MyIcon, { AppIcon } from "./MyIcon";
// Định nghĩa enum AppIcon ở đầu file

type IconReport = {
  userAvatar?: string;
  userName: string;
  credibility: number;
};

const IconReport: React.FC<IconReport> = ({
  userAvatar,
  userName,
  credibility,
}) => {
  return (
    <View style={styles.user}>
      <View style={styles.userInfor}>
        <Image
          source={
            userAvatar
              ? { uri: userAvatar }
              : require("../../../assets/avatar/avatarTempt.png")
          }
          style={styles.avatar}
        />
        <Text style={styles.userName}>{userName}</Text>
      </View>

      <View style={styles.containerRight}>
        <Text style={styles.credibility}>{credibility}</Text>
        <View style={styles.diemuytin}>
          {/* <MyIcon icon={AppIcon.ic_diemuytin}></MyIcon> */}
          <Image
            source={require("../../../assets/icons/ic_diemuytin.png")}
            style={styles.icon}
          />
        </View>
        <View style={styles.iconBack}>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  user: {
    flexDirection: "row",
    height: 60,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
  },
  userInfor: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  icon: {
    width: 30,
    height: 30,
  },
  userName: {
    fontSize: 16,
    marginLeft: 10,
  },
  diemuytin: {},
  credibility: {},
  iconBack: {},
  containerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});

export default IconReport;
