import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Message from "../../models/Message";
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
  let content = (
    <Text style={[styles.content, ofMine && styles.ofMine]}>
      {message.content}
    </Text>
  );

  // main content
  if (message.file) {
    if (message.is_image) {
      content = (
        <Image
          src={message.file.path}
          style={[
            {
              width: message.file.image_width || 280,
              height: message.file.image_height || 280,
              borderRadius: 5,
            },
            ofMine && styles.ofMine,
            {
              alignSelf: "center",
            },
          ]}
        />
      );
    } else {
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
    }
  }

  // reply content
  let replyContent = (
    <Text style={{ color: "#AAA" }}>{message.reply_to_message?.content}</Text>
  );

  if (message.reply_to_message?.file) {
    if (message.reply_to_message?.is_image) {
      replyContent = (
        <Text style={{ color: "#AAA", textDecorationLine: "underline" }}>
          {"Image"}
        </Text>
      );
    } else {
      replyContent = (
        <Text style={{ color: "#AAA", textDecorationLine: "underline" }}>
          {message.reply_to_message.file.name}
        </Text>
      );
    }
  }

  //check main content active or not
  //mine  1, from user 0
  //mine 0, to user 0
  if ((ofMine && !message.from_user_status) || (!ofMine && !message.to_user)) {
    content = (
      <Text
        style={[
          styles.content,
          ofMine && styles.ofMine,
          { textDecorationLine: "underline line-through" },
        ]}
      >
        Tin nhan da go
      </Text>
    );
  }

  //check reply content active or not
  if (
    (ofMine && !message.reply_to_message?.from_user_status) ||
    (!ofMine && !message.reply_to_message?.to_user)
  ) {
    replyContent = (
      <Text
        style={[
          styles.content,
          ofMine && styles.ofMine,
          { textDecorationLine: "underline line-through" },
        ]}
      >
        Tin nhan da go
      </Text>
    );
  }

  return (
    <>
      {/* reply message */}
      {message.reply_to_message && (
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
          message.reply_to_message && styles.hasReply,
          message.reply_to_message && ofMine && styles.hasReplyOfMine,
        ]}
      >
        {content}
        <Text style={[styles.time, !ofMine && styles.ofMine]}>
          {DateTimeConfig.getDateFormat(message.created_at, true, true)}
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

  deleted: {
    backgroundColor: BackgroundColor.sub_primary,
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
