import {Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Message from "../../models/Message";
import DateTimeConfig from "../../configs/DateTimeConfig";
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";
import {ElementRef, useCallback, useContext, useRef, useState} from "react";
import ReactAppUrl from "../../configs/ConfigUrl";
import ImageViewer from "react-native-image-zoom-viewer";
import {IImageInfo} from "react-native-image-zoom-viewer/built/image-viewer.type";
import RBSheet from "react-native-raw-bottom-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import AMessage from "../../apis/AMessage";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-simple-toast";
import {LanguageContext} from "../../configs/LanguageConfig";

type MessageItemProps = {
  message: Message;
  ofMine: boolean;
  inGroup?: boolean;
  askAI?: () => void;
};

const emptyFuc = () => {
};

export default function MessageItem(
  {
    message,
    ofMine,
    inGroup,
    askAI
  }: MessageItemProps) {
  //refs
  const refRBSheet = useRef<ElementRef<typeof RBSheet>>(null);
  const refRBSheetAI = useRef<ElementRef<typeof RBSheet>>(null);

  //contexts
  const language = useContext(LanguageContext).language;

  //states
  let content;
  const [showImage, setShowImage] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // main content
  if (message.content?.includes("$image:")) {
    content =
      <Pressable onPress={() => setShowImage(true)} onLongPress={ofMine && refRBSheet.current?.open || emptyFuc}>
        <Image
          src={ReactAppUrl.PUBLIC_URL + "/" + message.content.replace("$image:", "")}
          style={[
            {
              width: 280,
              height: 280 / (message.ratio ?? 1) > 600 ? 600 : 280 / (message.ratio ?? 1),
              borderRadius: 5,
            },
            ofMine && styles.ofMine,
            {
              alignSelf: "center",
            },
          ]}
        />
      </Pressable>
  } else {
    content = (
      <Text style={[styles.content, ofMine && styles.textOfMine]}
            onLongPress={ofMine && refRBSheet.current?.open || (askAI && refRBSheetAI?.current?.open) || emptyFuc}>
        {message.content}
      </Text>
    );
  }

  //check main content active or not
  //mine  1, from user 0
  //mine 0, to user 0
  if (!message.is_active) {
    content = (
      <Text
        style={[
          styles.content,
          ofMine && styles.textOfMine,
          {color: TextColor.hint, fontStyle: "italic"},
        ]}
      >
        {language.DELETED_MESSAGE}
      </Text>
    );
  }

  //handlers
  const deleteMessage = useCallback(() => {
    setLoading(true);
    refRBSheet.current?.close();

    const timeId = setTimeout(() => {
      setLoading(false);
      Toast.show(language.DELETE_FAILED, 1000);
    }, 10000);

    AMessage.deleteMessage(message,
      (result) => {
        setLoading(false);

        if (!result) {
          Toast.show(language.DELETE_FAILED, 1000);
        }
      },
      () => {
        setLoading(false);
        clearTimeout(timeId);
      },
      inGroup
    )
  }, [inGroup]);

  return (
    <>
      {/* main message */}
      <View
        style={[
          styles.container,
          ofMine && styles.containerOfMine,
        ]}
      >
        <Text style={[styles.sender, ofMine && styles.isMe]}>@{message.sender?.full_name}</Text>

        {content}

        <Text style={[styles.time, ofMine && styles.textOfMine]}>
          {DateTimeConfig.getDateFormat(message.created_at, true, true)}
        </Text>

        <Modal visible={showImage} transparent={true}>
          <ImageViewer
            imageUrls={[{url: ReactAppUrl.PUBLIC_URL + "/" + message.content.replace("$image:", "")} as IImageInfo]}
            index={currentImageIndex}
            onCancel={() => setShowImage(false)}
            enableSwipeDown={true}
          />
        </Modal>

        <Spinner visible={loading} />

        {/* action */}
        <RBSheet ref={refRBSheet} useNativeDriver={false} height={100}>
          <TouchableOpacity
            style={action.action}
            onPress={deleteMessage}
          >
            <Ionicons
              name="trash"
              size={30}
              color={BackgroundColor.sub_danger}
            />
            <Text style={action.item}>{language.DELETE_MESSAGE}</Text>
          </TouchableOpacity>
        </RBSheet>

        {/* ai */}
        <RBSheet ref={refRBSheetAI} useNativeDriver={false} height={100}>
          <TouchableOpacity
            style={action.action}
            onPress={() => {
              refRBSheetAI?.current?.close();
              askAI && askAI();
            }}
          >
            <Ionicons
              name="globe-outline"
              size={30}
              color={BackgroundColor.sub_primary}
            />
            <Text style={action.item}>{language.ASK_AI}</Text>
          </TouchableOpacity>
        </RBSheet>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 300,
    minWidth: 80,
    backgroundColor: BackgroundColor.primary,
    marginBottom: 10,
    borderRadius: 10,
    gap: 5,
    alignSelf: "flex-start",
  },

  containerOfMine: {
    backgroundColor: BackgroundColor.white,
    borderWidth: 1,
    borderColor: TextColor.sub_primary,
    alignSelf: "flex-end",
  },

  sender: {
    fontSize: 12,
    color: TextColor.white,
    padding: 10,
    paddingBottom: 2,
    fontWeight: "700",
  },

  isMe: {
    color: TextColor.sub_primary,
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
    paddingHorizontal: 10,
    paddingTop: 2,
    paddingBottom: 0,
  },

  ofMine: {
    alignSelf: "flex-end",
  },

  textOfMine: {
    color: TextColor.sub_primary,
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

const action = StyleSheet.create({
  action: {
    flex: 1,
    flexDirection: "row",
    margin: 10,
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  item: {
    fontSize: 13,
    fontWeight: "bold",
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

