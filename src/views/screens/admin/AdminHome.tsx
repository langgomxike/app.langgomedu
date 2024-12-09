import React, {useCallback, useContext, useEffect, useState} from "react";
import {Alert, Image, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {BackgroundColor} from "../../../configs/ColorConfig";
import {NavigationContext} from "@react-navigation/native";
import ScreenName from "../../../constants/ScreenName";
import {LanguageContext} from "../../../configs/LanguageConfig";
import {AccountContext} from "../../../configs/AccountConfig";
import {RoleList} from "../../../models/Role";
import SLog, {LogType} from "../../../services/SLog";
import {PermissionList} from "../../../models/Permission";
import ARole from "../../../apis/ARole";
import APermission from "../../../apis/APermission";
import SFirebase, {FirebaseNode} from "../../../services/SFirebase";
import User from "../../../models/User";

export default function AdminHome() {
  const navigation = useContext(NavigationContext);
  const language = useContext(LanguageContext).language;
  const accountContext = useContext(AccountContext);

  //states
  const [canManagePermissions, setCanManagePermissions] = useState(false);
  const [canManageAppInfo, setCanManageAppInfo] = useState(false);
  const [canManageUsers, setCanManageUsers] = useState(false);
  const [canManageClasses, setCanManageClasses] = useState(false);

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

  //effects
  useEffect(() => {
    if (!accountContext.account || !accountContext.setAccount) return;

    SFirebase.track(FirebaseNode.Permissions, [], () => {
      if (!accountContext.account || !accountContext.setAccount) return;

      APermission.getPermissionsOfUser(accountContext.account, (permissions) => {
        if (!accountContext.account || !accountContext.setAccount) return;


        const user: User = {...accountContext.account};
        user.permissions = permissions;

        accountContext.setAccount(user);
        SLog.log(LogType.Info, "update permissions", "reload", user.permissions.length);
      }, () => {
      });
    });
  }, [accountContext.account?.permissions?.length]);

  useEffect(() => {
    if (!accountContext.account) return;

    const isSupperAdmin = !!accountContext.account.roles?.map(r => r.id).includes(RoleList.SUPER_ADMIN);

    setCanManagePermissions(isSupperAdmin);
    setCanManageAppInfo(isSupperAdmin || !!accountContext.account.permissions?.map(p => p.id).includes(PermissionList.VIEW_APP_COMMON_INFORMATION));
    setCanManageUsers(isSupperAdmin || !!accountContext.account.permissions?.map(p => p.id).includes(PermissionList.VIEW_USER_INFORMATION_LIST));
    setCanManageClasses(isSupperAdmin || !!accountContext.account.permissions?.map(p => p.id).includes(PermissionList.VIEW_OTHER_USER_CLASS_LIST));
  }, [accountContext.account, accountContext.account?.permissions]);

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
        {canManagePermissions ? (
          <TouchableOpacity style={styles.group} onPress={goToPermissionManager}>
            <Image style={styles.iconInGroup} source={require('../../../../assets/icons/ic_admin_rule.png')}></Image>
            <Text style={styles.nameInGroup}>{language.PERMISSION_MANAGEMENT}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.group, styles.groupNoPers]}>
            <Image style={styles.iconInGroup} source={require('../../../../assets/icons/ic_admin_rule.png')}></Image>
            <Text style={styles.nameInGroup}>{language.PERMISSION_MANAGEMENT}</Text>
          </TouchableOpacity>
        )}

        {canManageUsers ? (
          <TouchableOpacity
            onPress={gotToUserManager}
            style={styles.group}>
            <Image style={styles.iconInGroup}
                   source={require('../../../../assets/icons/ic_account_manage.png')}></Image>
            <Text style={styles.nameInGroup}>{language.USER_MANAGEMENT}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.group, styles.groupNoPers]}>
            <Image style={styles.iconInGroup}
                   source={require('../../../../assets/icons/ic_account_manage.png')}></Image>
            <Text style={styles.nameInGroup}>{language.USER_MANAGEMENT}</Text>
          </TouchableOpacity>
        )}

        {canManageClasses ? (
          <TouchableOpacity onPress={gotToClassManager} style={styles.group}>
            <Image style={styles.iconInGroup}
                   source={require('../../../../assets/icons/ic_class_pending_approval.png')}></Image>
            <Text style={styles.nameInGroup}>{language.CLASS_MANAGEMENT}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.group, styles.groupNoPers]}>
            <Image style={styles.iconInGroup}
                   source={require('../../../../assets/icons/ic_class_pending_approval.png')}></Image>
            <Text style={styles.nameInGroup}>{language.CLASS_MANAGEMENT}</Text>
          </TouchableOpacity>
        )}

        {canManageAppInfo ? (
          <TouchableOpacity style={styles.group} onPress={goToGeneralManager}>
            <Image style={styles.iconInGroup}
                   source={require('../../../../assets/icons/ic_account_manage.png')}></Image>
            <Text style={styles.nameInGroup}>{language.GENERAL_MANAGEMENT}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.group, styles.groupNoPers]}>
            <Image style={styles.iconInGroup}
                   source={require('../../../../assets/icons/ic_account_manage.png')}></Image>
            <Text style={styles.nameInGroup}>{language.GENERAL_MANAGEMENT}</Text>
          </TouchableOpacity>
        )}
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
    shadowColor: BackgroundColor.gray_c6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,

    flexDirection: "row",
    gap: 10,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },

  groupNoPers: {
    shadowColor: BackgroundColor.black,
    backgroundColor: "#eee",
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
