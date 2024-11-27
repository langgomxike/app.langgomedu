import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Chat from "../../models/Chat";
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";
import DateTimeConfig from "../../configs/DateTimeConfig";
import Inbox from "../../models/Inbox";
import {useContext} from "react";
import {AccountContext} from "../../configs/AccountConfig";
import {LanguageContext} from "../../configs/LanguageConfig";
import ReactAppUrl from "../../configs/ConfigUrl";

const AVATAR_SIZE = 60;
const BADGE_SIZE = 10;

export type ChatMessageItemProps = {
  chat: Inbox;
  onPress: () => void;
};

export default function ChatMessageItem({
                                          chat,
                                          onPress = () => {
                                          },
                                        }: ChatMessageItemProps) {
  //contexts
  const accountContext = useContext(AccountContext);
  const language = useContext(LanguageContext).language;

  let content = chat?.newest_message?.content;

  if (content?.includes("$image:")) {
    content = `[${language.IMAGE}]`;
  }

  const asRead = chat.newest_message?.sender?.id === accountContext.account?.id || chat?.newest_message?.as_read;

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {/* avatar */}
      <Image src={ReactAppUrl.PUBLIC_URL + chat.other_user_info?.avatar} style={styles.avatar}/>

      {/* text container */}
      <View style={styles.textContainer}>
        {/* name */}
        <Text style={styles.name}>{chat.other_user_info?.full_name}</Text>

        {/* new message */}
        <Text style={styles.message}>{content}</Text>
      </View>

      {/* time */}
      <Text style={styles.time}>
        {DateTimeConfig.getDateFormat(
          +(chat.newest_message?.created_at ?? 0),
          true,
          true
        )}
      </Text>

      {/*badge */}
      <View
        style={[
          styles.badge,
          asRead && {
            backgroundColor: BackgroundColor.white,
          },
        ]}
      />
    </TouchableOpacity>
  );
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
