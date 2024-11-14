import React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  Touchable,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import { BackgroundColor } from "../../../configs/ColorConfig";
import ModalStudentList from "../../components/modal/ModalStudentList";
import ModalAttended from "../../components/modal/ModalAttended";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ModalPaidResult from "../../components/modal/ModalPaidResult";
import ClassInfo from "../../components/ClassInfo";
import MyIcon, { AppIcon } from "../../components/MyIcon";

export default function Attendance() {
  // Styles animated chevron

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.icon_setting}>
          <MyIcon icon={AppIcon.ic_setting}></MyIcon>
        </View>

        <Image
          style={styles.avatar}
          source={require("../../../../assets/avatar/img_avatar_cat.png")}
        ></Image>
        <Text style={styles.name}>LanggomAdmin</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.group}>
          <Image style={styles.iconInGroup} source={require('../../../../assets/icons/ic_admin_rule.png')}></Image>
          <Text style={styles.nameInGroup}>Quản lý phân quyền</Text>
        </View>
        <View style={styles.group}>
          <Image style={styles.iconInGroup} source={require('../../../../assets/icons/ic_admin_rule.png')}></Image>
          <Text style={styles.nameInGroup}>Thêm quyền quản trị</Text>
        </View>
        <View style={styles.group}>
        <Image style={styles.iconInGroup} source={require('../../../../assets/icons/ic_account_manage.png')}></Image>
          <Text style={styles.nameInGroup}>Quản lý người dùng</Text>
        </View>
        <View style={styles.group}>
          <Image style={styles.iconInGroup} source={require('../../../../assets/icons/ic_class_pending_approval.png')}></Image>
          <Text style={styles.nameInGroup}>Quản lý lớp học</Text>
        </View>
        <View style={styles.group}>
          <Image style={styles.iconInGroup} source={require('../../../../assets/icons/ic_account_manage.png')}></Image>
          <Text style={styles.nameInGroup}>Quản lý chung</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: BackgroundColor.primary,
    padding: 20,
    height: "45%",
    marginBottom: 10,
    alignItems: "center",
  },
  container: {
    borderRadius: 30,
    backgroundColor: "white",
    padding: 20,
    height: "60%",
    marginTop: -100,
    alignItems: "center",
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 500,
    marginTop: "20%",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: "white",
  },
  icon_setting: {
    marginBottom: "-15%",
    marginTop: "5%",
    marginLeft: "90%",
  },
  group: {
    height: "12%",
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 5,
    marginTop: "7%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconInGroup:{
    width:30,
    height: 30,
    marginTop: "4%",
    marginLeft: "5%",
    marginBottom: "3%",
    resizeMode: "contain",
  },
  nameInGroup:{
    fontSize: 18,
    fontWeight: "bold",
    marginTop: "-12%",
    marginLeft: "20%",
    color: "#000",
  },
});
