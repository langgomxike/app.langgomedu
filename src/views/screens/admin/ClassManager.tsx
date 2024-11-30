import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {useCallback, useContext, useEffect, useState} from "react";
import ClassComponent from "../../components/admin/ClassComponent";
import Pagination from "../../components/Pagination";
import DetailClassBottomSheet from "../../components/bottom-sheet/DetailClassBottomSheet";
import { BackgroundColor } from "../../../configs/ColorConfig";
import TabHeader from "../../components/admin/TabHeader";
import SearchBar from "../../components/Inputs/SearchBar";
import Ionicons from '@expo/vector-icons/Ionicons';
import Class from "../../../models/Class";
import AClassAdmin from "../../../apis/admin/AClassAdmin";
import ClassComponentSkeleton from "../../components/skeleton/ClassComponentSkeleton";
import PaginationModal from "../../../models/Pagination";
import BackLayout from "../../layouts/Back";
import { NavigationContext } from "@react-navigation/native";
import { CLASS_TAB } from "../../../constants/TabListAdmin";

const tabList = [
  { label: "Tất cả", value: CLASS_TAB.ALL },
  { label: "Lớp chờ duyệt", value: CLASS_TAB.PENDING_APPROVAL },
  { label: "Lớp chờ thanh toán", value: CLASS_TAB.PENDING_PAY },
  { label: "Bị báo cáo", value: CLASS_TAB.REPORTED },
];

const PERPAGE = 10;
export default function ClassManager() {

  // context ----------------------------------------------------------------
  const navigation = useContext(NavigationContext);

  //states ---------------------------------------------------------------------------------
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class>();

  const [searchKey, setSearchKey] = useState("");
  const [debouncedSearchKey, setDebouncedSearchKey] = useState("");
  const [paginations, setPaginations] = useState(new PaginationModal);


  // handlers --------------------------------------------------------------------------------
  // Hàm để mở BottomSheet từ component con
  const handleOpenBottomSheet = useCallback((_class:Class) => {
    setIsVisible(true);
    setSelectedClass(_class)
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab); 
    setPage(1);
  };


  // effects ---------------------------------------------------------------------------------
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

  useEffect(() => {
    // Đặt lại title của header khi màn hình được hiển thị
    if (navigation) {
      navigation.setOptions({
        title: "Quản lý lớp học",
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
    if (activeTab === CLASS_TAB.REPORTED) {
      AClassAdmin.getAllClasses(debouncedSearchKey, CLASS_TAB.REPORTED, page, PERPAGE ,(classData, pagination) => {
        setClasses(classData);
        setPaginations(pagination);
      }, setLoading);
    } 
    else if (activeTab === CLASS_TAB.PENDING_APPROVAL) {
      AClassAdmin.getAllClasses(debouncedSearchKey, CLASS_TAB.PENDING_APPROVAL, page, PERPAGE ,(classData, pagination) => {
        setClasses(classData);
        setPaginations(pagination);
      }, setLoading);
    }
    else if (activeTab === CLASS_TAB.PENDING_PAY) {
      AClassAdmin.getAllClasses(debouncedSearchKey, CLASS_TAB.PENDING_PAY, page, PERPAGE ,(classData, pagination) => {
        setClasses(classData);
        setPaginations(pagination);
      }, setLoading);
    }
    else {
      AClassAdmin.getAllClasses(debouncedSearchKey, CLASS_TAB.ALL, page, PERPAGE ,(classData, pagination) => {
        setClasses(classData);
        setPaginations(pagination);
      }, setLoading);
    }
  }, [activeTab, page, debouncedSearchKey]);

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
        <View style={styles.colorStatusContainer}>
          <View style={styles.colorStatus}>
          <Text style={styles.colorStatusName}>Người tạo</Text>
          <View style={styles.colorAuthor}></View>
          </View>
          <View style={styles.colorStatus}>
          <Text style={styles.colorStatusName}>Gia sư</Text>
          <View style={styles.colorTutor}></View>
          </View>
        </View>
      </View>

      <View style={[styles.classListContainer, { flex: 1 }]}>
        {loading && 
        <ClassComponentSkeleton/>
        }
        {!loading && 
          <FlatList
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            data={classes}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => {
              return (
              <View style={[styles.classItemContainer, item.is_reported
                ? [styles.boxshadowDanger, styles.borderDanger]
                : styles.boxshadow,]}>
                <TouchableOpacity onPress={() => handleOpenBottomSheet(item)}>
                  <ClassComponent classData={item}/>
                </TouchableOpacity>
              </View>
              )
            }}
            contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 90}}
          />
        }
      </View>

      <View style={{marginHorizontal: 10}}>
        <View style={[styles.paginationContainer, styles.boxshadow]}>
          <Pagination
            totalPage={paginations.total_pages}
            currentPage={page}
            onChange={setPage}
          />
        </View>
      </View>

      <DetailClassBottomSheet
        isVisible={isVisible}
        onCloseButtonSheet={() => setIsVisible(false)}
        activeTab={activeTab}
        classData = {selectedClass}
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

  borderDanger: {
    borderColor: "#FF5050",
    borderWidth: 1,
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
    paddingTop: 10,
    paddingBottom: 20,
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

  colorStatusContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
    paddingHorizontal: 15,
  },

  colorStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  colorAuthor: {
    height: 12, 
    width: 25,
    borderRadius: 10,
    backgroundColor: BackgroundColor.author_color,
    padding: 5,
  },

  colorTutor: {
    height: 12, 
    width: 25,
    borderRadius: 10,
    backgroundColor: BackgroundColor.tutor_color,
    padding: 5,
  },

  colorStatusName: {
    fontWeight: "500",
    color: "#777",
  }
});
