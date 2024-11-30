import {TabItem} from "../Tab";
import {useCallback, useContext, useEffect, useState} from "react";
import {NavigationContext} from "@react-navigation/native";
import {AccountContext} from "../../../configs/AccountConfig";
import Inbox from "../../../models/Inbox";
import User from "../../../models/User";
import {MessageNavigationType} from "../../../configs/NavigationRouteTypeConfig";
import ScreenName from "../../../constants/ScreenName";
import SFirebase, {FirebaseNode} from "../../../services/SFirebase";
import AMessage from "../../../apis/AMessage";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import ChatMessageItem from "../ChatMessageItem";
import SLog, {LogType} from "../../../services/SLog";
import {LanguageContext} from "../../../configs/LanguageConfig";
import CustomShimmer from "../skeleton/CustomShimmer";
import {SearchContext} from "../../../configs/AppContext";

const fakeChats: number[] = [];

for (let i = 0; i < 10; i++) {
  fakeChats.push(i);
}

const messageTab: TabItem = {
  title: "Chat",
  view: () => {
    //contexts
    const searchContext = useContext(SearchContext);
    const navigation = useContext(NavigationContext);
    const accountContext = useContext(AccountContext);
    const language = useContext(LanguageContext).language;

    //states
    const [chatMessages, setChatMessages] = useState<Array<Inbox>>([]);
    const [loading, setLoading] = useState(false);

    //handlers
    const handleFilter = useCallback(
      (chat: Inbox) => {
        return (
          chat.other_user_info?.full_name
            ?.toLowerCase()
            ?.includes(searchContext?.toLowerCase()) ||
          searchContext
            ?.toLowerCase()
            ?.includes((chat.other_user_info?.full_name ?? "")?.toLowerCase())
        );
      },
      [searchContext]
    );

    const handleGoToMessage = useCallback((user: User | undefined, fromUserId: string, toUserId: string) => {
      if (user) {
        const data: MessageNavigationType = {
          user,
        };
        navigation?.navigate(ScreenName.MESSAGE, data);
      }
    }, [accountContext.account]);

    // effects
    useEffect(() => {
      SFirebase.track(FirebaseNode.Messages, [], () => {
        setLoading(true);
        AMessage.getChatsOfUser((chats: Inbox[]) => {
          setChatMessages(chats);
          setLoading(false);
          SLog.log(LogType.Info, "track messages", "chats", chats.length);
        });
      });
    }, []);

    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {chatMessages.filter(handleFilter).map((chat, index) => (
          <ChatMessageItem
            key={index + (chat.newest_message?.as_read ? "-" : "")}
            chat={chat}
            onPress={() => handleGoToMessage(chat?.other_user_info, chat.newest_message?.sender?.id ?? "", chat.newest_message?.receiver?.id ?? "")}
          />
        ))}

        {loading && chatMessages.length < 1 && (
          fakeChats.map(i => (
            <CustomShimmer key={i} height={65} style={styles.item}/>
          ))
        )}

        {!loading && chatMessages.length < 1 && (
          <Text style={{flex: 1, alignSelf: "center", marginTop: 20}}>{language.EMPTY_LIST}</Text>
        )}

        <View style={{height: 70}}/>
      </ScrollView>
    );
  },
};

export default messageTab;

const styles = StyleSheet.create({
  item: {
    flex: 1,
    marginVertical: 5,
    borderRadius: 10,
    minHeight: 70,
    width: "100%"
  }
});