import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ClassComponent from "../../components/admin/ClassComponent";
import Pagination from "../../components/Pagination";
import DetailClassBottomSheet from "../../components/bottom-sheet/DetailClassBottomSheet";
import { BackgroundColor } from "../../../configs/ColorConfig";
import TabHeader from "../../components/admin/TabHeader";
import SearchBar from "../../components/Inputs/SearchBar";
import Feather from "@expo/vector-icons/Feather";
import Class from "../../../models/Class";
import AClassAdmin from "../../../apis/admin/AClassAdmin";

const tabList = ["Tất cả", "Chờ duyệt", "Đang hoạt động", "Bị báo cáo"];
export default function ClassManager() {
  //states
  const [isVisible, setIsVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [searchKey, setSearchKey] = useState("");
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class>()

  // handlers
  // Hàm để mở BottomSheet từ component con
  const handleOpenBottomSheet = (_class:Class) => {
    setIsVisible(true);
    setSelectedClass(_class)
  };

  // effects
  useEffect(() => {
    AClassAdmin.getAllClasses((data) => {
      setClasses(data);
    }, setLoading)
   
  }, [])
  

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
      <View style={[styles.classListContainer, { flex: 1 }]}>
        <FlatList
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          data={classes}
          renderItem={({ item }) => {
            return (
            <View style={[styles.classItemContainer, styles.boxshadow]}>
              <TouchableOpacity onPress={() => handleOpenBottomSheet(item)}>
                <ClassComponent classData={item}/>
              </TouchableOpacity>
            </View>
            )
          }}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 90}}
        />
      </View>

      <View style={{marginHorizontal: 10}}>
        <View style={[styles.paginationContainer, styles.boxshadow]}>
          <Pagination
            totalPage={5}
            currentPage={1}
            onChange={() => setPage(page + 1)}
          />
        </View>
      </View>

      <DetailClassBottomSheet
        isVisible={isVisible}
        onCloseButtonSheet={() => setIsVisible(false)}
        classData = {selectedClass}
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

  classListContainer: {
    marginHorizontal: 10,

  },

  classItemContainer: {
    marginTop: 20,
    backgroundColor: BackgroundColor.white,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
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
