import {TabItem} from "../Tab";
import {useCallback, useContext, useEffect, useState} from "react";
import {NavigationContext} from "@react-navigation/native";
import {AccountContext} from "../../../configs/AccountConfig";
import {
  GroupMessageNavigationType,
} from "../../../configs/NavigationRouteTypeConfig";
import ScreenName from "../../../constants/ScreenName";
import SFirebase, {FirebaseNode} from "../../../services/SFirebase";
import AMessage from "../../../apis/AMessage";
import {Image, ScrollView, StyleSheet, Text, View} from "react-native";
import ClassChatMessageItem from "../ClassChatMessageItem";
import ClassInbox from "../../../models/ClassInbox";
import Class from "../../../models/Class";
import {LanguageContext} from "../../../configs/LanguageConfig";
import CustomShimmer from "../skeleton/CustomShimmer";
import {SearchContext} from "../../../configs/AppContext";

const fakeChats: number[] = [];

for (let i = 0; i < 10; i++) {
  fakeChats.push(i);
}

const classChatTab: TabItem = {
  view: () => {
    //contexts
    const searchContext = useContext(SearchContext);
    const navigation = useContext(NavigationContext);
    const language = useContext(LanguageContext).language;

    //states
    const [chatMessages, setChatMessages] = useState<Array<ClassInbox>>([]);
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        AMessage.getClassChatsOfUser((chats: ClassInbox[]) => {
          setChatMessages(chats);
          setLoading(false);
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

        {loading && chatMessages.length < 1 && (
          fakeChats.map(i => (
            <View key={i} style={{flexDirection: "row", gap: 10}}>
              <CustomShimmer height={60} style={styles.avatar}/>

              <CustomShimmer height={60} style={styles.item}/>
            </View>
          ))
        )}

        {!loading && chatMessages.length < 1 && (
          <>
            <Image
              source={require("../../../../assets/images/ic_empty.png")}
              style={[styles.emptyImage]}
            />

            <Text style={{flex: 1, alignSelf: "center"}}>{language.EMPTY_LIST}</Text>
          </>
        )}

        <View style={{height: 70}}/>
      </ScrollView>
    );
  },
};

export default classChatTab;

const styles = StyleSheet.create({
  item: {
    flex: 1,
    marginVertical: 5,
    borderRadius: 10,
    minHeight: 60,
    width: "100%"
  },

  emptyImage: {
    width: 200,
    height: 200,
    backgroundColor: "#fff",
    alignSelf: "center",
    margin: 15,
  },

  avatar: {
    marginVertical: 10,
    borderRadius: 100,
    minHeight: 60,
    width: 60,
    height: 60,
  }
});