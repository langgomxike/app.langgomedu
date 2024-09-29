import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Message, { MessageType } from "../../models/Message";
import DateTimeConfig from "../../configs/DateTimeConfig";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";

type MessageItemProps = {
  message: Message;
  ofMine: boolean;
  onReplyPress?: () => void;
};

export default function MessageItem({
  message,
  ofMine = false,
  onReplyPress = () => {},
}: MessageItemProps) {
  let content;
  let replyContent;

  switch (message.messageType) {
    case MessageType.TEXT:
      content = (
        <Text style={[styles.content, ofMine && styles.ofMine]}>
          {message.content}
        </Text>
      );
      break;

    case MessageType.IMAGE:
      content = (
        <Image
          src={message.file.path}
          style={[
            {
              width: message.file.imageWith || 280,
              height: message.file.imageHeight || 280,
              borderRadius: 5,
            },
            ofMine && styles.ofMine,
            {
              alignSelf: "center",
            },
          ]}
        />
      );
      break;

    case MessageType.FILE:
      content = (
        <Text
          style={[
            styles.content,
            ofMine && styles.ofMine,
            { textDecorationLine: "underline" },
          ]}
        >
          {message.file.name}
        </Text>
      );

      break;
  }

  switch (message.replyToMessage?.messageType) {
    case MessageType.TEXT:
      replyContent = (
        <Text style={{ color: "#AAA" }}>{message.replyToMessage.content}</Text>
      );
      break;

    case MessageType.IMAGE:
      replyContent = (
        <Text style={{ color: "#AAA", textDecorationLine: "underline" }}>
          {"Image"}
        </Text>
      );
      break;
    case MessageType.FILE:
      replyContent = (
        <Text style={{ color: "#AAA", textDecorationLine: "underline" }}>
          {message.replyToMessage.file.name}
        </Text>
      );
      break;
  }

  return (
    <>
      {/* reply message */}
      {message.replyToMessage && (
        <TouchableOpacity
          onPress={onReplyPress}
          style={[styles.replyToContainer, ofMine && styles.ofMine]}
        >
          {replyContent}
        </TouchableOpacity>
      )}

      {/* main message */}
      <View
        style={[
          styles.container,
          ofMine && styles.ofMine,
          message.replyToMessage && styles.hasReply,
          message.replyToMessage && ofMine && styles.hasReplyOfMine,
        ]}
      >
        {content}
        <Text style={[styles.time, !ofMine && styles.ofMine]}>
          {DateTimeConfig.getDateFormat(message.createdAt, true, true)}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 300,
    minWidth: 150,
    backgroundColor: BackgroundColor.primary,
    marginBottom: 10,
    borderRadius: 10,
    gap: 5,
    alignSelf: "flex-start",
  },

  hasReply: {
    borderTopLeftRadius: 0,
  },

  hasReplyOfMine: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
  },

  content: {
    color: TextColor.white,
    padding: 10,
    paddingBottom: 0,
  },

  ofMine: {
    alignSelf: "flex-end",
  },

  time: {
    fontSize: 10,
    color: TextColor.white,
    padding: 10,
    paddingTop: 0,
  },

  replyToContainer: {
    maxWidth: 150,
    minWidth: 100,
    padding: 10,
    backgroundColor: BackgroundColor.gray_10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    gap: 5,
    alignSelf: "flex-start",
  },
});
