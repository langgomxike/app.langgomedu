import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ScreenName from "../../constants/ScreenName";
import HomeScreen from "../screens/Home";
import ChatScreen from "../screens/Chat";
import CreateClassScreen from "../screens/CreateClass";
import PersonalScheduleScreen from "../screens/PersonalSchedule";
import AccountScreen from "../screens/Account";
import MyIcon, { AppIcon } from "./MyIcon";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback } from "react";

const activeColor = "#0D99FF";
const hintColor = "#AAA";
const TAB_BAR_BORDER_RADIUS = 15;
const TAB_BAR_MARGIN = 8;

const Tab = createBottomTabNavigator();

export default function ButtonNavBar() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let icon: ImageSourcePropType | undefined;

          switch (route.name) {
            case ScreenName.HOME:
              icon = require("../../../assets/icons/ic_home_tab.png");
              break;
            case ScreenName.CHAT:
              icon = require("../../../assets/icons/ic_chat_tag.png");
              break;
            case ScreenName.CREATE_CLASS:
              icon = require("../../../assets/icons/ic_plus.png");
              break;
            case ScreenName.PERSONAL_SCHEDULE:
              icon = require("../../../assets/icons/ic_file.png");
              break;
            case ScreenName.ACCOUNT:
              icon = require("../../../assets/icons/ic_account.png");
              break;
          }

          return (
            <View style={styles.iconContainer}>
              <Image source={icon} style={styles.icon} />
            </View>
          );
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: hintColor,
        tabBarStyle: {
          borderRadius: TAB_BAR_BORDER_RADIUS,
          margin: TAB_BAR_MARGIN,
        },
        title: "",
        headerShown: false,
      })}
    >
      <Tab.Screen name={ScreenName.HOME} component={HomeScreen} />
      <Tab.Screen
        name={ScreenName.CHAT}
        component={ChatScreen}
        options={{ tabBarBadge: 3 }}
      />
      <Tab.Screen
        name={ScreenName.CREATE_CLASS}
        component={CreateClassScreen}
      />
      <Tab.Screen
        name={ScreenName.PERSONAL_SCHEDULE}
        component={PersonalScheduleScreen}
      />
      <Tab.Screen name={ScreenName.ACCOUNT} component={AccountScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 10,
    // marginBottom: 10,
  },
  icon: {
    width: 24, // Chiều rộng của biểu tượng
    height: 24, // Chiều cao của biểu tượng
    borderRadius: 5,
  },
  iconName: {
    marginTop: 5,
    fontSize: 16,
    color: "#000", // Màu sắc của tên biểu tượng
  },
});
