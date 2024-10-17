import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ScreenName from "../../constants/ScreenName";
import HomeScreen from "../screens/Home";
import ChatScreen from "../screens/Chat";
import CreateClassScreen from "../screens/CreateClass";
import PersonalScheduleScreen from "../screens/PersonalSchedule";
import AccountScreen from "../screens/Account";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";
import Ionicons from "@expo/vector-icons/Ionicons";

const activeColor = "#0D99FF";
const hintColor = "#AAA";
const TAB_BAR_BORDER_RADIUS = 15;
const TAB_BAR_MARGIN = 8;

const TAB_ICON_SIZE = 24;

const Tab = createBottomTabNavigator();

export default function ButtonNavBar() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let icon;

          switch (route.name) {
            case ScreenName.HOME:
              icon = (
                <Ionicons
                  name="home-sharp"
                  size={size}
                  style={styles.icon}
                  color={focused ? TextColor.sub_primary : TextColor.hint}
                />
              );
              break;
            case ScreenName.CHAT:
              icon = (
                <Ionicons
                  name="chatbubble-ellipses"
                  size={size}
                  style={styles.icon}
                  color={focused ? TextColor.sub_primary : TextColor.hint}
                />
              );
              break;
            case ScreenName.CREATE_CLASS:
              icon = (
                <Ionicons
                  name="add-circle"
                  size={size}
                  style={styles.icon}
                  color={focused ? TextColor.sub_primary : TextColor.hint}
                />
              );
              break;
            case ScreenName.PERSONAL_SCHEDULE:
              icon = (
                <Ionicons
                  name="calendar"
                  size={size}
                  style={styles.icon}
                  color={focused ? TextColor.sub_primary : TextColor.hint}
                />
              );
              break;
            case ScreenName.ACCOUNT:
              icon = (
                <Ionicons
                  name="person"
                  size={size}
                  style={styles.icon}
                  color={focused ? TextColor.sub_primary : TextColor.hint}
                />
              );
              break;
          }

          return <View style={styles.iconContainer}>{icon}</View>;
        },
        tabBarActiveTintColor: BackgroundColor.primary,
        tabBarInactiveTintColor: BackgroundColor.gray_10,
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
