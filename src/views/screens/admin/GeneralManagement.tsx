import React, { useContext } from "react";
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
import {BackgroundColor} from "../../../configs/ColorConfig";
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
import MyIcon, {AppIcon} from "../../components/MyIcon";
import { LanguageContext } from "../../../configs/LanguageConfig";

export default function Attendance() {
  // Styles animated chevron
  // context
  const language = useContext(LanguageContext).language;

  return (
    <View>
      {/* header*/}
      <View>
        <View style={styles.icon}>
          <MyIcon icon={AppIcon.back_button}></MyIcon>
        </View>
        <Text style={styles.screenName}>{language.QUAN_LY_CHUNG}</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.group}>
          <View style={styles.iconInGroup}>
            <MyIcon icon={AppIcon.next}></MyIcon>
          </View>
          <Text style={styles.nameInGroup}>{language.QUAN_LY_PHAN_QUYEN}</Text>
        </View>

        <View style={styles.group}>
          <View style={styles.iconInGroup}>
            <MyIcon icon={AppIcon.next}></MyIcon>
          </View>
          <Text style={styles.nameInGroup}>{language.THEM_QUYEN_QUAN_TRI}</Text>
        </View>

        <View style={styles.group}>
          <View style={styles.iconInGroup}>
            <MyIcon icon={AppIcon.next}></MyIcon>
          </View>
          <Text style={styles.nameInGroup}>{language.QUAN_LY_NGUOI_DUNG}</Text>
        </View>

        <View style={styles.group}>
          <View style={styles.iconInGroup}>
            <MyIcon icon={AppIcon.next}></MyIcon>
          </View>
          <Text style={styles.nameInGroup}>{language.QUAN_LY_LOP_HOC}</Text>
        </View>

        <View style={styles.group}>
          <View style={styles.iconInGroup}>
            <MyIcon icon={AppIcon.next}></MyIcon>
          </View>
          <Text style={styles.nameInGroup}>{language.QUAN_LY_CHUNG}</Text>
        </View>

        <View style={styles.group}>
          <View style={styles.iconInGroup}>
            <MyIcon icon={AppIcon.next}></MyIcon>
          </View>
          <Text style={styles.nameInGroup}>{language.QUAN_LY_CHUNG}</Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
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
    height: "10%",
    width: "100%",
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
  iconInGroup: {
    width: 30,
    height: 30,
    marginTop: "4%",
    marginLeft: "90%",
    marginBottom: "3%",
    resizeMode: "contain",
  },
  nameInGroup: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: "-12%",
    marginLeft: "5%",
    color: "#000",
  },
  screenName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: "-14%",
    marginLeft: "15%",
    color: "#000",

  },
  icon: {
    marginLeft: "5%",
    marginTop: '10%',
  }
});
