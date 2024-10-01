import {
  FlatList,
  InteractionManager,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";
import { ElementRef, useCallback, useEffect, useRef, useState } from "react";
import Message, { MessageType } from "../../models/Message";
import AMessage from "../../apis/AMessage";
import MessageItem from "../components/MessageItem";
import MyIcon, { AppIcon } from "../components/MyIcon";
import RBSheet from "react-native-raw-bottom-sheet";
import BackWithDetailLayout from "../layouts/BackWithDetail";
import { Image } from "react-native";

export default function MessageScreen() {
  //refs
  const inputRef = useRef<ElementRef<typeof TextInput>>(null);
  const listRef = useRef<ElementRef<typeof FlatList<Message>>>(null);
  const refRBSheet = useRef<ElementRef<typeof RBSheet>>(null);

  //states
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState<Message | undefined>(
    undefined
  );
  const [activeMessage, setActiveMessage] = useState<Message | undefined>(
    undefined
  );
  const [isAtBottom, setAtBottom] = useState(true);

  let replyContent;

  if (replyMessage) {
    switch (replyMessage.messageType) {
      case MessageType.TEXT:
        replyContent = (
          <Text style={{ color: "#AAA", flex: 1 }}>{replyMessage.content}</Text>
        );
        break;

      case MessageType.IMAGE:
        replyContent = (
          <Text
            style={{ color: "#AAA", flex: 1, textDecorationLine: "underline" }}
          >
            {"Image"}
          </Text>
        );
        break;
      case MessageType.FILE:
        replyContent = (
          <Text
            style={{ color: "#AAA", flex: 1, textDecorationLine: "underline" }}
          >
            {replyMessage.file.name}
          </Text>
        );
        break;
    }
  }

  if (replyMessage) {
    if (!replyMessage.fromUserStatus || !replyMessage.toUser) {
      replyContent = (
        <Text
          style={{
            color: "#AAA",
            flex: 1,
            textDecorationLine: "underline line-through",
          }}
        >
          Tin nhan da go
        </Text>
      );
    }
  }

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

    message.replyToMessage = replyMessage;

    setMessages((messages) => [message, ...messages]);
    setNewMessage("");
    setReplyMessage(undefined);

    //scroll to end
  }, [messages, newMessage, replyMessage]);

  const handleShowAction = useCallback((message: Message) => {
    setActiveMessage(message);
    refRBSheet.current?.open();
  }, []);

  const handleReplyMessage = useCallback(() => {
    setReplyMessage(activeMessage);
    refRBSheet.current?.close();
  }, [activeMessage]);

  const handleDeleteOneSideMessage = useCallback(() => {
    if (activeMessage) {
      const message = messages.find(
        (message) => message.id === activeMessage.id
      );
      if (message) {
        message.fromUserStatus = false;
      }
    }
    setMessages(messages);
    refRBSheet.current?.close();
  }, [activeMessage, messages]);

  const handleDeleteTwoSideMessage = useCallback(() => {
    if (activeMessage) {
      const message = messages.find(
        (message) => message.id === activeMessage.id
      );
      if (message) {
        message.fromUserStatus = false;
        message.toUserStatus = false;
      }
    }
    setMessages(messages);
    refRBSheet.current?.close();
  }, [activeMessage, messages]);

  //effects
  useEffect(() => {
    AMessage.getMessagesOfTowUsers(1, 2, (messages: Message[]) => {
      setMessages(messages);
    });
  }, []);

  return (
    <BackWithDetailLayout
      icName="Back"
      subIcon={<MyIcon icon={AppIcon.ic_info} onPress={() => {}} />}
    >
      <View style={[styles.container, { marginBottom: 10 }]}>
        <FlatList
          ref={listRef}
          inverted={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={messages}
          onScroll={(event) =>
            setAtBottom(event.nativeEvent.contentOffset.y === 0)
          }
          renderItem={({ item: message }) => (
            <Pressable onLongPress={() => handleShowAction(message)}>
              <MessageItem
                key={message.id}
                message={message}
                ofMine={message.id % 2 == 0}
                onReplyPress={() =>
                  listRef.current?.scrollToItem({
                    item: message.replyToMessage ?? message,
                    animated: true,
                  })
                }
              />
            </Pressable>
          )}
        />

        {/* reply message */}
        {replyMessage && (
          <View style={{ flexDirection: "row" }}>
            <Text>Reply to message: </Text>
            {replyContent}
            <Pressable
              style={{ alignSelf: "center" }}
              onPress={() => setReplyMessage(undefined)}
            >
              <Image
                source={AppIcon.ic_exit}
                style={{ width: 20, height: 20, alignSelf: "center" }}
              />
            </Pressable>
          </View>
        )}

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
            ref={inputRef}
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

          {/* back to bottom button */}
          {!isAtBottom && (
            <TouchableOpacity style={action.scrollToBottomButtonContainer}>
              <Text
                onPress={() =>
                  listRef.current?.scrollToIndex({ index: 0, animated: true })
                }
                style={action.scrollToBottomButton}
              >
                Scroll to bottom
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* action */}
        <RBSheet ref={refRBSheet} useNativeDriver={false} height={200}>
          <TouchableOpacity style={action.action} onPress={handleReplyMessage}>
            <MyIcon icon={AppIcon.ic_close_desk} onPress={() => {}} />
            <Text style={action.item}>Tra loi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={action.action}
            onPress={handleDeleteOneSideMessage}
          >
            <MyIcon icon={AppIcon.ic_bin} onPress={() => {}} />
            <Text style={action.item}>Go phia ban</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={action.action}
            onPress={handleDeleteTwoSideMessage}
          >
            <MyIcon icon={AppIcon.ic_bin} onPress={() => {}} />
            <Text style={action.item}>Go ca 2 phia</Text>
          </TouchableOpacity>
        </RBSheet>
      </View>
    </BackWithDetailLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.white,
  },

  chatContainer: {
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

const action = StyleSheet.create({
  action: {
    flexDirection: "row",
    margin: 10,
    gap: 10,
  },
  item: {
    fontSize: 13,
    fontWeight: "bold",
    alignSelf: "center",
  },

  scrollToBottomButtonContainer: {
    position: "absolute",
    top: -40,
    left: 0,
    right: 0,
  },

  scrollToBottomButton: {
    backgroundColor: BackgroundColor.sub_primary,
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: TextColor.white,
    alignSelf: "center",
  },
});
