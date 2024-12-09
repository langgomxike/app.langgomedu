import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";
import DateTimeConfig from "../../configs/DateTimeConfig";
import ClassInbox from "../../models/ClassInbox";
import {useContext} from "react";
import {AccountContext} from "../../configs/AccountConfig";
import SLog, {LogType} from "../../services/SLog";
import {LanguageContext} from "../../configs/LanguageConfig";
import ReactAppUrl from "../../configs/ConfigUrl";

const AVATAR_SIZE = 60;
const BADGE_SIZE = 10;

export type ClassChatMessageItem = {
  chat: ClassInbox;
  onPress: () => void;
};

export default function ClassChatMessageItem(
  {
    chat,
    onPress = () => {
    },
  }: ClassChatMessageItem) {
  //states
  const accountContext = useContext(AccountContext);
  const language = useContext(LanguageContext).language;

  let content = chat?.newest_message?.content;

  if (content?.includes("$image:")) {
    content = `[${language.IMAGE}]`;
  }

  SLog.log(LogType.Warning, "check class chat item", "", chat);

  const asRead = chat.newest_message?.sender?.id === accountContext.account?.id || chat?.newest_message?.as_read;

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {/* avatar */}
      <Image src={ReactAppUrl.PUBLIC_URL + chat.in_class?.major?.icon} style={styles.avatar}/>


      {/* text container */}
      <View style={styles.textContainer}>
        {/* name */}
        <Text style={styles.name}>{chat.in_class?.title}</Text>

        {/* new message */}
        <Text style={styles.message}>{content?.substring(0,20)}...</Text>
      </View>

      {/* time */}
      {chat.newest_message?.created_at && <Text style={styles.time}>
        {DateTimeConfig.getDateFormat(
          +(chat.newest_message?.created_at ?? 0),
          true,
          true
        )}
      </Text>}

      {/* badge */}
      {(chat.newest_message?.id ?? -1) > 0 && <View
        style={[
          styles.badge,
          asRead && {
            backgroundColor: BackgroundColor.white,
          },
        ]}
      />
      }
    </TouchableOpacity>
  )
    ;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    marginRight: 10,
    marginBottom: 10,
    paddingTop: 10,
  },

  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: BackgroundColor.white,
    borderWidth: 1,
    borderColor: BackgroundColor.sub_primary,
    alignSelf: "center",
  },

  textContainer: {
    flex: 1,
    gap: 5,
    alignSelf: "center",
  },

  name: {
    fontSize: 13,
    fontWeight: "500",
  },

  message: {
    fontSize: 12,
    color: TextColor.hint,
  },

  time: {
    fontSize: 12,
    color: TextColor.hint,
    alignSelf: "center",
  },

  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    backgroundColor: BackgroundColor.primary,
    alignSelf: "center",
  },
});
