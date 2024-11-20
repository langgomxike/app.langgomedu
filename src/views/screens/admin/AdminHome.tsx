import React, {useCallback, useContext} from "react";
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
import {NavigationContext} from "@react-navigation/native";
import ScreenName from "../../../constants/ScreenName";
import {LanguageContext} from "../../../configs/LanguageConfig";

export default function AdminHome() {
  const navigation = useContext(NavigationContext);
  const language = useContext(LanguageContext).language;

  // handler
  const gotToUserManager = useCallback(() => {
    navigation?.navigate(ScreenName.USER_MANAGEMENT);
  }, []);

  const gotToClassManager = useCallback(() => {
    navigation?.navigate(ScreenName.CLASS_MANAGEMENT);
  }, []);

  const goToPermissionManager = useCallback(() => {
    navigation?.navigate(ScreenName.PERMISSION_MANAGEMENT);
  }, []);

  const goToGeneralManager = useCallback(() => {
    navigation?.navigate(ScreenName.APP_INFO_MANAGEMENT);
  }, []);

  const goToSetting = useCallback(() => {
    navigation?.navigate(ScreenName.SETTING_INFO_PERSONAL);
  }, []);

  return (
    <View>
      {/* header */}
      <View style={styles.header}>
        {/* setting account */}
        <TouchableOpacity style={styles.icon_setting}>
          <Ionicons name="settings-outline" size={24} color="white" onPress={goToSetting}/>
        </TouchableOpacity>

        <Image
          style={styles.avatar}
          source={require("../../../../assets/avatar/img_avatar_cat.png")}
        />
        <Text style={styles.name}>LanggomAdmin</Text>
      </View>

      <View style={styles.container}>
        <TouchableOpacity style={styles.group} onPress={goToPermissionManager}>
          <Image style={styles.iconInGroup} source={require('../../../../assets/icons/ic_admin_rule.png')}></Image>
          <Text style={styles.nameInGroup}>{language.PERMISSION_MANAGEMENT}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={gotToUserManager}
          style={styles.group}>
          <Image style={styles.iconInGroup} source={require('../../../../assets/icons/ic_account_manage.png')}></Image>
          <Text style={styles.nameInGroup}>{language.USER_MANAGEMENT}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={gotToClassManager} style={styles.group}>
          <Image style={styles.iconInGroup}
                 source={require('../../../../assets/icons/ic_class_pending_approval.png')}></Image>
          <Text style={styles.nameInGroup}>{language.CLASS_MANAGEMENT}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.group} onPress={goToGeneralManager}>
          <Image style={styles.iconInGroup} source={require('../../../../assets/icons/ic_account_manage.png')}></Image>
          <Text style={styles.nameInGroup}>{language.GENERAL_MANAGEMENT}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: BackgroundColor.primary,
    marginBottom: 10,
    alignItems: "center",
    paddingBottom: 60
  },
  container: {
    borderRadius: 30,
    backgroundColor: "white",
    marginTop: -30,
    paddingHorizontal: 20,
    paddingTop: 30,
    gap: 20,
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 500,
    marginTop: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: "white",
  },
  icon_setting: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "100%",
    paddingHorizontal: 20
  },
  group: {
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

    flexDirection: "row",
    gap: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },

  iconInGroup: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  nameInGroup: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});
