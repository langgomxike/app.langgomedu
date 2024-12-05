import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import UserComponent from "../../components/admin/UserComponent";
import DetailUserButtomSheet from "../../components/bottom-sheet/DetailUserBottomSheet";
import Pagination from "../../components/Pagination";
import { BackgroundColor, TextColor } from "../../../configs/ColorConfig";
import TabHeader from "../../components/admin/TabHeader";
import Ionicons from '@expo/vector-icons/Ionicons';
import SearchBar from "../../components/Inputs/SearchBar";
import AUserAdmin from "../../../apis/admin/AUserAdmin";
import User from "../../../models/User";
import PaginationModal from "../../../models/Pagination";
import UserComponentSkeleton from "../../components/skeleton/UserComponentSkeleton";
import { NavigationContext } from "@react-navigation/native";
import ScreenName from "../../../constants/ScreenName";
import { USER_TAB } from "../../../constants/TabListAdmin";

const tabList = [
  { label: "Tất cả", value: USER_TAB.ALL },
  { label: "CV Chờ duyệt", value: USER_TAB.PENDING_APPROVAL },
  { label: "Bị báo cáo", value: USER_TAB.REPORTED },
  { label: "Bị cấm", value: USER_TAB.BANNED },
];

const PERPAGE = 5
export default function UserManager () {
  // context ----------------------------------------------------------------
  const navigation = useContext(NavigationContext);


  //state ----------------------------------------------------------------------
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [searchKey, setSearchKey] = useState("");
  const [debouncedSearchKey, setDebouncedSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>();
  const [selectedUser, setSelectedUser] = useState<User>(new User());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [page, setPage] = useState(1);
  const [paginations, setPaginations] = useState(new PaginationModal);
  

  // handlers
  // Hàm để mở BottomSheet từ component con
  const handleOpenBottomSheet = (user: User) => {
    if (activeTab === USER_TAB.PENDING_APPROVAL) {            
      navigation?.navigate(ScreenName.CV_APPROVAL, {cv_id: user.cv_id});
    }
    else {
      setIsVisible(true);
      setSelectedUser(user);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab); 
    setPage(1);
  };

  const fetchUsers = (tab: string, onComplete?: () => void) => {
    AUserAdmin.getAllUsers(debouncedSearchKey, tab, page, PERPAGE,
      (users, pagination) => {
        setUsers(users);
        setPaginations(pagination);
        onComplete?.();
      },
      setLoading
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUsers(activeTab, () => setIsRefreshing(false));
  };
  

  // effects ----------------------------------------------------------------
  useEffect(() => {
    // Đặt lại title của header khi màn hình được hiển thị
    if (navigation) {
      navigation.setOptions({
        title: "Quản lý người dùng",
        headerShown: true,
        contentStyle: {
          padding: 0,
        },
        headerStyle: {
          backgroundColor: BackgroundColor.primary,
        },
        headerTintColor: "#fff",
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        )
      });
    }
  }, [navigation]);
  
  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(() => {
      setDebouncedSearchKey(searchKey);
    }, 500);
  
    // Nếu searchKey thay đổi trước khi hết 500ms, xóa timeout cũ để tránh cập nhật
    return () => {
      clearTimeout(handler);
    };
  }, [searchKey]);

 // Mỗi khi debouncedSearchKey thay đổi, fetch dữ liệu mới
  useEffect(() => {
    setPage(1)
  }, [debouncedSearchKey]);

  useEffect(() => {
    setLoading(true);
    fetchUsers(activeTab, () => setLoading(false));
  }, [activeTab, page, debouncedSearchKey]);

  //render
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.searchHeader}>
          <SearchBar
            value={searchKey}
            onChangeText={setSearchKey}
            style={{ flex: 1 }}
          />
        </View>
        <TabHeader tabList={tabList} onTabChange={handleTabChange} />
      </View>
      <View style={styles.bodyContainer}>
        {loading && 
          <UserComponentSkeleton/>
        }
        {!loading &&
        <FlatList
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          data={users}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item: user }) => (
            <View
              style={[
                styles.userContainer,
                user.is_reported
                  ? [styles.boxshadowDanger, styles.borderDanger]
                  : styles.boxshadow,
              ]}
            >
              <TouchableOpacity onPress={() => handleOpenBottomSheet(user)}>
                <UserComponent
                  userData={user}
                />
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 90 }}
          refreshing={isRefreshing} 
          onRefresh={handleRefresh}
        />
        }
      </View>
      <View style={{ marginHorizontal: 10 }}>
        <View style={[styles.paginationContainer, styles.boxshadow]}>
          <Pagination
            totalPage={paginations.total_pages}
            currentPage={page}
            onChange={setPage}
          />
        </View>
      </View>
      <DetailUserButtomSheet
        userData={selectedUser}
        isVisible={isVisible}
        onCloseButtonSheet={() => setIsVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },

  headerContainer: {
    paddingVertical: 10,
  },

  bodyContainer: {
    paddingHorizontal: 10,
    flex: 1,
  },

  searchHeader: {
    flexDirection: "row",
    gap: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 10,
  },

  filterButton: {
    backgroundColor: BackgroundColor.white,
    borderRadius: 999,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  boxshadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  userContainer: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingTop: 15,
    paddingBottom: 25,
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  borderDanger: {
    borderColor: "#FF5050",
    borderWidth: 1,
  },

  boxshadowDanger: {
    shadowColor: "#FF5050",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  

  paginationContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    borderWidth: 1,
    borderColor: BackgroundColor.gray_e6,
    paddingVertical: 5,
    marginBottom: 10,
    borderRadius: 999,
    backgroundColor: BackgroundColor.white,
  },
});
