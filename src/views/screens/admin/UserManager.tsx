import React, { useEffect, useRef, useState } from "react";
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
import Feather from "@expo/vector-icons/Feather";
import SearchBar from "../../components/Inputs/SearchBar";
import AUserAdmin from "../../../apis/admin/AUserAdmin";
import User from "../../../models/User";


const tabList: string[] = [
  "Tất cả",
  "Chờ duyệt",
  "Đang hoạt động",
  "Bị báo cáo",
  "Bị cấm",
];

export default function () {
  //state
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState("Tất cả");
  const [page, setPage] = useState(0);
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>();
  const [selectedUser, setSelectedUser] = useState<User>(new User()); 

  // handlers
  // Hàm để mở BottomSheet từ component con
  const handleOpenBottomSheet = (user:User) => {
    setIsVisible(true);
    setSelectedUser(user)
  };

  // effects 
  useEffect(() => {
    AUserAdmin.getAllUsers(
      (data) => {
        setUsers(data);
    }, setLoading)
  }, [])

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
          <TouchableOpacity style={[styles.filterButton, styles.boxshadow]}>
            <Feather name="filter" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <TabHeader tabList={tabList} />
      </View>
      <View style={styles.bodyContainer}>
        <FlatList
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          data={users}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item:user }) => (
            <UserComponent userData={user} onPressOpenSheet={() => handleOpenBottomSheet(user)} />
          )}
          contentContainerStyle={{ paddingHorizontal: 10 , paddingBottom: 90}}
        />
      </View>
      <View style={{ marginHorizontal: 10 }}>
        <View style={[styles.paginationContainer, styles.boxshadow]}>
          <Pagination
            totalPage={5}
            currentPage={1}
            onChange={() => setPage(page + 1)}
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
    marginTop: 40,
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
