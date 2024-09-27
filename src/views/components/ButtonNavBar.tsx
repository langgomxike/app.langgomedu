import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ScreenName from "../../constants/ScreenName";
import HomeScreen from "../screens/Home";
import ChatScreen from "../screens/Chat";
import CreateClassScreen from "../screens/CreateClass";
import PersonalScheduleScreen from "../screens/PersonalSchedule";
import AccountScreen from "../screens/Account";

const activeColor = "#0D99FF";
const hintColor = "#AAA";
const TAB_BAR_BORDER_RADIUS = 15;
const TAB_BAR_MARGIN = 8;

const Tab = createBottomTabNavigator();

export default function ButtonNavBar() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // tabBarIcon: ({ focused, color, size }) => {
        //   let iconName;

        //   if (route.name === "Home") {
        //     iconName = focused
        //       ? "ios-information-circle"
        //       : "ios-information-circle-outline";
        //   } else if (route.name === "Settings") {
        //     iconName = focused ? "ios-list" : "ios-list-outline";
        //   }

        //   // You can return any component that you like here!
        //   return <Ionicons name={iconName} size={size} color={color} />;
        // },
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
