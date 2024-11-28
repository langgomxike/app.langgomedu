import {TabItem} from "../Tab";
import React, {ElementRef, useCallback, useContext, useEffect, useRef, useState} from "react";
import {LanguageContext} from "../../../configs/LanguageConfig";
import {AccountContext} from "../../../configs/AccountConfig";
import {useFocusEffect} from "@react-navigation/native";
import Message from "../../../models/Message";
import AMessage from "../../../apis/AMessage";
import SFirebase, {FirebaseNode} from "../../../services/SFirebase";
import SAsyncStorage, {AsyncStorageKeys} from "../../../services/SAsyncStorage";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {BackgroundColor, TextColor} from "../../../configs/ColorConfig";
import NotificationItem from "../NotificationItem";
import CustomShimmer from "../skeleton/CustomShimmer";
import {SearchContext} from "../../../configs/AppContext";

const fakeNotis: number[] = [];

for (let i = 0; i < 10; i++) {
  fakeNotis.push(i);
}

const notificationTab: TabItem = {
  title: "Notifications",
  view: () => {
    //contexts
    const searchContext = useContext(SearchContext);
    const language = useContext(LanguageContext).language;
    const accountContext = useContext(AccountContext);

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
        setLoading(true);
        AMessage.getNotificationsOfUser((notis: Message[]) => {
          setNotis(notis);
          setLoading(false);

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
        <Text
          style={{fontSize: 10, color: TextColor.danger, marginVertical: 10,}}>*{language.LONG_PRESS_TO_DELETE}</Text>
        {notis.filter(handleFilter).map((noti) => (
          <NotificationItem key={noti.id} id={noti.id} content={noti.content} createdAt={noti.created_at}/>
        ))}

        {loading && notis.length < 1 && (
          fakeNotis.map(i => (
            <CustomShimmer key={i} height={70} style={styles.item}/>
          ))
        )}

        {!loading && notis.length < 1 && (
          <Text style={{flex: 1, alignSelf: "center"}}>{language.EMPTY_LIST}</Text>
        )}

        <View style={{height: 70}}/>
      </ScrollView>
    );
  }
}

export default notificationTab;

const styles = StyleSheet.create({
  item: {
    flex: 1,
    marginVertical: 5,
    borderRadius: 10,
    minHeight: 70,
    width: "100%"
  }
});