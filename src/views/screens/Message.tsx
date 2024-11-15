import {Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from "react-native";
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";
import {ElementRef, useCallback, useContext, useEffect, useRef, useState,} from "react";
import Message from "../../models/Message";
import User from "../../models/User";
import AMessage from "../../apis/AMessage";
import MessageItem from "../components/MessageItem";
import {AppIcon} from "../components/MyIcon";
import RBSheet from "react-native-raw-bottom-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import {NavigationContext, NavigationRouteContext} from "@react-navigation/native";
import {MessageNavigationType} from "../../configs/NavigationRouteTypeConfig";
import {AccountContext} from "../../configs/AccountConfig";
import SLog, {LogType} from "../../services/SLog";
import Toast from "react-native-simple-toast";
import SFirebase from "../../services/SFirebase";
import ScreenName from "../../constants/ScreenName";

export default function MessageScreen() {
    //contexts
    const navigation = useContext(NavigationContext);
    const route = useContext(NavigationRouteContext);
    const accountContext = useContext(AccountContext);

    //refs
    const inputRef = useRef<ElementRef<typeof TextInput>>(null);
    const listRef = useRef<ElementRef<typeof ScrollView>>(null);
    const refRBSheet = useRef<ElementRef<typeof RBSheet>>(null);

    //states
    const [user, setUser] = useState<User>();
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
    //
    // if (replyMessage) {
    //     if (replyMessage.file)
    //   switch (replyMessage.messageType) {
    //     case MessageType.TEXT:
    //       replyContent = (
    //         <Text style={{ color: "#AAA", flex: 1 }}>{replyMessage.content}</Text>
    //       );
    //       break;
    //
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
    //
    // if (replyMessage) {
    //   if (!replyMessage.from_user_status || !replyMessage.to_user_status) {
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

        // @ts-ignore
        const message = new Message();
        message.content = newMessage;
        message.from_user = accountContext.account;
        message.to_user = user;
        message.is_image = false;
        message.reply_to_message = replyMessage;

        AMessage.sendMessage(message, (result) => {
            if (result) {
                Toast.show("Sent a new message", 1000);
            } else {
                Toast.show("Failed to send a new message", 1000);
            }

            setNewMessage("");
            setReplyMessage(undefined);
        });
    }, [newMessage, replyMessage, accountContext.account, user]);

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
        const ids: MessageNavigationType = route?.params as any;

        const asReadMessages = messages.filter(m => !m.as_read && m?.to_user?.id === ids?.me?.id);

        SLog.log(LogType.Warning, "asReadMessages", "", asReadMessages.map(m => m.content));

        AMessage.markAsRead(ids.user.id, ids.me?.id ?? "", asReadMessages, () => {
            SLog.log(LogType.Warning, "markAsRead", "mark all messages");
        });
        navigation?.goBack();
        navigation?.navigate(ScreenName.CHAT);
    }, [messages]);

    //effects
    useEffect(() => {
        const ids: MessageNavigationType = route?.params as any;

        setUser(ids.user);

        SFirebase.trackMessage(ids.me?.id ?? "", ids.user?.id ?? "", () => {
            SFirebase.trackMessage(ids.user?.id ?? "", ids.me?.id ?? "", () => {
                AMessage.getMessagesOfTowUsers(ids.from_user ?? "", ids.to_user ?? "", (messages: Message[]) => {
                    messages.reverse();

                    SLog.log(LogType.Warning, "Messages", "check messages", messages.map(m => ({
                        from: m.from_user?.full_name,
                        to: m.to_user?.full_name,
                    })));

                    setMessages(messages);
                });
            });
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
            <View style={{alignSelf: "center"}}>
                <Image src={user?.avatar?.path} style={styles.avatar}/>

                <Text style={styles.userName}>{user?.full_name}</Text>
            </View>

            <View style={[styles.container, styles.chatContent]}>

                <ScrollView ref={listRef} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
                            onContentSizeChange={(w, h) => {
                                listRef.current?.scrollTo({y: h, animated: true});
                            }}>
                    {messages.map((message) => (
                        <Pressable key={message.id} onLongPress={() => handleShowAction(message)}>
                            <MessageItem
                                message={message}
                            />
                        </Pressable>
                    ))}
                </ScrollView>

                {/* reply message */}
                {replyMessage && (
                    <View style={{flexDirection: "row"}}>
                        <Text>Reply to message: </Text>
                        {replyContent}
                        <Pressable
                            style={{alignSelf: "center"}}
                            onPress={() => setReplyMessage(undefined)}
                        >
                            <Image
                                source={AppIcon.ic_exit}
                                style={{width: 20, height: 20, alignSelf: "center"}}
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
                    {/*{!isAtBottom && (*/}
                    {/*    <TouchableOpacity style={action.scrollToBottomButtonContainer}>*/}
                    {/*        <Text*/}
                    {/*            onPress={() =>*/}
                    {/*                listRef.current?.scrollToIndex({*/}
                    {/*                    index: messages.length - 1,*/}
                    {/*                    animated: true,*/}
                    {/*                })*/}
                    {/*            }*/}
                    {/*            style={action.scrollToBottomButton}*/}
                    {/*        >*/}
                    {/*            Scroll to bottom*/}
                    {/*        </Text>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*)}*/}
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
        // backgroundColor: BackgroundColor.sub_primary,
    },

    chatContent: {
        padding: 10,
        paddingTop: 20,
        marginTop: 10,
        backgroundColor: BackgroundColor.gray_e6,
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
        color: TextColor.sub_primary,
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: BackgroundColor.primary,
        marginTop: 20,
        alignSelf: "center",
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
