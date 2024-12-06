import {Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from "react-native";
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";
import {ElementRef, useCallback, useContext, useEffect, useRef, useState,} from "react";
import Message from "../../models/Message";
import AMessage from "../../apis/AMessage";
import MessageItem from "../components/MessageItem";
import Ionicons from "@expo/vector-icons/Ionicons";
import {NavigationContext, NavigationRouteContext} from "@react-navigation/native";
import {ClassDetailRoute, GroupMessageNavigationType, IdNavigationType} from "../../configs/NavigationRouteTypeConfig";
import {AccountContext} from "../../configs/AccountConfig";
import SLog, {LogType} from "../../services/SLog";
import Toast from "react-native-simple-toast";
import SFirebase, {FirebaseNode} from "../../services/SFirebase";
import ScreenName from "../../constants/ScreenName";
import Spinner from "react-native-loading-spinner-overlay";
import * as ImagePicker from "expo-image-picker";
import {useCameraPermissions} from "expo-camera";
import Class from "../../models/Class";
import {LanguageContext} from "../../configs/LanguageConfig";
import ReactAppUrl from "../../configs/ConfigUrl";
import {AppInfoContext} from "../../configs/AppInfoContext";
import {RoleList} from "../../models/Role";

export default function GroupMessageScreen() {
  //contexts
  const navigation = useContext(NavigationContext);
  const route = useContext(NavigationRouteContext);
  const accountContext = useContext(AccountContext);
  const language = useContext(LanguageContext).language;
  const appInfos = useContext(AppInfoContext).infos;
  const [permission, requestPermission] = useCameraPermissions();

  //refs
  const inputRef = useRef<ElementRef<typeof TextInput>>(null);
  const listRef = useRef<ElementRef<typeof ScrollView>>(null);

  //states
  const [_class, setClass] = useState<Class | undefined>(undefined);
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedList, setSuggestedList] = useState<string[]>([]);
  const [showSuggestList, setShowSuggestList] = useState(true);
  const [isTutor, setIsTutor] = useState(false);

  //handlers
  const handleSendNewMessage = useCallback((newMessage: string, ratio?: number) => {
    if (!newMessage) {
      return;
    }

    // @ts-ignore
    const message = new Message();
    message.content = newMessage?.trim();
    message.sender = accountContext.account;
    message.class = _class;
    message.ratio = ratio ?? 1;

    setNewMessage("");

    setLoading(true);

    const timeId = setTimeout(() => {
      setLoading(false);
    }, 10000);

    AMessage.sendMessage(message, (result) => {
        if (!result) {
          Toast.show(language.FAIL_TO_SEND_MESSAGE, 1000);
        }
      },
      () => {
        setLoading(false);
        clearTimeout(timeId);
      },
      true);
  }, [accountContext.account, _class]);

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
                Toast.show(language.FAIL_TO_SEND_IMAGE, 1000);
              }
            },
          );
        }
      });
  }, [permission, handleSendNewMessage, accountContext.account, _class]);

  const askAI = useCallback((content: string) => {
    setLoading(true);

    const timeId = setTimeout(() => {
      setLoading(false);
    }, 10000);

    AMessage.askAI(
      appInfos.ai_key,
      content,
      (result) => {
        setNewMessage(result);
      },
      () => {
        setLoading(false);
        clearTimeout(timeId);
      }
    );
  }, [appInfos]);

  //handlers
  const goToDetail = useCallback(() => {
    const data: ClassDetailRoute = {
      classId: _class?.id ?? -1,
    }
    navigation?.navigate(ScreenName.DETAIL_CLASS, data);
  }, [_class]);

  //effects
  useEffect(() => {
    const data: GroupMessageNavigationType = route?.params as GroupMessageNavigationType;
    setClass(data.class);
  }, []);

  useEffect(() => {
    if (navigation) {
      navigation.setOptions({
        title: _class?.title,
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
          <TouchableOpacity onPress={goToDetail} style={{paddingRight: 10, flexDirection: "row", gap: 5}}>
            <Text></Text>
            <Image src={ReactAppUrl.PUBLIC_URL + _class?.major?.icon} style={styles.avatar} />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, _class]);

  useEffect(() => {
    const tutorId: string = (_class as any)?.tutor_id ?? "-$$";
    setIsTutor(tutorId === accountContext.account?.id);
  }, [_class, accountContext.account]);

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    SFirebase.track(FirebaseNode.Messages, [
        {
          key: FirebaseNode.ClassId,
          value: _class?.id ?? -1
        }],
      () => {
        AMessage.getMessagesOfGroup(_class?.id ?? -1, (messages) => {

          messages.forEach(m => {
            m.class = new Class(_class?.id ?? -1);
          });

          setMessages(messages);
        });
      });
  }, [_class, accountContext.account, messages.length]);

  useEffect(() => {
    if (accountContext.account?.roles?.map(r => r.id)?.includes(RoleList.TUTOR)) {
      switch (language.TYPE) {
        case "vi":
          setSuggestedList(appInfos.suggested_messages_for_tutors.vn);
          break;
        case "en":
          setSuggestedList(appInfos.suggested_messages_for_tutors.en);
          break;
        case "ja":
          setSuggestedList(appInfos.suggested_messages_for_tutors.ja);
          break;
      }
    } else {
      switch (language.TYPE) {
        case "vi":
          setSuggestedList(appInfos.suggested_messages_for_learners.vn);
          break;
        case "en":
          setSuggestedList(appInfos.suggested_messages_for_learners.en);
          break;
        case "ja":
          setSuggestedList(appInfos.suggested_messages_for_learners.ja);
          break;
      }
    }
  }, [accountContext.account, appInfos]);

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
                inGroup={true}
                askAI={isTutor ? () => askAI(message.content) : undefined}
              />
            </Pressable>
          ))}
        </ScrollView>

        {showSuggestList && suggestedList &&
          <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} horizontal={true}>
            {suggestedList.map((item, index) => (
              <Text key={index} style={styles.suggestItem} onPress={() => setNewMessage(item)}>{item}</Text>
            ))}
          </ScrollView>}

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
                name="bulb-outline"
                size={30}
                color={showSuggestList ? BackgroundColor.warning : BackgroundColor.black}
                onPress={() => setShowSuggestList(prev => !prev)}
              />
            </>
          )}

          <TextInput
            ref={inputRef}
            value={newMessage}
            onChangeText={(value) => setNewMessage(value)}
            placeholder={language.CHAT_HERE + "..."}
            multiline={true}
            numberOfLines={Math.ceil(newMessage.length / 30)}
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
    // marginTop: 10,
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
    color: TextColor.white,
  },

  avatarContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
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
    minHeight: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    flex: 1,
  },

  suggestItem: {
    fontSize: 12,
    backgroundColor: BackgroundColor.sub_warning,
    paddingTop: 5,
    paddingBottom: 7,
    paddingHorizontal: 8,
    borderRadius: 10,
    margin: 3,
    fontStyle: "italic",
    maxHeight: 30,
    alignSelf: "flex-end",
  }
});
