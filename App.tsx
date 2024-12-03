import {createRef, useContext, useEffect} from "react";
// @ts-ignore
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer, NavigationContainerRef, ParamListBase} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import ScreenName from "./src/constants/ScreenName";
import ButtonNavBar from "./src/views/components/ButtonNavBar";
import MessageScreen from "./src/views/screens/Message";
import ProfileScreen from "./src/views/screens/Profile";
import ClassDetail from "./src/views/screens/ClassDetail";
import {BackgroundColor, TextColor} from "./src/configs/ColorConfig";
import CVListScreen from "./src/views/screens/CVList";
import AppContext from "./src/configs/AppContext";
import CVScreen from "./src/views/screens/CV";
import InputCVScreen from "./src/views/screens/InputCV";
import AppInfoManagementScreen from "./src/views/screens/admin/AppInfoManagement";
import PermissionManagementScreen from "./src/views/screens/admin/PermissionManagement";
import CVApprovalScreen from "./src/views/screens/admin/CVApproval";
import ClassApprovalScreen from "./src/views/screens/admin/ClassApproval";
import ClassListScreen from "./src/views/screens/ClassList";
import RatingScreen from "./src/views/screens/Rating";
import ScannerScreen from "./src/views/screens/Scanner";
import LoginScreen from "./src/views/screens/Login";
import Register1Screen from "./src/views/screens/Register1";
import Register2Screen from "./src/views/screens/Register2";
import OTPScreen from "./src/views/screens/OTP";
import ChangePasswordScreen from "./src/views/screens/ChangePassword";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import UserReportList from "./src/views/screens/admin/UserReportList";
import UserManager from "./src/views/screens/admin/UserManager";
import ClassManager from "./src/views/screens/admin/ClassManager";
import GeneralManager from "./src/views/screens/admin/GeneralManager";
import CreatAcountAdmin from "./src/views/screens/admin/CreatAccountAdmin";
import PersonalCV from "./src/views/screens/settings/PersonalCV";
import {PermissionsAndroid, TouchableOpacity} from "react-native";
import Octicons from '@expo/vector-icons/Octicons';
import LeanerAttendance from "./src/views/screens/attendance/LeanerAttendance";
import HistoryAttendance from "./src/views/screens/attendance/HistoryAttendance";
import TutorAttendance from "./src/views/screens/attendance/TutorAttendance";
import AdminHome from "./src/views/screens/admin/AdminHome";
import SFirebase, {FirebaseNode} from "./src/services/SFirebase";
import AccountScreen from "./src/views/screens/Account";
import WelcomeScreen from "./src/views/screens/Welcome";
import GroupMessageScreen from "./src/views/screens/GroupMessage";
import CreateReport from "./src/views/screens/CreateReport";
import UserPermissionManagementScreen from "./src/views/screens/admin/UserPermissionManagement";
import RegisterChildScreen from "./src/views/screens/RegisterChild";
import UpdateClass from "./src/views/screens/UpdateClass";
import ResetPasswordScreen from "./src/views/screens/ResetPassword";
import UpdateReportedUser from "./src/views/screens/admin/UpdateReportedUser";

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const Stack = createNativeStackNavigator();

export const navigationRef = createRef<NavigationContainerRef<ParamListBase>>();

export default function App() {
  // jxs
  return (
    <AppContext>
      <GestureHandlerRootView>
        <SafeAreaView style={{flex: 1, backgroundColor: BackgroundColor.primary}}>
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                title: "",
                contentStyle: {
                  backgroundColor: BackgroundColor.white,
                },
              }}
            >
              <Stack.Screen
                name={ScreenName.WELCOME}
                component={WelcomeScreen}
              />

              <Stack.Screen
                name={ScreenName.NAV_BAR}
                component={ButtonNavBar}
              />

              <Stack.Screen
                name={ScreenName.MESSAGE}
                component={MessageScreen}
              />

              <Stack.Screen
                name={ScreenName.GROUP_MESSAGE}
                component={GroupMessageScreen}
              />

              <Stack.Screen
                name={ScreenName.PROFILE}
                component={ProfileScreen}
              />
              <Stack.Screen
                name={ScreenName.SCANNER}
                component={ScannerScreen}
              />

              <Stack.Screen
                name={ScreenName.CLASS_LIST}
                component={ClassListScreen}
              />
              <Stack.Screen
                name={ScreenName.DETAIL_CLASS}
                component={ClassDetail}
              />
              <Stack.Screen
                name={ScreenName.UPDATE_CLASS}
                component={UpdateClass}
              />
              <Stack.Screen name={ScreenName.RATING} component={RatingScreen}/>

              <Stack.Screen
                name={ScreenName.ATTENDANCE_HISTORY}
                component={HistoryAttendance}
              />
              <Stack.Screen
                name={ScreenName.ATTENDED_FOR_LEARNER}
                component={LeanerAttendance}
              />
              <Stack.Screen
                name={ScreenName.ATTENDED_FOR_TUTOR}
                component={TutorAttendance}
              />

              <Stack.Screen
                name={ScreenName.CV_LIST}
                component={CVListScreen}
              />
              <Stack.Screen
                name={ScreenName.SETTING_PERSONAL_CV}
                component={PersonalCV}
                options={({navigation}) => ({
                  headerShown: true,
                  contentStyle: {
                    paddingHorizontal: 0,
                    paddingTop: 0,
                    backgroundColor: BackgroundColor.primary,
                  },
                  headerStyle: {
                    backgroundColor: BackgroundColor.primary,
                  },
                  headerTintColor: TextColor.white,
                  headerRight: () => (
                    <TouchableOpacity onPress={() => {
                      navigation.navigate(ScreenName.INPUT_CV)
                    }}>
                      <Octicons name="pencil" size={24} color="white"/>
                    </TouchableOpacity>
                  )
                })}/>

              <Stack.Screen
                name={ScreenName.INPUT_CV}
                component={InputCVScreen}
                options={() => ({
                  headerShown: true,
                  contentStyle: {
                    paddingHorizontal: 0,
                    paddingTop: 0,
                  }
                })}
              />
              <Stack.Screen
                name={ScreenName.CV}
                component={CVScreen}
              />

              <Stack.Screen name={ScreenName.OTP} component={OTPScreen}/>
              <Stack.Screen name={ScreenName.LOGIN} component={LoginScreen}/>
              <Stack.Screen
                name={ScreenName.REGISTER_STEP_1}
                component={Register1Screen}
              />

              <Stack.Screen
                name={ScreenName.REGISTER_STEP_2}
                component={Register2Screen}
              />

              <Stack.Screen
                name={ScreenName.REGISTER_STEP_CHILD}
                component={RegisterChildScreen}
              />

              <Stack.Screen
                name={ScreenName.CHANGE_PASSWORD}
                component={ChangePasswordScreen}
              />

              <Stack.Screen
                name={ScreenName.RESET_PASSWORD}
                component={ResetPasswordScreen}
              />

              {/* ADMIN SCREENS */}
              <Stack.Screen
                name={ScreenName.HOME_ADMIN}
                component={AdminHome}
              />

              <Stack.Screen
                name={ScreenName.GENERAL_MANAGER}
                component={GeneralManager}
              />

              <Stack.Screen
                name={ScreenName.CLASS_MANAGEMENT}
                component={ClassManager}
              />
              <Stack.Screen
                name={ScreenName.USER_MANAGEMENT}
                component={UserManager}
              />
              <Stack.Screen
                name={ScreenName.USER_REPORT_LIST}
                component={UserReportList}
              />

              <Stack.Screen
                name={ScreenName.CREATE_ACCOUNT_ADMIN}
                component={CreatAcountAdmin}
              />

              <Stack.Screen
                name={ScreenName.CREATE_REPORT}
                component={CreateReport}
              />

              <Stack.Screen
                name={ScreenName.APP_INFO_MANAGEMENT}
                component={AppInfoManagementScreen}
              />

              <Stack.Screen
                name={ScreenName.PERMISSION_MANAGEMENT}
                component={PermissionManagementScreen}
              />

              <Stack.Screen
                name={ScreenName.USER_PERMISSION_MANAGEMENT}
                component={UserPermissionManagementScreen}
              />

              <Stack.Screen
                name={ScreenName.CV_APPROVAL}
                component={CVApprovalScreen}
              />
              <Stack.Screen
                name={ScreenName.CLASS_APPROVAL}
                component={ClassApprovalScreen}
              />

              <Stack.Screen
                name={ScreenName.UPDATE_REPORT_USER}
                component={UpdateReportedUser}
              />

              <Stack.Screen
                name={ScreenName.SETTING_INFO_PERSONAL}
                component={AccountScreen}
                options={{
                  headerShown: true,
                  title: "",
                  headerStyle: {backgroundColor: BackgroundColor.primary}
                }}
              />
              {/* END ADMIN SCREENS */}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </GestureHandlerRootView>
    </AppContext>
  );
}