import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  NavigationContext,
  NavigationRouteContext,
} from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { UpdateClassRoute } from "../../configs/NavigationRouteTypeConfig";
import Class from "../../models/Class";
import { LanguageContext } from "../../configs/LanguageConfig";
import { BackgroundColor } from "../../configs/ColorConfig";
import { AccountContext } from "../../configs/AccountConfig";
import { RoleList } from "../../models/Role";
import UpdateLearnerClass from "../components/UpdateClass/UpdateLearnerClass";
import UpdateTutorClass from "../components/UpdateClass/UpdateTurtorClass";

export default function UpdateClass() {
  // route, context
  const route = useContext(NavigationRouteContext);
  const param = (route?.params as UpdateClassRoute) || new Class();
  // console.log(param.classData);

  const navigation = useContext(NavigationContext);
  const languageContext = useContext(LanguageContext).language;
  const accountContext = useContext(AccountContext); // lay duoc acount
  const roleIds = accountContext.account?.roles?.map((role) => role.id);

  // state
  const [classData, setClassData] = useState<Class>(new Class());

  // handle
  console.log("member in class: ", param.members);

  // effect
  useEffect(() => {
    if (navigation) {
      navigation.setOptions({
        title: languageContext.UPDATE_CLASS,
        headerShown: true,
        contentStyle: {
          padding: 0,
        },
        headerStyle: {
          backgroundColor: BackgroundColor.primary,
        },
        headerTintColor: "#fff",
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ paddingRight: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation]);

  useEffect(() => {
    setClassData(param.classData);
  }, [param.classData]);

  // render
  if (!param.classData) {
    return <Text>Không có dữ liệu lớp học.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {roleIds?.includes(RoleList.TUTOR) && <UpdateTutorClass/> }
      {roleIds?.includes(RoleList.PARENT) && <UpdateLearnerClass/>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Đảm bảo chiếm đủ không gian
    paddingBottom: 250,
  },
});
