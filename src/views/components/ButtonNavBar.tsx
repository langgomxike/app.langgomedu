import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import ScreenName from "../../constants/ScreenName";
import HomeScreen from "../screens/Home";
import ChatScreen from "../screens/Chat";
import CreateClassScreen from "../screens/CreateClass";
import PersonalScheduleScreen from "../screens/PersonalSchedule";
import AccountScreen from "../screens/Account";
import {StyleSheet, View} from "react-native";
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useContext, useEffect, useState} from "react";
import {AccountContext} from "../../configs/AccountConfig";
import SFirebase, {FirebaseNode} from "../../services/SFirebase";
import AMessage from "../../apis/AMessage";
import Message from "../../models/Message";
import {ChatTabContext} from "../../configs/AppContext";
import AUser from "../../apis/AUser";
import User from "../../models/User";
import APermission from "../../apis/APermission";
import SLog, {LogType} from "../../services/SLog";
import AMajor from "../../apis/AMajor";
import AClassLevel from "../../apis/AClassLevel";

const TAB_BAR_BORDER_RADIUS = 20;
const TAB_BAR_MARGIN = 8;
const TAB_ICON_SIZE = 24;

const Tab = createBottomTabNavigator();

export default function ButtonNavBar() {
  //contexts
  const accountContext = useContext(AccountContext);

  //states
  const [hasNoti, setHasNoti] = useState(0);
  const [hasNewMessages, setHasNewMessages] = useState(0);
  const [hasNewClassMessages, setHasNewClassMessages] = useState(0);

  useEffect(() => {
    SFirebase.track(FirebaseNode.Notifications, [{
      key: FirebaseNode.UserId,
      value: accountContext.account?.id ?? "-1"
    }], () => {
      AMessage.getNotificationsOfUser((notis: Message[]) => {
        setHasNoti(notis.filter(n => !n.as_read).length);
      });
    });
  }, [accountContext.account]);

  useEffect(() => {
    SFirebase.track(FirebaseNode.Messages, [], () => {
      AMessage.getChatsOfUser((inboxes) => {
        setHasNewMessages(inboxes.map(i => i.newest_message).filter(m => !m?.as_read && accountContext.account?.id !== m?.sender?.id).length);
      });
    });
  }, []);

  useEffect(() => {
    SFirebase.track(FirebaseNode.Messages, [], () => {
      AMessage.getClassChatsOfUser((inboxes) => {
        setHasNewClassMessages(inboxes.map(i => i.newest_message).filter(m => m?.created_at && !m?.as_read && accountContext.account?.id !== m?.sender?.id).length);
      });
    });
  }, []);

  useEffect(() => {
    if (!accountContext.account || !accountContext.setAccount) return;

    SFirebase.track(FirebaseNode.Users, [{key: FirebaseNode.Id, value: accountContext.account.id}], () => {
      if (!accountContext.account || !accountContext.setAccount) return;

      //track address
      SFirebase.track(FirebaseNode.Addresses, [], () => {
        if (!accountContext.account || !accountContext.setAccount) return;

        AUser.getUserAddress(accountContext.account.id, address => {
          const user: User = {...accountContext.account} as User;
          user.address = address;

          accountContext.setAccount && accountContext.setAccount(user);
        });
      });

      //track interested majors
      SFirebase.track(FirebaseNode.InterestedMajors, [], () => {
        if (!accountContext.account || !accountContext.setAccount) return;

        AMajor.getInterestedMajors(accountContext.account.id, majors => {
          const user: User = {...accountContext.account} as User;
          user.interested_majors = majors;

          accountContext.setAccount && accountContext.setAccount(user);
        });
      });

      //track interested class levels
      SFirebase.track(FirebaseNode.InterestedClassLevels, [], () => {
        if (!accountContext.account || !accountContext.setAccount) return;

        AClassLevel.getInterestedClassLevels(accountContext.account.id, classLevels => {
          const user: User = {...accountContext.account} as User;
          user.interested_class_levels = classLevels;

          accountContext.setAccount && accountContext.setAccount(user);
        });
      });
    });
  }, [accountContext.account?.id]);

  useEffect(() => {
    if (!accountContext.account || !accountContext.setAccount) return;

    SFirebase.track(FirebaseNode.Roles, [], () => {
      SFirebase.track(FirebaseNode.Permissions, [], () => {
        if (!accountContext.account || !accountContext.setAccount) return;

        APermission.getPermissionsOfUser(accountContext.account, (permissions) => {
          if (!accountContext.account || !accountContext.setAccount) return;


          const user: User = {...accountContext.account};
          user.permissions = permissions;

          accountContext.setAccount(user);
          SLog.log(LogType.Info, "update permissions", "reload", user.permissions.length);
        }, () => {
        });
      });
    });

  }, [accountContext.account?.permissions?.map(p => p.id).sort((a, b) => a - b).toString()]);

  useEffect(() => {
    SLog.log(LogType.Info, "check account", "", accountContext.account);
  }, [JSON.stringify(accountContext.account)]);

  return (
    <ChatTabContext.Provider value={[hasNoti, hasNewClassMessages, hasNewMessages]}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
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
                    size={size + 30}
                    style={[styles.icon, {width: 60, height: 60, top: -5, left: 5}]}
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
          tabBarInactiveTintColor: TextColor.primary,
          tabBarStyle: {
            borderRadius: TAB_BAR_BORDER_RADIUS,
            margin: TAB_BAR_MARGIN,
            position: "absolute",
          },
          title: "",
          headerShown: false,
        })}
      >
        <Tab.Screen name={ScreenName.HOME} component={HomeScreen}/>

        <Tab.Screen
          name={ScreenName.CHAT}
          component={ChatScreen}
          options={(hasNoti + hasNewMessages > 0) && {
            tabBarBadge: hasNoti + hasNewMessages + hasNewClassMessages > 9 ? "9+" : hasNoti + hasNewMessages + hasNewClassMessages,
            tabBarBadgeStyle: styles.badge
          } || {}}
        />

        <Tab.Screen
          name={ScreenName.CREATE_CLASS}
          component={CreateClassScreen}
        />
        <Tab.Screen
          name={ScreenName.PERSONAL_SCHEDULE}
          component={PersonalScheduleScreen}
        />
        <Tab.Screen name={ScreenName.ACCOUNT} component={AccountScreen}/>
      </Tab.Navigator>
    </ChatTabContext.Provider>
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

  badge: {
    top: 5,
    left: 5,
    minHeight: 18,
    maxHeight: 18,
    minWidth: 18,
    maxWidth: 18,
    fontSize: 9,
    padding: 0,
    paddingBottom: 2,
    margin: 0,
    flex: 0,
    right: 20,
    textAlign: "center",
    textAlignVertical: "center",
    backgroundColor: BackgroundColor.danger,
  }
});
