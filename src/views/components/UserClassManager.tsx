import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BackgroundColor } from "../../configs/ColorConfig";
import ClassListSkeleton from "./skeleton/ClassListSkeleten";
import CourseItem from "./CourseItem";
import { NavigationContext } from "@react-navigation/native";
import ScreenName from "../../constants/ScreenName";
import Class from "../../models/Class";
import AClass from "../../apis/AClass";
import ReactAppUrl from "../../configs/ConfigUrl";
import { AccountContext } from "../../configs/AccountConfig";
import { ScrollView } from "react-native-gesture-handler";
import { UserContext } from "../../configs/UserContext";

const TAB = {
  ATTENDING_CLASS: "attendingClass",
  TEACHING_CLASS: "teachingClass",
  PENDING_APPROVAL: "pendingApproval",
  CREATED_CLASS: "createdClass",
};

const tabs = [
  { label: "Lớp đang học", value: TAB.ATTENDING_CLASS },
  { label: "Lớp đang dạy", value: TAB.TEACHING_CLASS },
  { label: "Lớp chờ duyệt", value: TAB.PENDING_APPROVAL },
  { label: "Lớp đã tạo", value: TAB.CREATED_CLASS },
];

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const URL = ReactAppUrl.PUBLIC_URL;
export default function UserClassManager() {
  //contexts, refs
  const navigation = useContext(NavigationContext);
  const account = useContext(AccountContext).account;
  const {refresh, setRefresh} = useContext(UserContext);
  // states
  const [activeTab, setActiveTab] = useState(TAB.ATTENDING_CLASS);
  const [loading, setLoading] = useState(false);
  const [classList, setclassList] = useState<Class[]>([]);
  const [filteredClassList, setFilteredClassList] = useState<Class[]>([]);

  // handle
  const handleNavigateToDetail = useCallback((classId: number) => {
    navigation?.navigate(ScreenName.DETAIL_CLASS, { classId });
  }, []);

  const filterClassesByTab = (selectedTab: string): Class[] => {
    if (!account) return [];
    switch (selectedTab) {
      case TAB.ATTENDING_CLASS:
        return classList.filter(
          (cls) => cls.author?.id !== account.id && cls.tutor?.id !== account.id
        );
      case TAB.TEACHING_CLASS:
        return classList.filter((cls) => cls.tutor?.id === account.id);
      case TAB.PENDING_APPROVAL:
        return classList.filter((cls) => cls.admin_accepted === false);
      case TAB.CREATED_CLASS:
        return classList.filter((cls) => cls.author?.id === account.id);
      default:
        return [];
    }
  };

  const handleTabChange = (selectedTab: string) => {
    setActiveTab(selectedTab);
    const filteredClasses = filterClassesByTab(selectedTab);
    setFilteredClassList(filteredClasses);
  };
  
  useEffect(() => {
    if (account) {
      AClass.getCLassesByUserId(
        account.id,
        (data) => {
          setclassList(data);
          setFilteredClassList(data.filter((cls) => cls.author?.id !== account.id && cls.tutor?.id !== account.id))
          setRefresh(false);
        },
        setLoading
      );
    }
  }, [refresh]);

  return (
    <View style={styles.container}>
      <View style={styles.headerNavList}>
        <FlatList
          data={tabs}
          keyExtractor={(item) => item.value.toString()}
          horizontal // Nếu muốn danh sách ngang
          renderItem={({ item }) => (
            <View style={styles.headerItem}>
              <TouchableOpacity onPress={() => handleTabChange(item.value)}>
                <Text
                  style={[
                    styles.headerText,
                    activeTab === item.value && styles.headerTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {(loading && <ClassListSkeleton />) || (
        <FlatList
          data={filteredClassList}
          renderItem={({ item: classItem }) => {
            return (
              <View style={styles.classItem}>
                <Pressable onPress={() => handleNavigateToDetail(classItem.id)}>
                  <CourseItem classData={classItem} />
                </Pressable>
              </View>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.classList,
            filteredClassList.length === 1 && styles.centeredItem,
          ]}
        />
      )}

      {filteredClassList.length === 0 &&
      <View style={[styles.emptyContainer]}>
        <Image
          source={require("../../../assets/images/ic_empty.png")}
          style={[styles.emptyImage]}
        />
        <Text style={styles.emptyText}>Không có lớp học đang học</Text>
      </View>
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },

  headerNavList: {
    flexDirection: "row",
    borderBottomColor: BackgroundColor.gray_c9,
    borderBottomWidth: 1,
  },

  headerItem: {
    flex: 1,
    alignItems: "center",
    gap: 20,
  },

  headerText: {
    fontWeight: "bold",
    color: "#888",
    padding: 10,
    textAlign: "center",
  },

  headerTextActive: {
    color: BackgroundColor.primary,
  },

  itemLineActive: {
    height: 3,
    width: "100%",
    borderRadius: 10,
    backgroundColor: BackgroundColor.primary,
  },

  classItem: {
    padding: 10,
    width: SCREEN_WIDTH * 0.8,
  },

  classList: {
    paddingBottom: 10,
    paddingHorizontal: 10,
  },

  centeredItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyContainer: {
    marginVertical: 20,
    padding: 50,
    alignItems: "center",
    backgroundColor: "#fff",
  },

  emptyImage: {
    width: SCREEN_WIDTH * 0.18,
    height: SCREEN_WIDTH * 0.18,
    backgroundColor: "#fff",
  },
  emptyText: {
    marginTop: 20,
    color: "#888",
    fontWeight: "500",
  },

  boxshadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0,height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
});