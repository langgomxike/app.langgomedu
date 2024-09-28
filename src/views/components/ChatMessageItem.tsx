import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Chat from "../../models/Chat";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";
import { MessageType } from "../../models/Message";
import DateTimeConfig from "../../configs/DateTimeConfig";

const AVATAR_SIZE = 60;
const BADGE_SIZE = 10;

export type ChatMessageItemProps = {
  chat: Chat;
  onPress: () => void;
};

export default function ChatMessageItem({
  chat,
  onPress = () => {},
}: ChatMessageItemProps) {
  let content;

  switch (chat.newestMessage?.messageType) {
    case MessageType.TEXT:
      content = chat.newestMessage.content;
      break;

    case MessageType.FILE:
      content = "[file]";
      break;

    case MessageType.IMAGE:
      content = "[image]";
      break;
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {/* avatar */}
      {chat.user?.avatar ? (
        <Image src={chat.user.avatar} style={styles.avatar} />
      ) : (
        <Image
          source={require("../../../assets/avatar/avatarTempt.png")}
          style={styles.avatar}
        />
      )}

      {/* text container */}
      <View style={styles.textContainer}>
        {/* name */}
        <Text style={styles.name}>{chat.user.fullName}</Text>

        {/* new message */}
        <Text style={styles.message}>{content}</Text>
      </View>

      {/* time */}
      <Text style={styles.time}>
        {DateTimeConfig.getDateFormat(
          +(chat.newestMessage?.createdAt ?? 0),
          true,
          true
        )}
      </Text>

      {/* badge */}
      <View
        style={[
          styles.badge,
          !chat?.newestMessage?.toUserAsRead && {
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
    backgroundColor: BackgroundColor.sub_primary,
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
