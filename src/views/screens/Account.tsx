import {Image, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import BackWithDetailLayout from "../layouts/BackWithDetail";
import {ListItemVietnamese, ListItemEnglish, ListItemJapanese} from "../../configs/AccountListItemConfig";
import AccountItem, {AccountItemProps} from "../components/AccountItem";
import QRInfo from "../components/QRInfo";
import {QRItems} from "../../configs/QRConfig";
import React, {ElementRef, useCallback, useContext, useEffect, useRef, useState} from "react";
import {NavigationContext} from "@react-navigation/native";
import ScreenName from "../../constants/ScreenName";
import SAsyncStorage, {AsyncStorageKeys} from "../../services/SAsyncStorage";
import Toast from "react-native-simple-toast";
import {AccountContext} from "../../configs/AccountConfig";
import {LanguageContext} from "../../configs/LanguageConfig";
import vn from "../../../languages/vn.json";
import en from "../../../languages/en.json";
import ja from "../../../languages/ja.json";
import RBSheet from "react-native-raw-bottom-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";
import ConfirmDialog from "../components/ConfirmDialog";
import {AppInfoContext} from "../../configs/AppInfoContext";
import {RoleList} from "../../models/Role";
import {AttendanceNavigationType, IdNavigationType} from "../../configs/NavigationRouteTypeConfig";

type FlatListItemProps = {
  item: AccountItemProps;
  index: number;
}

function FlatListItem({item, index}: FlatListItemProps) {
  // contexts
  const navigation = useContext(NavigationContext);
  const accountContext = useContext(AccountContext);
  const languageContext = useContext(LanguageContext);
  const appInfos = useContext(AppInfoContext).infos;

  //refs
  const refRBSheet = useRef<ElementRef<typeof RBSheet>>(null);

  //states
  const [handlers, setHandler] = useState<Array<any>>([]);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [canOpen, setCanOpen] = useState(true);

  //handlers
  const goToPersonalInfoScreen = useCallback(() => {
    navigation?.navigate(ScreenName.PROFILE);
  }, []);

  const goToRegisterChileScreen = useCallback(() => {
    if (canOpen) {
      navigation?.navigate(ScreenName.REGISTER_STEP_CHILD);
    } else {
      Toast.show(languageContext.language.HAVE_NO_PERMISSION_TO_CREATE_CHILD, 1000);
    }
  }, [accountContext.account, canOpen]);

  const goToCVScreen = useCallback(() => {
    if (canOpen) {
      navigation?.navigate(ScreenName.SETTING_PERSONAL_CV);
    } else {
      Toast.show(languageContext.language.HAVE_NO_PERMISSION_TO_MANAGE_CV, 1000);
    }
  }, [canOpen]);

  const goToAttendanceHistories = useCallback(() => {
    if (canOpen) {
      const data: AttendanceNavigationType = {
        userId: accountContext.account?.id ?? "-1",
        classId: -1,
      }

      navigation?.navigate(ScreenName.ATTENDANCE_HISTORY, data);
    } else {
      Toast.show(languageContext.language.HAVE_NO_PERMISSION_TO_MANAGE_CV, 1000);
    }
  }, [accountContext.account]);

  const sendEmail = useCallback(() => {
    if (canOpen) {
      const email = appInfos.contact_email;
      const subject = languageContext.language.TO_ADMIN_EMAIL_SUBJECT;
      const body = languageContext.language.TO_ADMIN_EMAIL_BODY;
      const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      Linking.openURL(emailUrl);
    } else {
      Toast.show(languageContext.language.HAVE_NO_PERMISSION_TO_MANAGE_CV, 1000);
    }
  }, []);

  const goToChangePasswordScreen = useCallback(() => {
    navigation?.navigate(ScreenName.CHANGE_PASSWORD);
  }, []);

  const handleOpenWebsite = useCallback(() => {
    Linking.openURL(appInfos.webiste_link);
  }, []);

  const handleOpenInAppPackager = useCallback(() => {
    const appStoreUrl = `https://apps.apple.com/app/id${appInfos.apple_store_app_id}`;
    const playStoreUrl = `https://play.google.com/store/apps/details?id=${appInfos.play_store_app_id}`;

    const url = Platform.OS === 'ios' ? appStoreUrl : playStoreUrl;

    Linking.openURL(url);
  }, []);

  const handleChangeLanguage = useCallback((language: typeof vn) => {
    languageContext.setLanguage && languageContext.setLanguage(language);

    refRBSheet.current?.close();
  }, []);

  const handleLogout = useCallback(() => {
    setShowConfirmLogout(false);
    SAsyncStorage.removeData(AsyncStorageKeys.TOKEN,
      () => {
        accountContext.setAccount && accountContext.setAccount(undefined);

        navigation?.navigate(ScreenName.LOGIN);
        Toast.show(`${languageContext.language.LOGOUT_SUSCCESS}`, 2000);
      },
      (error) => {
        alert(`${languageContext.language.LOGOUT_UNSUSCCESS}`);
      }
    )
  }, []);

  useEffect(() => {
    const handlers = [
      goToPersonalInfoScreen,
      goToRegisterChileScreen,
      goToCVScreen,
      goToAttendanceHistories,
      sendEmail,
      goToChangePasswordScreen,
      handleOpenWebsite,
      handleOpenInAppPackager,
      refRBSheet.current?.open,
      () => setShowConfirmLogout(true),
    ];

    setHandler(handlers);
  }, []);

  useEffect(() => {
    let canOpen = false;

    canOpen = canOpen || !(accountContext.account?.roles?.map(role => role.id).includes(RoleList.SUPER_ADMIN) ?? false);
    canOpen = canOpen || !(accountContext.account?.roles?.map(role => role.id).includes(RoleList.ADMIN) ?? false);

    setCanOpen(canOpen);
  }, [accountContext.account]);

  return (
    <>
      <AccountItem
        iconName={item.iconName}
        title={item.title}
        onPress={handlers[index]}
      />

      {/*    language bottom sheet */}
      <RBSheet ref={refRBSheet} useNativeDriver={false} height={150}>
        <TouchableOpacity style={action.action} onPress={() => handleChangeLanguage(vn)}>
          <Image source={require("../../../assets/languages/vn.png")} style={{width: 30, height: 30}}/>
          <Text style={action.item}>Tiếng Việt</Text>
        </TouchableOpacity>

        <TouchableOpacity style={action.action} onPress={() => handleChangeLanguage(en)}>
          <Image source={require("../../../assets/languages/en.png")} style={{width: 30, height: 30}}/>

          <Text style={action.item}>English</Text>
        </TouchableOpacity>

        <TouchableOpacity style={action.action} onPress={() => handleChangeLanguage(ja)}>
          <Image source={require("../../../assets/languages/ja.png")} style={{width: 30, height: 30}}/>

          <Text style={action.item}>日本語</Text>
        </TouchableOpacity>
      </RBSheet>

      {/*confirm dialog for logout*/}
      <ConfirmDialog title={languageContext.language.LOGOUT} content={languageContext.language.LOGOUT_HINT}
                     open={showConfirmLogout}
                     confirm={languageContext.language.CONFIRM}
                     cancel={languageContext.language.CANCEL}
                     onConfirm={handleLogout}
                     onCancel={() => setShowConfirmLogout(false)}/>
    </>
  );
}

export default function AccountScreen() {
  //contexts
  const languageContext = useContext(LanguageContext);
  const accountContext = useContext(AccountContext);
  const navigation = useContext(NavigationContext);

  //states
  const [ListItem, setListItem] = useState<AccountItemProps[]>(ListItemVietnamese);
  const [isAdmin, setIsAdmin] = useState(false);

  //effects
  useEffect(() => {
    let isAdmin = false;

    isAdmin = (accountContext.account?.roles?.map(role => role.id).includes(RoleList.SUPER_ADMIN) ?? false);
    isAdmin = isAdmin || (accountContext.account?.roles?.map(role => role.id).includes(RoleList.ADMIN) ?? false);

    if (!isAdmin) return;

    if (navigation) {
      navigation.setOptions({
        title: languageContext.language.SESSION,
        headerShown: true,
        contentStyle: {
          padding: 0,
        },
        headerStyle: {
          backgroundColor: BackgroundColor.primary,
        },
        headerTintColor: "#fff",
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{paddingRight: 10}}>
            <Ionicons name="chevron-back" size={24} color="white"/>
          </TouchableOpacity>
        )
      });
    }
  }, [navigation, accountContext.account]);

  useEffect(() => {
    switch (languageContext.language.TYPE) {
      case "vi": //vn
        setListItem(ListItemVietnamese);
        break;
      case "en": //en
        setListItem(ListItemEnglish);
        break;
      case "ja": //ja
        setListItem(ListItemJapanese);
        break;
    }

    //save language into storage
    SAsyncStorage.setData(AsyncStorageKeys.LANGUAGE, languageContext.language.TYPE + "");
  }, [languageContext.language]);

  useEffect(() => {
    let isAdmin = false;

    //is super admin
    isAdmin = isAdmin || (accountContext.account?.roles?.map(role => role.id).includes(RoleList.SUPER_ADMIN) ?? false);
    isAdmin = isAdmin || (accountContext.account?.roles?.map(role => role.id).includes(RoleList.ADMIN) ?? false);

    setIsAdmin(isAdmin);
  }, []);

  //tsx
  return (
    <>
      {!isAdmin && <QRInfo id={accountContext.account?.id ?? ""} type={QRItems.USER}/>}
      <BackWithDetailLayout icName="Back">
        <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
          {ListItem.map((item, index) => (
            <FlatListItem item={item} index={index} key={item.title}/>
          ))}
        </ScrollView>
        <View style={{marginBottom: 50}}/>
      </BackWithDetailLayout>
    </>
  );
}

const action = StyleSheet.create({
  action: {
    flexDirection: "row",
    margin: 10,
    gap: 10,
  },
  item: {
    fontSize: 13,
    fontWeight: "bold",
    alignSelf: "center",
  },

  scrollToBottomButtonContainer: {
    position: "absolute",
    top: -40,
    left: 0,
    right: 0,
  },

  scrollToBottomButton: {
    backgroundColor: BackgroundColor.sub_primary,
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: TextColor.white,
    alignSelf: "center",
  },
});