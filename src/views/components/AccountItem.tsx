import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import Ionicons from '@expo/vector-icons/Ionicons';
// import { useNavigation, NavigationProp } from '@react-navigation/native'; 
import { BackgroundColor } from "../../configs/ColorConfig";
import HLine, { HLineType } from "./HLine";
import MyIcon, { AppIcon } from "./MyIcon";
import ScreenName from "../../constants/ScreenName";

export type AccountItemProps = {
  title: string;
  iconName: AppIcon;
  onPress?: () => void;
};

// const navigation = useNavigation();

// const handlePress = (screenName: string) => {
//     navigation.navigate(screenName); // Chuyển đến màn hình tương ứng
// }

const AccountItem = ({ iconName, title, onPress }: AccountItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View
        style={{
          paddingTop: 20,
        }}
      >
        <MyIcon icon={iconName} onPress={() => {}} />
      </View>

      <View style={styles.textBox}>
        <View style={styles.textLine}>
          <Text> {title} </Text>
          <Ionicons
            style={styles.icon}
            name="chevron-forward"
            size={24}
            color="black"
          />
        </View>

        <HLine type={HLineType.LIGHT} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: BackgroundColor.white,
    flexDirection: "row",
    paddingHorizontal: 10,
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
