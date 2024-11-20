import {Image, ScrollView, StyleSheet} from "react-native";
import {Text, View} from "react-native";
import SearchBar from "../components/Inputs/SearchBar";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import Tab, {TabItem} from "../components/Tab";
import ChatMessageItem from "../components/ChatMessageItem";
import Chat from "../../models/Chat";
import ChatContactItem from "../components/ChatContactItem";
import User from "../../models/User";
import {NavigationContext} from "@react-navigation/native";
import ScreenName from "../../constants/ScreenName";
import AMessage from "../../apis/AMessage";
import {IdNavigationType, MessageNavigationType} from "../../configs/NavigationRouteTypeConfig";
import {BackgroundColor} from "../../configs/ColorConfig";
import SFirebase from "../../services/SFirebase";
import {AccountContext} from "../../configs/AccountConfig";

const APP_NAME = "Langgom";
const HEADER_IMAGE = require("../../../assets/icons/ic_chatbox.png");
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
        const accountContext = useContext(AccountContext);

        //states
        const [chatMessages, setChatMessages] = useState<Array<Chat>>([]);

        //handlers
        const handleFilter = useCallback(
            (chat: Chat) => {
                return (
                    chat.user?.full_name
                        ?.toLowerCase()
                        ?.includes(searchContext?.toLowerCase()) ||
                    searchContext
                        ?.toLowerCase()
                        ?.includes((chat.user?.full_name ?? "")?.toLowerCase())
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
            SFirebase.trackMyMessages(accountContext.account?.id ?? "", () => {
                AMessage.getChatsOfUser((chats: Chat[]) => {
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
                    <ChatMessageItem
                        key={index}
                        chat={chat}
                        onPress={() => handleGoToMessage(chat?.user, chat.message?.from_user?.id ?? "", chat.message?.to_user?.id ?? "")}
                    />
                ))}

                <View style={{height: 70}}/>
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
                return (
                    contact.full_name
                        ?.toLowerCase()
                        ?.includes(searchContext?.toLowerCase()) ||
                    contact?.email?.toLowerCase()?.includes(searchContext?.toLowerCase()) ||
                    contact?.phone_number
                        ?.toLowerCase()
                        ?.includes(searchContext?.toLowerCase()) ||
                    searchContext
                        ?.toLowerCase()
                        ?.includes(contact.full_name?.toLowerCase()) ||
                    searchContext?.toLowerCase()?.includes(contact?.email?.toLowerCase()) ||
                    searchContext
                        ?.toLowerCase()
                        ?.includes(contact?.phone_number?.toLowerCase())
                );
            },
            [searchContext]
        );

        const handleGoToProfile = useCallback(() => {
            navigation?.navigate(ScreenName.PROFILE);
        }, []);

        //effects
        useEffect(() => {
            AMessage.getContactsOfUser((contacts: User[]) => {
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

                <View style={{height: 70}}/>
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
                    <Image style={styles.headerImage} source={HEADER_IMAGE}/>

                    <Text style={styles.headerText}>
                        {APP_NAME}
                        {"Chat"}
                    </Text>
                </View>

                {/* search bar */}
                <SearchBar
                    value={keyword}
                    onChangeText={setKeyword}
                    style={{marginTop: 30, marginBottom: 5}}
                />

                {/* tabs */}
                <Tab defaultActiveTab={0} tabs={tabs}/>
            </View>
        </SearchContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BackgroundColor.white,
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
