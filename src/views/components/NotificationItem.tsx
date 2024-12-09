import {
  Image, Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Chat from "../../models/Chat";
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";
import User from "../../models/User";
import {ElementRef, useCallback, useContext, useRef, useState} from "react";
import Spinner from "react-native-loading-spinner-overlay";
import DateTimeConfig from "../../configs/DateTimeConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import RBSheet from "react-native-raw-bottom-sheet";
import Toast from "react-native-simple-toast";
import AMessage from "../../apis/AMessage";
import {LanguageContext} from "../../configs/LanguageConfig";
import CustomShimmer from "./skeleton/CustomShimmer";

type ChatContactItemProps = {
  id: number;
  content: string;
  createdAt: number;
};

export default function NotificationItem(
  {
    id,
    content,
    createdAt
  }: ChatContactItemProps) {
  //refs
  const refRBSheet = useRef<ElementRef<typeof RBSheet>>(null);

  //contexts
  const language = useContext(LanguageContext).language;

  //states
  const [loading, setLoading] = useState(false);

  //handlers
  const deleteNotification = useCallback(() => {
    setLoading(true);

    const timeId = setTimeout(() => {
      setLoading(false);
      Toast.show(language.DELETE_FAILED, 1000);
    }, 10000);

    AMessage.deleteNotification(id,
      (result) => {
        if (result) {
          Toast.show(language.DELETED, 1000);
        } else {
          Toast.show(language.DELETE_FAILED, 1000);
        }
      }, () => {
        setLoading(false);
        clearTimeout(timeId);
      })
  }, []);

  const values: string[] = content.split("{$$}");
  let newContent: string = language.NOTIFICATION_NOT_SUPPORTED;

  switch (language.TYPE) {
    case "vi":
      newContent = values.length >= 1 && values[0] ? values[0] : newContent;
      break;
    case "en":
      newContent = values.length >= 2 && values[1] ? values[1] : newContent;
      break;
    case "ja":
      newContent = values.length >= 3 && values[2] ? values[2] : newContent;
      break;
  }

  return (
    <TouchableOpacity onLongPress={refRBSheet.current?.open} style={styles.container}>
      <Spinner visible={loading}/>

      <Text style={styles.time}>{DateTimeConfig.getDateFormat(createdAt, true, true)}</Text>
      <Text>{newContent}</Text>

      <RBSheet ref={refRBSheet} useNativeDriver={false} height={100}>
        <TouchableOpacity
          style={action.action}
          onPress={deleteNotification}
        >
          <Ionicons
            name="trash"
            size={30}
            color={BackgroundColor.sub_danger}
          />
          <Text style={action.item}>{language.DELETE_NOTIFICATION}</Text>
        </TouchableOpacity>
      </RBSheet>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 5,
    borderWidth: 0.5,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderColor: TextColor.sub_primary,
    minHeight: 70,
  },

  time: {
    alignSelf: "baseline",
    fontSize: 8,
    backgroundColor: BackgroundColor.sub_primary,
    color: TextColor.white,
    padding: 2,
    borderRadius: 5,
    marginBottom: 5,
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

