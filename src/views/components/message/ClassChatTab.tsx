import {TabItem} from "../Tab";
import {useCallback, useContext, useEffect, useState} from "react";
import {NavigationContext} from "@react-navigation/native";
import {AccountContext} from "../../../configs/AccountConfig";
import Inbox from "../../../models/Inbox";
import User from "../../../models/User";
import {
  GroupMessageNavigationType,
  IdNavigationType,
  MessageNavigationType
} from "../../../configs/NavigationRouteTypeConfig";
import ScreenName from "../../../constants/ScreenName";
import SFirebase, {FirebaseNode} from "../../../services/SFirebase";
import AMessage from "../../../apis/AMessage";
import {ScrollView, Text, View} from "react-native";
import ChatMessageItem from "../ChatMessageItem";
import {SearchContext} from "../../screens/Chat";
import ClassChatMessageItem from "../ClassChatMessageItem";
import ClassInbox from "../../../models/ClassInbox";
import Class from "../../../models/Class";

const classChatTab: TabItem = {
  title: "Group Chat",
  view: () => {
    //contexts
    const searchContext = useContext(SearchContext);
    const navigation = useContext(NavigationContext);
    const accountContext = useContext(AccountContext);

    //states
    const [chatMessages, setChatMessages] = useState<Array<ClassInbox>>([]);

    //handlers
    const handleFilter = useCallback(
      (chat: ClassInbox) => {
        return (
          chat.in_class?.title
            ?.toLowerCase()
            ?.includes(searchContext?.toLowerCase()) ||
          searchContext
            ?.toLowerCase()
            ?.includes((chat.in_class?.title ?? "")?.toLowerCase())
        );
      },
      [searchContext]
    );

    const handleGoToMessage = useCallback((_class: Class | undefined) => {
      const data: GroupMessageNavigationType = {
        class: _class
      };
      navigation?.navigate(ScreenName.GROUP_MESSAGE, data);
    }, []);

    // effects
    useEffect(() => {
      SFirebase.track(FirebaseNode.Messages, [], () => {
        AMessage.getClassChatsOfUser((chats: ClassInbox[]) => {
          setChatMessages(chats);
        });
      });
    }, []);

    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {chatMessages.filter(handleFilter).map((chat, index) => (
          <ClassChatMessageItem
            key={index}
            chat={chat}
            onPress={() => handleGoToMessage(chat.in_class)}
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

export default classChatTab;