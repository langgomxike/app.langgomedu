import React, { useState } from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import ReactAppUrl from "../../configs/ConfigUrl";
import {BackgroundColor} from "../../configs/ColorConfig";
// import {
//   launchImageLibrary,
//   ImageLibraryOptions,
//   ImagePickerResponse,
// } from "react-native-image-picker";
export enum Orientation {
  horizontally = "horizontally",
  vertically = "vertically",
}
type MyAvatar = {
  avatar?: string;
  canEdit: boolean;
  userName: string;
  orientation: Orientation;
  onPress: () => void;
};
export const avatarTempt = require("../../../assets/avatar/avatarTempt.png");

const Avatar: React.FC<MyAvatar> = ({
  avatar,
  userName,
  canEdit,
  orientation,
  onPress,
}) => {
  // State để lưu ảnh đại diện hiện tại
  const [currentAvatar, setCurrentAvatar] = useState<string>(
    avatar || avatarTempt
  );

  if (canEdit) {
    if (orientation == "horizontally") {
      return (
        <TouchableOpacity onPress={onPress}>
          <View style={styles.horizontally}>
            <Image src={ReactAppUrl.PUBLIC_URL + avatar} style={styles.avatar} />
            <Text style={styles.usernameh}>{userName}</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={onPress}>
          <View style={styles.vertically}>
            <Image src={ReactAppUrl.PUBLIC_URL + avatar} style={styles.avatar} />
            <Text style={styles.username}>{userName}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  } else {
      return (
        <View style={orientation == "horizontally" ? styles.horizontally : styles.vertically}>
          <Image src={ReactAppUrl.PUBLIC_URL + avatar} style={styles.avatar} />
          <Text style={orientation == "horizontally" ? styles.usernameh : styles.username}>{userName}</Text>
        </View>
      );
  }
};

const styles = StyleSheet.create({
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: BackgroundColor.white,
    alignSelf: "center",
    marginTop: 10,
  },
  horizontally: {
    flexDirection: "row", // Đặt hướng là hàng
    alignItems: "center", // Căn giữa theo chiều dọc
  },
  vertically: {
    flexDirection: "column", // Đặt hướng là hàng
    // Căn giữa theo chiều dọc
  },
  username: {
    textAlign: "center",
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  usernameh: {
    textAlign: "center",
    marginLeft: 20,
    color: "#000",
    fontSize: 16,
  },
});

export default Avatar;
