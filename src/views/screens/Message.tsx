import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";
import {
  ElementRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Message from "../../models/Message";
import AMessage from "../../apis/AMessage";
import MessageItem from "../components/MessageItem";
import MyIcon, { AppIcon } from "../components/MyIcon";
import RBSheet from "react-native-raw-bottom-sheet";
import { Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationContext } from "@react-navigation/native";

export default function MessageScreen() {
  //contexts
  const navigation = useContext(NavigationContext);

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

  // if (replyMessage) {
  //   switch (replyMessage.messageType) {
  //     case MessageType.TEXT:
  //       replyContent = (
  //         <Text style={{ color: "#AAA", flex: 1 }}>{replyMessage.content}</Text>
  //       );
  //       break;

  //     case MessageType.IMAGE:
  //       replyContent = (
  //         <Text
  //           style={{ color: "#AAA", flex: 1, textDecorationLine: "underline" }}
  //         >
  //           {"Image"}
  //         </Text>
  //       );
  //       break;
  //     case MessageType.FILE:
  //       replyContent = (
  //         <Text
  //           style={{ color: "#AAA", flex: 1, textDecorationLine: "underline" }}
  //         >
  //           {replyMessage.file.name}
  //         </Text>
  //       );
  //       break;
  //   }
  // }

  // if (replyMessage) {
  //   if (!replyMessage.fromUserStatus || !replyMessage.toUser) {
  //     replyContent = (
  //       <Text
  //         style={{
  //           color: "#AAA",
  //           flex: 1,
  //           textDecorationLine: "underline line-through",
  //         }}
  //       >
  //         Tin nhan da go
  //       </Text>
  //     );
  //   }
  // }

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
      1,
      undefined,
      undefined,
      newMessage,
      undefined,
      false,
      new Date(),
      undefined
    );

    message.reply_to_message = replyMessage;

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
        message.from_user_status = false;
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
        message.from_user_status = false;
        message.to_user_status = false;
      }
    }
    setMessages(messages);
    refRBSheet.current?.close();
  }, [activeMessage, messages]);

  //handlers
  const goBack = useCallback(() => {
    navigation?.goBack();
  }, []);

  //effects
  useEffect(() => {
    AMessage.getMessagesOfTowUsers(1, 2, (messages: Message[]) => {
      setMessages([
        ...messages,
        ...messages,
        ...messages,
        ...messages,
        ...messages,
        ...messages,
      ]);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons
        name="close"
        size={30}
        style={styles.backButton}
        onPress={goBack}
      />

      {/* user */}
      <View style={{ alignSelf: "center" }}>
        <Image src="" style={styles.avatar} />

        <Text style={styles.userName}>{"messages"}</Text>
      </View>

      <View style={[styles.container, styles.chatContent]}>
        <FlatList
          ref={listRef}
          inverted={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={messages}
          onScroll={(event) =>
            setAtBottom(
              event.nativeEvent.contentOffset.y >
                event.nativeEvent.layoutMeasurement.height
            )
          }
          renderItem={({ item: message, index }) => (
            <Pressable onLongPress={() => handleShowAction(message)}>
              <MessageItem
                key={message.id + index}
                message={message}
                ofMine={message.id % 2 == 0}
                onReplyPress={() =>
                  listRef.current?.scrollToItem({
                    item: message.reply_to_message ?? message,
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
              <Ionicons
                name="images"
                size={30}
                color={BackgroundColor.black}
                onPress={handlePickImage}
              />
              <Ionicons
                name="reader"
                size={30}
                color={BackgroundColor.black}
                onPress={handlePickFolder}
              />
              <Ionicons
                name="hand-left"
                size={30}
                color={BackgroundColor.black}
                onPress={handleMakingContact}
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

          <Ionicons
            name="send"
            size={30}
            color={BackgroundColor.black}
            onPress={handleSendNewMessage}
          />

          {/* back to bottom button */}
          {!isAtBottom && (
            <TouchableOpacity style={action.scrollToBottomButtonContainer}>
              <Text
                onPress={() =>
                  listRef.current?.scrollToIndex({
                    index: messages.length - 1,
                    animated: true,
                  })
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
            <Ionicons
              name="return-down-forward-outline"
              size={30}
              color={BackgroundColor.black}
            />
            <Text style={action.item}>Tra loi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={action.action}
            onPress={handleDeleteOneSideMessage}
          >
            <Ionicons
              name="trash"
              size={30}
              color={BackgroundColor.sub_warning}
            />
            <Text style={action.item}>Go phia ban</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={action.action}
            onPress={handleDeleteTwoSideMessage}
          >
            <Ionicons
              name="trash"
              size={30}
              color={BackgroundColor.sub_danger}
            />
            <Text style={action.item}>Go ca 2 phia</Text>
          </TouchableOpacity>
        </RBSheet>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.sub_primary,
  },

  chatContent: {
    padding: 10,
    paddingTop: 20,
    marginTop: 10,
    backgroundColor: BackgroundColor.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: BackgroundColor.sub_primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },

  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },

  userName: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 20,
    color: TextColor.white,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: BackgroundColor.primary,
    marginTop: 20,
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
