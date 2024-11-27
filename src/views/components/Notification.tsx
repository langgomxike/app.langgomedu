import {Modal, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {BackgroundColor} from "../../configs/ColorConfig";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {NavigationContext} from "@react-navigation/native";
import {LanguageContext} from "../../configs/LanguageConfig";
import ScreenName from "../../constants/ScreenName";
import SFirebase, {FirebaseNode} from "../../services/SFirebase";
import AMessage from "../../apis/AMessage";
import Message from "../../models/Message";
import {AccountContext} from "../../configs/AccountConfig";
import SAsyncStorage, {AsyncStorageKeys} from "../../services/SAsyncStorage";
import {navigationRef} from "../../../App";

const AVATAR_SIZE = 50;
export default function Notification() {
  //contexts
  const navigation = useContext(NavigationContext);
  const language = useContext(LanguageContext).language;
  const accountContext = useContext(AccountContext);

  //states
  const [content, setContent] = useState("");

  //handlers
  const openNotification = useCallback(() => {
    setContent("");
    const data = {
      tab: 0,
    }
    navigationRef?.current?.navigate(ScreenName.CHAT, data);
  }, [navigation]);

  //effects
  useEffect(() => {
    SFirebase.track(FirebaseNode.Notifications, [{
      key: FirebaseNode.UserId,
      value: accountContext.account?.id ?? "-1"
    }], () => {
      AMessage.getNotificationsOfUser((notis: Message[]) => {

        const newestNotification = notis.length > 0 ? notis[0] : undefined;

        if (!newestNotification) return;

        SAsyncStorage.getData(AsyncStorageKeys.NEWEST_NOTIFICATION_ID, (value) => {
          if (+value >= newestNotification.id) return;

          SAsyncStorage.setData(AsyncStorageKeys.NEWEST_NOTIFICATION_ID, newestNotification.id + "", () => {
            setContent(newestNotification.content);
          });
        });
      });
    });
  }, [accountContext.account]);

  useEffect(() => {
    const timeId = setTimeout(() => {
      setContent(" ");
    }, 5000);

    return ()=> {
      clearTimeout(timeId);
    }
  }, [content]);

  return (
    <View style={[styles.container, !(content.length > 0) && {zIndex: -1, width: 0, height: 0}]}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={content.length > 0}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.contentContainer} onPress={openNotification}>
            <Text style={styles.title}>{"You have a new notification"}</Text>
            <Text style={styles.message}>{content.substring(0, 100)}...</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    position: "absolute",
    zIndex: 100,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentContainer: {
    padding: 20,
    margin: 4,
    backgroundColor: BackgroundColor.white,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Tạo hiệu ứng nổi (Android)
  },

  title: {
    fontSize: 12,
    fontWeight: "bold",
  },

  message: {
    fontSize: 14,
    textAlign: 'center',
  },
})