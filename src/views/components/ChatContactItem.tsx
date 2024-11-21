import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Chat from "../../models/Chat";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";
import User from "../../models/User";

const AVATAR_SIZE = 50;

export type ChatContactItemProps = {
  user: User;
  onPress: () => void;
};

export default function ChatContactItem({
  user,
  onPress = () => {},
}: ChatContactItemProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {/* avatar */}
      {user.avatar ? (
        <Image src={user?.avatar?.path} style={styles.avatar} />
      ) : (
        <Image
          source={require("../../../assets/avatar/avatarTempt.png")}
          style={styles.avatar}
        />
      )}

      {/* name */}
      <View style={{ flex: 1 }}>
        {/* name */}
        <Text style={styles.name}>{user.full_name?.toLocaleUpperCase()}</Text>

        <View style={{ flexDirection: "row" }}>
          {/* phone number */}
          <Text style={styles.subName}>
            {user.phone_number.toLocaleLowerCase() || "No phone number"}
          </Text>

          {/* email */}
          <Text style={[styles.subName, { flex: 2, textAlign: "right" }]}>
            {user.email.toLocaleLowerCase() || "No email"}
          </Text>
        </View>
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
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
  },

  subName: {
    flex: 1,
    alignSelf: "center",
    fontSize: 12,
    color: TextColor.hint,
  },
});
