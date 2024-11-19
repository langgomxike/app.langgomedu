import React from "react";
import {View, StyleSheet, Text, TouchableOpacity, Image, ImageSourcePropType} from "react-native";

import Ionicons from '@expo/vector-icons/Ionicons';
// import { useNavigation, NavigationProp } from '@react-navigation/native'; 
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";
import HLine, {HLineType} from "./HLine";
import MyIcon, {AppIcon} from "./MyIcon";
import ScreenName from "../../constants/ScreenName";

export type AccountItemProps = {
  title: string;
  iconName: ImageSourcePropType;
  onPress?: () => void;
};

// const navigation = useNavigation();

// const handlePress = (screenName: string) => {
//     navigation.navigate(screenName); // Chuyển đến màn hình tương ứng
// }

const AccountItem = ({iconName, title, onPress}: AccountItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View>
        <Image source={iconName} style={{width: 30, height: 30, alignSelf: "center"}}/>
      </View>

      <View style={styles.textBox}>
        <View style={[styles.textLine,]}>
          <Text> {title} </Text>
          <Ionicons
            style={styles.icon}
            name="chevron-forward"
            size={20}
            color={BackgroundColor.gray_c6}
          />
        </View>

        {/*<HLine type={HLineType.LIGHT} />*/}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: BackgroundColor.white,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
    alignItems: "center"

  },
  textBox: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
    padding: 5,
  },
  textLine: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    flex: 1,
    textAlign: "right",
  },
});

export default AccountItem;
