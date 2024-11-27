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
import {ScrollView, Text, View} from "react-native";
import ChatMessageItem from "../ChatMessageItem";
import {SearchContext} from "../../screens/Chat";
import SLog, {LogType} from "../../../services/SLog";

const messageTab: TabItem = {
  title: "Chat",
  view: () => {
    //contexts
    const searchContext = useContext(SearchContext);
    const navigation = useContext(NavigationContext);
    const accountContext = useContext(AccountContext);

    //states
    const [chatMessages, setChatMessages] = useState<Array<Inbox>>([]);

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
          me: accountContext.account,
          user,
          from_user: fromUserId,
          to_user: toUserId
        };
        navigation?.navigate(ScreenName.MESSAGE, data);
      }
    }, [accountContext.account]);

    // effects
    useEffect(() => {
      SFirebase.track(FirebaseNode.Messages, [], () => {
        AMessage.getChatsOfUser((chats: Inbox[]) => {
          setChatMessages(chats);

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

        {chatMessages.length < 1 && (
          <Text style={{flex: 1, alignSelf: "center", marginTop: 20}}>Danh sach trong</Text>
        )}

        <View style={{height: 70}}/>
      </ScrollView>
    );
  },
};

export default messageTab;