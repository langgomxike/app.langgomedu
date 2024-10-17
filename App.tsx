import { useCallback, useState } from "react";
import languages from "./languages.json";
import {
  LanguageContext,
  Languages,
  LanguageType,
} from "./src/configs/LanguageConfig";
import { UserContext, UserDataType, UserType } from "./src/configs/UserContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ScreenName from "./src/constants/ScreenName";
import ButtonNavBar from "./src/views/components/ButtonNavBar";
import MessageScreen from "./src/views/screens/Message";
import ProfileScreen from "./src/views/screens/Profile";
import ClassDetail from "./src/views/screens/ClassDetail";
import { BackgroundColor } from "./src/configs/ColorConfig";
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
import AttendanceHistoryScreen from "./src/views/screens/AttendanceHistory";
import AttendanceForLearnerScreen from "./src/views/screens/AttendanceForLearner";
import AttendanceForTutorScreen from "./src/views/screens/AttendanceForTutor";
import ScannerScreen from "./src/views/screens/Scanner";
import LoginScreen from "./src/views/screens/Login";
import Register1Screen from "./src/views/screens/Register1";
import Register2Screen from "./src/views/screens/Register2";
import OTPScreen from "./src/views/screens/OTP";
import ChangePasswordScreen from "./src/views/screens/ChangePassword";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const Stack = createNativeStackNavigator();
const SCREEN_PADDING_TOP = 50;
const SCREEN_PADDING_HORIZONTAL = 0;

export default function App() {
  // states
  const [language, setLanguage] = useState<LanguageType>(languages.VN);
  const [user, setUser] = useState<UserDataType>({ ID: "089204010903", TYPE: UserType.TUTOR });

  // jxs
  return (
    <AppContext>
      <UserContext.Provider value={{user, setUser}}>
       <GestureHandlerRootView>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            title: "",
            contentStyle: {
              paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
              // paddingTop: SCREEN_PADDING_TOP,
              backgroundColor: BackgroundColor.white,
            },
          }}
        >
          <Stack.Screen name={ScreenName.NAV_BAR} component={ButtonNavBar} />
          <Stack.Screen name={ScreenName.MESSAGE} component={MessageScreen} />
          <Stack.Screen name={ScreenName.PROFILE} component={ProfileScreen} />
          <Stack.Screen name={ScreenName.SCANNER} component={ScannerScreen} />

          <Stack.Screen
            name={ScreenName.CLASS_LIST}
            component={ClassListScreen}
          />
          <Stack.Screen
            name={ScreenName.DETAIL_CLASS}
            component={ClassDetail}
          />
          <Stack.Screen name={ScreenName.RATING} component={RatingScreen} />

          <Stack.Screen
            name={ScreenName.ATTENDANCE_HISTORY}
            component={AttendanceHistoryScreen}
          />
          <Stack.Screen
            name={ScreenName.ATTENDED_FOR_LEARNER}
            component={AttendanceForLearnerScreen}
          />
          <Stack.Screen
            name={ScreenName.ATTENDED_FOR_TUTOR}
            component={AttendanceForTutorScreen}
          />

          <Stack.Screen name={ScreenName.CV_LIST} component={CVListScreen} />
          <Stack.Screen name={ScreenName.CV} component={CVScreen} />
          <Stack.Screen name={ScreenName.INPUT_CV} component={InputCVScreen} />

          {/* <Stack.Screen name={ScreenName.OTP} component={OTPScreen} /> */}
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

          <Stack.Screen
            name={ScreenName.HOME_ADMIN}
            component={HomeAdminScreen}
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
            name={ScreenName.CLASS_MANAGEMENT}
            component={ClassManagementScreen}
          />
          <Stack.Screen
            name={ScreenName.APPROVE_CLASS}
            component={ApproveClassScreen}
          />
          <Stack.Screen
            name={ScreenName.USER_MANAGEMENT}
            component={UserManagementScreen}
          />
          <Stack.Screen
            name={ScreenName.USER_REPORT_LIST}
            component={UserReportListScreen}
          />
          <Stack.Screen
            name={ScreenName.USER_REPORT_DETAIL}
            component={UserReportDetailScreen}
          />

          <Stack.Screen
            name={ScreenName.CV_APPROVAL}
            component={CVApprovalScreen}
          />
          <Stack.Screen
            name={ScreenName.CLASS_APPROVAL}
            component={ClassApprovalScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>

      {/* <LeanerAttendance></LeanerAttendance> */}
      {/* <TutorAttendance></TutorAttendance> */}
      {/* <LeanerAttendance></LeanerAttendance> */}
      {/* <History/> */}
      {/* <HoangTestScreen/> */}

      </GestureHandlerRootView>
      </UserContext.Provider>
    </AppContext>
  );
}