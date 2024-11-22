import { useCallback, useContext, useState } from "react";
import languages from "./languages.json";
import {
  LanguageContext,
  Languages,
  LanguageType,
} from "./src/configs/LanguageConfig";
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext, UserDataType, UserType } from "./src/configs/UserContext";
import { NavigationContainer, NavigationContext } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ScreenName from "./src/constants/ScreenName";
import ButtonNavBar from "./src/views/components/ButtonNavBar";
import MessageScreen from "./src/views/screens/Message";
import ProfileScreen from "./src/views/screens/Profile";
import ClassDetail from "./src/views/screens/ClassDetail";
import { BackgroundColor, TextColor } from "./src/configs/ColorConfig";
import CVListScreen from "./src/views/screens/CVList";
import SLog, { LogType } from "./src/services/SLog";
import SAsyncStorage, { AsyncStorageKeys } from "./src/services/SAsyncStorage";
import AppContext from "./src/configs/AppContext";
import CVScreen from "./src/views/screens/CV";
import InputCVScreen from "./src/views/screens/InputCV";
import HomeAdminScreen from "./src/views/screens/HomeAdmin";
import AppInfoManagementScreen from "./src/views/screens/AppInfoManagement";
import PermissionManagementScreen from "./src/views/screens/PermissionManagement";
import ClassManagementScreen from "./src/views/screens/ClassManagement";
import ApproveClassScreen from "./src/views/screens/ApproveClass";
import UserManagementScreen from "./src/views/screens/UserManagement";
import UserReportListScreen from "./src/views/screens/UserReportList";
import UserReportDetailScreen from "./src/views/screens/UserReportDetail";
import CVApprovalScreen from "./src/views/screens/CVApproval";
import ClassApprovalScreen from "./src/views/screens/ClassApproval";
import ClassListScreen from "./src/views/screens/ClassList";
import RatingScreen from "./src/views/screens/Rating";
import ScannerScreen from "./src/views/screens/Scanner";
import LoginScreen from "./src/views/screens/Login";
import Register1Screen from "./src/views/screens/Register1";
import Register2Screen from "./src/views/screens/Register2";
import OTPScreen from "./src/views/screens/OTP";
import ChangePasswordScreen from "./src/views/screens/ChangePassword";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import UserReportList from "./src/views/screens/admin/UserReportList";
import UserManager from "./src/views/screens/admin/UserManager";
import ClassManager from "./src/views/screens/admin/ClassManager";
import GeneralManager from "./src/views/screens/admin/GeneralManager";
import UpdateReportedUser from "./src/views/screens/admin/UpdateReportedUser";
import CreatAcountAdmin from "./src/views/screens/admin/CreatAccountAdmin";

import Information from "./src/views/screens/settings/Information";
import PersonalCV from "./src/views/screens/settings/PersonalCV";
import PersonalClasses from "./src/views/screens/settings/PersonalClasses";
import PersonalRatings from "./src/views/screens/settings/PersonalRatings";
import { Text, TouchableOpacity } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';
import LeanerAttendance from "./src/views/screens/attendance/LeanerAttendance";
import HistoryAttendance from "./src/views/screens/attendance/HistoryAttendance";
import TutorAttendance from "./src/views/screens/attendance/TutorAttendance";
import AdminHome from "./src/views/screens/admin/AdminHome";
import CreateReport from "./src/views/screens/CreateReport";


const Stack = createNativeStackNavigator();
const SCREEN_PADDING_TOP = 50;
const SCREEN_PADDING_HORIZONTAL = 0;

export default function App() {

  // states
  const [language, setLanguage] = useState<LanguageType>(languages.VN);
  const [user, setUser] = useState<UserDataType>({
    ID: "089204010903",
    TYPE: UserType.LEANER,
  });

  // jxs
  return (
    <AppContext>
      <UserContext.Provider value={{ user, setUser }}>
        <GestureHandlerRootView>
        <SafeAreaView style={{ flex: 1, backgroundColor: BackgroundColor.primary}}>
          <NavigationContainer>
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
                name={ScreenName.NAV_BAR}
                component={ButtonNavBar}
              />
              <Stack.Screen
                name={ScreenName.MESSAGE}
                component={MessageScreen}
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
                options={{
                  title: "Chi tiết lớp học",
                  headerShown: true,
                  contentStyle: {
                    padding: 0,
                  },
                  headerStyle: {
                    backgroundColor: BackgroundColor.primary,
                  },
                  headerTintColor: "#fff",
                }}
              />
              <Stack.Screen name={ScreenName.RATING} component={RatingScreen} />

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
                options={({ navigation }) => ({
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
                    <TouchableOpacity onPress={() => { navigation.navigate(ScreenName.INPUT_CV) }}>
                      <Octicons name="pencil" size={24} color="white" />
                    </TouchableOpacity>
                  )
                })} />
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

              <Stack.Screen name={ScreenName.OTP} component={OTPScreen} />
              <Stack.Screen name={ScreenName.LOGIN} component={LoginScreen} />
              <Stack.Screen
                name={ScreenName.REGISTER_1}
                component={Register1Screen}
              />
              <Stack.Screen
                name={ScreenName.REGISTER_2}
                component={Register2Screen}
              />
              <Stack.Screen
                name={ScreenName.CHANGE_PASSWORD}
                component={ChangePasswordScreen}
              />

            {/* ADMIN SCREENS */}
              <Stack.Screen
                name={ScreenName.HOME_ADMIN}
                component={AdminHome}
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
            {/* END ADMIN SCREENS */}



              <Stack.Screen
                name={ScreenName.APP_INFO_MANAGEMENT}
                component={AppInfoManagementScreen}
              />
              <Stack.Screen
                name={ScreenName.PERMISSION_MANAGEMENT}
                component={PermissionManagementScreen}
              />
              <Stack.Screen
                name={ScreenName.APPROVE_CLASS}
                component={ApproveClassScreen}
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
                name={ScreenName.CREATE_REPORT}
                component={CreateReport}
              />
                <Stack.Screen
                name={ScreenName.UPDATE_REPORT_USER}
                component={UpdateReportedUser}
              />
            </Stack.Navigator>
          </NavigationContainer> 

          {/* <LeanerAttendance></LeanerAttendance> */}
          {/* <TutorAttendance></TutorAttendance> */}
          {/* <LeanerAttendance></LeanerAttendance> */}
          {/* <History/> */}
          {/* <HoangTestScreen/> */}
          {/* <UserReportList/> */}
          {/* <ClassManager/> */}
          {/* <UserManager/> */}
          {/* <GeneralManager/> */}
        </SafeAreaView>
        </GestureHandlerRootView>
      </UserContext.Provider>
    </AppContext>
  );
}