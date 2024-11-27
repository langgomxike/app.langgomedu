import {TabItem} from "../Tab";
import {ElementRef, useCallback, useContext, useEffect, useRef, useState} from "react";
import {LanguageContext} from "../../../configs/LanguageConfig";
import {AccountContext} from "../../../configs/AccountConfig";
import {NavigationRouteContext, useFocusEffect} from "@react-navigation/native";
import Message from "../../../models/Message";
import Toast from "react-native-simple-toast";
import AMessage from "../../../apis/AMessage";
import SFirebase, {FirebaseNode} from "../../../services/SFirebase";
import SAsyncStorage, {AsyncStorageKeys} from "../../../services/SAsyncStorage";
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import {BackgroundColor, TextColor} from "../../../configs/ColorConfig";
import NotificationItem from "../NotificationItem";
import {SearchContext} from "../../screens/Chat";

const notificationTab: TabItem = {
  title: "Notifications",
  view: () => {
    //contexts
    const searchContext = useContext(SearchContext);
    const language = useContext(LanguageContext).language;
    const accountContext = useContext(AccountContext);
    const route = useContext(NavigationRouteContext);

    //refs

    //states
    const [notis, setNotis] = useState<Array<Message>>([]);
    const [loading, setLoading] = useState(false);

    //handlers
    const handleFilter = useCallback(
      (noti: Message) => {
        return (
          noti.content
            ?.toLowerCase()
            ?.includes(searchContext?.toLowerCase()) ||
          searchContext
            ?.toLowerCase()
            ?.includes(noti.content?.toLowerCase())
        );
      },
      [searchContext]
    );

    //effects
    useEffect(() => {
      SFirebase.track(FirebaseNode.Notifications, [{
        key: FirebaseNode.UserId,
        value: accountContext.account?.id ?? "-1"
      }], () => {
        AMessage.getNotificationsOfUser((notis: Message[]) => {
          setNotis(notis);

          notis.length > 0 && SAsyncStorage.setData(AsyncStorageKeys.NEWEST_NOTIFICATION_ID, notis[0].id + "");
        });
      });
    }, [accountContext.account]);

    useFocusEffect(useCallback(() => {
      notis.length > 0 && AMessage.markAsReadNotifications(() => {
      });
    }, [notis.length]));

    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Spinner visible={loading}/>

        <Text style={{fontSize: 10, color: TextColor.danger, marginVertical: 10,}}>*Long press to delete</Text>
        {notis.filter(handleFilter).map((noti) => (
          <NotificationItem key={noti.id} id={noti.id} content={noti.content} createdAt={noti.created_at}/>
        ))}

        {notis.length < 1 && (
          <Text style={{flex: 1, alignSelf: "center"}}>Danh sach trong</Text>
        )}

        <View style={{height: 70}}/>
      </ScrollView>
    );
  }
}

export default notificationTab;

const action = StyleSheet.create({
  action: {
    flex: 1,
    flexDirection: "row",
    margin: 10,
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  item: {
    fontSize: 13,
    fontWeight: "bold",
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
