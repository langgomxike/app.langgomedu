import {Image, ScrollView, StyleSheet, Text, View} from "react-native";
import SearchBar from "../components/Inputs/SearchBar";
import {createContext, useCallback, useContext, useEffect, useState,} from "react";
import Tab, {TabItem} from "../components/Tab";
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";
import notificationTab from "../components/message/NotificationTab";
import contactTab from "../components/message/ContactTab";
import messageTab from "../components/message/ChatTab";
import classChatTab from "../components/message/ClassChatTab";
import {ChatTabContext} from "../components/ButtonNavBar";

const APP_NAME = "Langgom";
const HEADER_IMAGE = require("../../../assets/icons/ic_chatbox.png");
const HEADER_TEXT_SIZE = 25;
const SCREEN_BORDER_HORIZONTAL = 20;
const SCREEN_ITEM_GAP = 0;

export const SearchContext = createContext("");

const tabs: TabItem[] = [];

tabs.push(notificationTab);
tabs.push(classChatTab);
tabs.push(messageTab);
tabs.push(contactTab);

export default function ChatScreen() {
  //contexts
  const chatTabContext = useContext(ChatTabContext);

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
        <Tab defaultActiveTab={0} tabs={tabs} quantities={chatTabContext}/>
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
