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
import {useCallback, useState} from "react";
import Spinner from "react-native-loading-spinner-overlay";

const AVATAR_SIZE = 50;

export type ChatContactItemProps = {
  user: User;
  onPress: () => void;
};

export default function ChatContactItem({
                                          user,
                                          onPress = () => {
                                          },
                                        }: ChatContactItemProps) {
  //states
  const [loading, setLoading] = useState(false);

  //handlers
  const openInZalo = useCallback(() => {
    setLoading(true);
    Linking.openURL(`https://zalo.me/${user.phone_number}`)
      .finally(() => setLoading(false));
  }, []);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Spinner visible={loading}/>
      {/* avatar */}
      {user.avatar ? (
        <Image src={user?.avatar} style={styles.avatar}/>
      ) : (
        <Image
          source={require("../../../assets/avatar/avatarTempt.png")}
          style={styles.avatar}
        />
      )}

      {/* name */}
      <View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
        {/* name */}
        <Text style={styles.name}>{user.full_name?.toLocaleUpperCase()}</Text>

        <TouchableOpacity onPress={openInZalo}>
          <Text style={styles.hint}>Xem tren zalo</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 20,
    marginRight: 10,
    marginBottom: 10,
    paddingTop: 10,
  },

  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: BackgroundColor.sub_primary,
    alignSelf: "center",
  },

  name: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },

  hint: {
    backgroundColor: BackgroundColor.primary,
    padding: 5,
    borderRadius: 10,
    fontSize: 8,
    color: TextColor.white,
    textAlign: "center",
  },

  subName: {
    flex: 1,
    alignSelf: "center",
    fontSize: 12,
    color: TextColor.hint,
  },
});
