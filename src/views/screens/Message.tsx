import {Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from "react-native";
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";
import {ElementRef, useCallback, useContext, useEffect, useRef, useState,} from "react";
import Message from "../../models/Message";
import User from "../../models/User";
import AMessage from "../../apis/AMessage";
import MessageItem from "../components/MessageItem";
import Ionicons from "@expo/vector-icons/Ionicons";
import {NavigationContext, NavigationRouteContext} from "@react-navigation/native";
import {IdNavigationType, MessageNavigationType} from "../../configs/NavigationRouteTypeConfig";
import {AccountContext} from "../../configs/AccountConfig";
import SLog, {LogType} from "../../services/SLog";
import Toast from "react-native-simple-toast";
import SFirebase, {FirebaseNode} from "../../services/SFirebase";
import ScreenName from "../../constants/ScreenName";
import Spinner from "react-native-loading-spinner-overlay";
import * as ImagePicker from "expo-image-picker";
import {useCameraPermissions} from "expo-camera";
import {LanguageContext} from "../../configs/LanguageConfig";
import ReactAppUrl from "../../configs/ConfigUrl";

export default function MessageScreen() {
  //contexts
  const navigation = useContext(NavigationContext);
  const route = useContext(NavigationRouteContext);
  const accountContext = useContext(AccountContext);
  const languageContext = useContext(LanguageContext).language;
  const [permission, requestPermission] = useCameraPermissions();

  //refs
  const inputRef = useRef<ElementRef<typeof TextInput>>(null);
  const listRef = useRef<ElementRef<typeof ScrollView>>(null);

  //states
  const [user, setUser] = useState<User>();
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  //handlers
  const handleSendNewMessage = useCallback((newMessage: string, ratio?: number) => {
    if (!newMessage) {
      return;
    }

    // @ts-ignore
    const message = new Message();
    message.content = newMessage?.trim();
    message.sender = accountContext.account;
    message.receiver = user;
    message.ratio = ratio ?? 1;

    setNewMessage("");

    setLoading(true);

    const timeId = setTimeout(() => {
      setLoading(false);
    }, 10000);

    AMessage.sendMessage(message, (result) => {
        if (!result) {
          Toast.show(languageContext.FAIL_TO_SEND_MESSAGE, 1000);
        }
      },
      () => {
        setLoading(false);
        clearTimeout(timeId);
      });
  }, [accountContext.account, user]);

  const handlePickImage = useCallback(() => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    })
      .then((result) => {
        if (!result.canceled) {
          const uri = result.assets[0].uri ?? "";
          const ratio = result.assets[0].width / result.assets[0].height ?? 1;

          AMessage.sendImageMessage(uri, (path: string) => {
              if (path) {
                setNewMessage("$image:" + path);
                SLog.log(LogType.Warning, "handlePickImage", "path", path);
                handleSendNewMessage("$image:" + path, ratio);
              } else {
                Toast.show(languageContext.FAIL_TO_SEND_IMAGE, 1000);
              }
            },
          );
        }
      });
  }, [permission, handleSendNewMessage, accountContext.account, user]);

  //handlers
  const goToProfile = useCallback(() => {
    const data: IdNavigationType = {
      id: user?.id ?? "-1",
    }
    navigation?.navigate(ScreenName.PROFILE, data);
  }, [user]);

  //effects
  useEffect(() => {
    const data: MessageNavigationType = route?.params as MessageNavigationType;
    setUser(data.user);
  }, []);

  useEffect(() => {
    if (navigation) {
      navigation.setOptions({
        title: user?.full_name,
        headerShown: true,
        contentStyle: {
          padding: 0,
        },
        headerStyle: {
          backgroundColor: BackgroundColor.primary,
        },
        headerTintColor: "#fff",
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{paddingRight: 10, flexDirection: "row", gap: 5}}>
            <Ionicons name="chevron-back" size={24} color="white" style={{alignSelf: "center"}}/>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={goToProfile} style={{paddingRight: 10, flexDirection: "row", gap: 5}}>
            <Text></Text>
            <Image src={ReactAppUrl.PUBLIC_URL + user?.avatar} style={styles.avatar} />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, user]);

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    SFirebase.track(FirebaseNode.Messages, [
      {
        key: FirebaseNode.FromUserId,
        value: user?.id ?? "-1"
      },
      {
        key: FirebaseNode.ToUserId,
        value: accountContext.account?.id ?? "-1"
      }], () => {
      AMessage.getMessagesOfTowUsers(user?.id ?? "-1", accountContext.account?.id ?? "-1", (messages) => {
        setMessages(messages);
      });
    });
  }, [user, accountContext.account, messages.length]);

  return (
    <View style={styles.container}>
      <Spinner visible={loading}/>

      <View style={[styles.container, styles.chatContent]}>

        <ScrollView ref={listRef} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
                    onContentSizeChange={(w, h) => {
                      listRef.current?.scrollTo({y: h, animated: true});
                    }}>
          {messages.map((message) => (
            <Pressable key={message.id}>
              <MessageItem
                message={message}
                ofMine={accountContext.account?.id === message.sender?.id}
              />
            </Pressable>
          ))}
        </ScrollView>

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
            </>
          )}

          <TextInput
            ref={inputRef}
            value={newMessage}
            onChangeText={(value) => setNewMessage(value)}
            placeholder={languageContext.CHAT_HERE + "..."}
            style={styles.input}
          />

          <Ionicons
            name="send"
            size={30}
            color={BackgroundColor.black}
            onPress={() => handleSendNewMessage(newMessage)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.primary,
  },

  chatContent: {
    padding: 10,
    paddingTop: 20,
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
    fontSize: 16,
    color: TextColor.sub_primary,
  },

  avatar: {
    width: 50,
    height: 50,
    marginVertical: 10,
    borderRadius: 50,
    backgroundColor: BackgroundColor.sub_primary,
    borderWidth: 1,
    borderColor: BackgroundColor.white,
  },

  chatContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingHorizontal: 10,
  },

  input: {
    backgroundColor: BackgroundColor.gray_10,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    flex: 1,
  },
});
