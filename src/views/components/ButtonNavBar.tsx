import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ScreenName from "../../constants/ScreenName";
import HomeScreen from "../screens/Home";
import ChatScreen from "../screens/Chat";
import CreateClassScreen from "../screens/CreateClass";
import PersonalScheduleScreen from "../screens/PersonalSchedule";
import AccountScreen from "../screens/Account";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";
import { AntDesign, Feather } from '@expo/vector-icons';

const activeColor = "#0D99FF";
const hintColor = "#AAA";
const TAB_BAR_BORDER_RADIUS = 20;
const TAB_BAR_MARGIN = 8;

const TAB_ICON_SIZE = 24;

const Tab = createBottomTabNavigator();


type AntDesignIconName = React.ComponentProps<typeof AntDesign>['name'];
type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

export default function ButtonNavBar() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let icon: ImageSourcePropType | undefined;
          let iconType: 'ant' | 'feather' | undefined;
          let iconName: AntDesignIconName | FeatherIconName | undefined;
          switch (route.name) {
            case ScreenName.HOME:
              iconType = 'ant';
              iconName = 'home';
              // icon = focused
              // ? require('../../../assets/icons/home-tab-active.png')
              // : require('../../../assets/icons/ic_home_tab.png');
            iconType = 'ant';
            iconName = 'home';
            break;
            case ScreenName.CHAT:
              // iconType = 'ant';
              // iconName = 'message1';
              icon = require(`../../../assets/icons/ic_chatbox.png`);
              if (focused) {
                icon = require(`../../../assets/icons/chat-tab-active.png`);
              }
              break;
            case ScreenName.CREATE_CLASS:
              icon = require(`../../../assets/icons/ic_plus.png`);
              if (focused) {
                icon = require(`../../../assets/icons/ic_plus.png`);
              }
              break;
            case ScreenName.PERSONAL_SCHEDULE:
              iconType = 'ant';
              iconName = 'calendar';
              // icon = require(`../../../assets/icons/ic_calendar_outline.png`);
              // if (focused) {
              //   icon = require(`../../../assets/icons/ic_calendar_outline-active.png`);
              // }
              break;
            case ScreenName.ACCOUNT:
              iconType = 'feather';
              iconName = 'user';
              // icon = require(`../../../assets/icons/ic_account.png`);
              // if (focused) {
              //   icon = require(`../../../assets/icons/account_tab-active.png`);
              // }
              break;
          }

          // Gán component vào biến `iconComponent` dựa trên điều kiện
          const iconComponent = icon ? (
            <Image source={icon} style={styles.icon} />
          ) : iconType === 'ant' ? (
            <AntDesign name={iconName as AntDesignIconName}  size={size} color={color} />
          ) : (
            <Feather name={iconName as FeatherIconName} size={size} color={color} />
          );

          return (
            <View style={styles.iconContainer}>
              {iconComponent}
              {/* <Image source={icon} style={styles.icon} /> */}
            </View>
          );
        },
        tabBarActiveTintColor: BackgroundColor.primary,
        tabBarInactiveTintColor: "#737373",
        tabBarStyle: {
          borderRadius: TAB_BAR_BORDER_RADIUS,
          margin: TAB_BAR_MARGIN,
          position: "absolute",
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
  },
  icon: {
    width: TAB_ICON_SIZE, // Chiều rộng của biểu tượng
    height: TAB_ICON_SIZE, // Chiều cao của biểu tượng
    borderRadius: 5,
  },
  iconName: {
    marginTop: 5,
    fontSize: 16,
    color: TextColor.black, // Màu sắc của tên biểu tượng
  },
});
