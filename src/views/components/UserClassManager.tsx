import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, Pressable } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { BackgroundColor } from "../../configs/ColorConfig";
import ClassListSkeleton from "./skeleton/ClassListSkeleten";
import CourseItem from "./CourseItem";
import { NavigationContext } from "@react-navigation/native";
import { UserContext } from "../../configs/UserContext";
import ScreenName from "../../constants/ScreenName";
import Class from "../../models/Class";
import AClass from "../../apis/AClass";
import ReactAppUrl from "../../configs/ConfigUrl";

const TAB = {
  ATTENDING_CLASS: "attendingClass",
  TEACHING_CLASS: "teachingClass",
  PENDING_APPROVAL: "pendingApproval",
  CREATED_CLASS: "createdClass",
};

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const URL = ReactAppUrl.PUBLIC_URL
export default function UserClassManager() {
//contexts, refs
const navigation = useContext(NavigationContext);
const {user, setUser} = useContext(UserContext);
 const userId = "089204000003"
  // states
  const [activeTab, setActiveTab] = useState(TAB.ATTENDING_CLASS);
  const [loading, setLoading] = useState(false);
  const [classList, setclassList] = useState<Class[]>([]);

// handle
const handleNavigateToDetail = useCallback((classId: number) => {
  navigation?.navigate(ScreenName.DETAIL_CLASS, {classId});
}, []);

const handleTabChange = (selectedTab: string) => {
  setActiveTab(selectedTab);
  
  if (selectedTab === TAB.ATTENDING_CLASS) {
      // Lấy lớp học gợi ý
      // SFirebase.track(FirebaseNode.Classes, [], () => {
          AClass.getAttedingClass(
            userId,
            (data) => {
              setclassList(data);
            },
            setLoading
          );
        // });
  } else if (selectedTab === TAB.TEACHING_CLASS) {
    AClass.getTeachingClass(
      userId,
      (data) => {
        setclassList(data);
      },
      setLoading
    );
  }
  else if(selectedTab === TAB.PENDING_APPROVAL) {

  }
  else if(selectedTab === TAB.CREATED_CLASS) {
    AClass.getCreatedClass(
      userId,
      (data) => {
        setclassList(data);
      },
      setLoading
    );
  }
};

useEffect(() => {
  AClass.getAttedingClass(userId,
    (data) => {
      setclassList(data);
    },
    setLoading
  );
}, [])

  return (
    <View style={styles.container}>
      <View style={styles.headerNav}>
        <View style={[styles.headerItem]}>
          <TouchableOpacity onPress={() => handleTabChange(TAB.ATTENDING_CLASS)}>
            <Text
              style={[
                styles.headerText,
                activeTab === TAB.ATTENDING_CLASS && styles.headerTextActive,
              ]}
            >
              Lớp đang học
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.headerItem]}>
          <TouchableOpacity onPress={() => handleTabChange(TAB.TEACHING_CLASS)}>
            <Text
              style={[
                styles.headerText,
                activeTab === TAB.TEACHING_CLASS && styles.headerTextActive,
              ]}
            >
              Lớp đang dạy
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.headerItem]}>
          <TouchableOpacity onPress={() => handleTabChange(TAB.PENDING_APPROVAL)}>
            <Text
              style={[
                styles.headerText,
                activeTab === TAB.PENDING_APPROVAL && styles.headerTextActive,
              ]}
            >
              Lớp chờ duyệt
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.headerItem]}>
          <TouchableOpacity onPress={() => handleTabChange(TAB.CREATED_CLASS)}>
            <Text
              style={[
                styles.headerText,
                activeTab === TAB.CREATED_CLASS && styles.headerTextActive,
              ]}
            >
              Lớp đã tạo
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {(loading && <ClassListSkeleton />) || (
        <FlatList
          data={classList}
          renderItem={({ item: classItem }) => {
            return (
              <View style={styles.classItem}>
                <Pressable
                  onPress={() => handleNavigateToDetail(classItem.id)}
                >
                  <CourseItem
                  classData={classItem}
                  />
                </Pressable>
              </View>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.classList,
            classList.length === 1 && styles.centeredItem,
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },

  headerNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginHorizontal: 50
    borderBottomColor: BackgroundColor.gray_c9,
    borderBottomWidth: 1,
  },

  headerItem: {
    flex: 1,
    alignItems: "center",
    gap: 10,
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
});
