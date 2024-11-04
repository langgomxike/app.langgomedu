import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import Ionicons from '@expo/vector-icons/Ionicons';
// import { useNavigation, NavigationProp } from '@react-navigation/native'; 
import { BackgroundColor } from "../../configs/ColorConfig";
import HLine, { HLineType } from "./HLine";
import MyIcon, { AppIcon } from "./MyIcon";
import ScreenName from "../../constants/ScreenName";
import { Type } from "../../configs/AccountListItemConfig";

export type AccountItemProps = {
  title: string,
  iconName: AppIcon,
  screenName?: ScreenName,
  type: Type,
  onNext: (type: Type, screenName?: ScreenName)=> void
};




const AccountItem = ({ iconName, title, screenName, type, onNext }: AccountItemProps) => {

  //handler
 

  return (
    <TouchableOpacity style={styles.container} onPress={()=> {onNext(type, screenName)}}>
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
