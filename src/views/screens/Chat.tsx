import { Image, ScrollView, StyleSheet } from "react-native";
import { Text, View } from "react-native";
import SearchBar from "../components/Inputs/SearchBar";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Tab, { TabItem } from "../components/Tab";
import ChatMessageItem from "../components/ChatMessageItem";
import Chat from "../../models/Chat";
import ChatContactItem from "../components/ChatContactItem";
import User from "../../models/User";
import { NavigationContext } from "@react-navigation/native";
import ScreenName from "../../constants/ScreenName";
import AMessage from "../../apis/AMessage";
import { IdNavigationType } from "../../configs/NavigationRouteTypeConfig";

const APP_NAME = "Langgom";
const HEADER_IMAGE = require("../../../assets/icons/ic-chatbox.png");
const HEADER_TEXT_SIZE = 25;
const SCREEN_BORDER_HORIZONTAL = 20;
const SCREEN_ITEM_GAP = 0;

const SearchContext = createContext("");

const tabs: TabItem[] = [];

const messageTab: TabItem = {
  title: "Message",
  view: () => {
    //contexts
    const searchContext = useContext(SearchContext);
    const navigation = useContext(NavigationContext);

    //states
    const [chatMessages, setChatMessages] = useState<Array<Chat>>([]);

    //handlers
    const handleFilter = useCallback(
      (chat: Chat) => {
        return !!(
          chat.user.fullName
            .toLowerCase()
            .includes(searchContext.toLowerCase()) ||
          searchContext.toLowerCase().includes(chat.user.fullName.toLowerCase())
        );
      },
      [searchContext]
    );

    const handleGoToMessage = useCallback((userId: number) => {
      const data: IdNavigationType = { id: userId };
      navigation?.navigate(ScreenName.MESSAGE, data);
    }, []);

    //effects
    useEffect(() => {
      AMessage.getChatsOfUser(-1, (chats: Chat[]) => {
        setChatMessages(chats);
      });
    }, []);

    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {chatMessages.filter(handleFilter).map((chat) => (
          <ChatMessageItem
            key={chat.user.id}
            chat={chat}
            onPress={() => handleGoToMessage(chat.user.id)}
          />
        ))}
      </ScrollView>
    );
  },
};

const contactTab: TabItem = {
  title: "Contact",
  view: () => {
    //contexts
    const searchContext = useContext(SearchContext);
    const navigation = useContext(NavigationContext);

    //states
    const [contacts, setContacts] = useState<Array<User>>([]);

    //handlers
    const handleFilter = useCallback(
      (contact: User) => {
        return !!(
          contact.fullName
            .toLowerCase()
            .includes(searchContext.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchContext.toLowerCase()) ||
          contact.phoneNumber
            .toLowerCase()
            .includes(searchContext.toLowerCase()) ||
          searchContext
            .toLowerCase()
            .includes(contact.fullName.toLowerCase()) ||
          searchContext.toLowerCase().includes(contact.email.toLowerCase()) ||
          searchContext
            .toLowerCase()
            .includes(contact.phoneNumber.toLowerCase())
        );
      },
      [searchContext]
    );

    const handleGoToProfile = useCallback(() => {
      navigation?.navigate(ScreenName.PROFILE);
    }, []);

    //effects
    useEffect(() => {
      AMessage.getContactsOfUser(-1, (contacts: User[]) => {
        setContacts(contacts);
      });
    }, []);

    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {contacts.filter(handleFilter).map((contact) => (
          <ChatContactItem
            key={contact.id}
            user={contact}
            onPress={handleGoToProfile}
          />
        ))}
      </ScrollView>
    );
  },
};

tabs.push(messageTab);
tabs.push(contactTab);

export default function ChatScreen() {
  //states
  const [keyword, setKeyword] = useState("");

  return (
    <SearchContext.Provider value={keyword}>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.headerContainer}>
          <Image style={styles.headerImage} source={HEADER_IMAGE} />

          <Text style={styles.headerText}>
            {APP_NAME}
            {"Chat"}
          </Text>
        </View>

        {/* search bar */}
        <SearchBar
          value={keyword}
          onChangeText={(value) => setKeyword(value)}
          style={{ marginTop: 30, marginBottom: 5 }}
        />

        {/* tabs */}
        <Tab defaultActiveTab={0} tabs={tabs} />
      </View>
    </SearchContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: SCREEN_BORDER_HORIZONTAL,
    gap: SCREEN_ITEM_GAP,
  },

  headerContainer: {
    flexDirection: "row",
    gap: 10,
  },

  headerImage: {
    width: 100,
    height: 100,
  },

  headerText: {
    textAlignVertical: "bottom",
    fontSize: HEADER_TEXT_SIZE,
    fontWeight: "bold",
  },
});
