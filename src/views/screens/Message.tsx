import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BackgroundColor } from "../../configs/ColorConfig";
import { useCallback, useEffect, useState } from "react";
import Message, { MessageType } from "../../models/Message";
import AMessage from "../../apis/AMessage";
import MessageItem from "../components/MessageItem";
import MyIcon, { AppIcon } from "../components/MyIcon";
import Box from "../components/Box";
import BoxWhite from "../components/BoxWhite";

export default function MessageScreen() {
  //states
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isShownAction, setShownAction] = useState(false);

  //handlers
  const handlePickImage = useCallback(() => {
    alert("Pick image");
  }, []);

  const handlePickFolder = useCallback(() => {
    alert("handlePickFolder");
  }, []);

  const handleMakingContact = useCallback(() => {
    alert("handleMakingContact");
  }, []);

  const handleSendNewMessage = useCallback(() => {
    if (!newMessage) {
      return;
    }

    const message = new Message(
      new Date().getTime(),
      newMessage,
      MessageType.TEXT,
      new Date().getTime()
    );

    setMessages((messages) => [message, ...messages]);
    setNewMessage("");

    //scroll to end
  }, [messages, newMessage]);

  const handleItemAction = useCallback((message: Message) => {
    setShownAction(true);
  }, []);

  //effects
  useEffect(() => {
    AMessage.getMessagesOfTowUsers(1, 2, (messages: Message[]) => {
      setMessages(messages);
    });
  }, []);

  return (
    <View style={[styles.container, { marginBottom: 10 }]}>
      <FlatList
        inverted={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={messages}
        renderItem={({ item: message }) => (
          <TouchableOpacity onLongPress={() => handleItemAction(message)}>
            <MessageItem
              key={message.id}
              message={message}
              ofMine={Math.random() > 0.5}
            />
          </TouchableOpacity>
        )}
      />

      {/* chat bar */}
      <View style={styles.chatContainer}>
        {/* actions */}
        {!newMessage && (
          <>
            <MyIcon
              icon={AppIcon.ic_photo}
              onPress={handlePickImage}
              iconName=""
            />
            <MyIcon
              icon={AppIcon.ic_folder}
              onPress={handlePickFolder}
              iconName=""
            />
            <MyIcon
              icon={AppIcon.ic_collab}
              onPress={handleMakingContact}
              iconName=""
            />
          </>
        )}

        <TextInput
          value={newMessage}
          onChangeText={(value) => setNewMessage(value)}
          placeholder="Chat here"
          style={styles.input}
        />

        <MyIcon
          icon={AppIcon.send}
          onPress={handleSendNewMessage}
          iconName=""
        />
      </View>

      {/* modal actions */}
      <Modal
        transparent
        visible={isShownAction}
        animationType="fade"
        style={modal.container}
      >
        <Text>Delete from you</Text>
        <Text>Delete all 2</Text>
        <Text>Reply this message</Text>

        <Text onPress={() => setShownAction(false)}>Cancel</Text>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.white,
  },

  chatContainer: {
    paddingVertical: 5,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  input: {
    backgroundColor: BackgroundColor.gray_10,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    flex: 1,
  },
});

const modal = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BackgroundColor.white,
  },

  box: {},
});
