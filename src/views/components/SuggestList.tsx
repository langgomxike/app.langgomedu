import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { BackgroundColor } from "../../configs/ColorConfig";
import ClassListSkeleton from "./skeleton/ClassListSkeleten";
import ScreenName from "../../constants/ScreenName";
import { NavigationContext } from "@react-navigation/native";
import CourseItem from "./CourseItem";
import SFirebase, { FirebaseNode } from "../../services/SFirebase";
import AClass from "../../apis/AClass";
import { UserContext } from "../../configs/UserContext";
import Class from "../../models/Class";
import ReactAppUrl from "../../configs/ConfigUrl";
import CvItem from "./CvItem";
import ACV from "../../apis/ACV";
import CV from "../../models/CV";
import Filter from "./Filter";
import Feather from '@expo/vector-icons/Feather';
import Values from "../../constants/Values";
import Pagination from "../../models/Pagination";
import Filters from "../../models/Filters";

const TAB = {
  SUGGEST_CLASS: "suggestClass",
  SUGGEST_CV: "suggestCV",
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const URL = ReactAppUrl.PUBLIC_URL;
const PERPAGE = Values.PERPAGE
export default function SuggestList() {
  //contexts, refs
  const navigation = useContext(NavigationContext);
  const { user, setUser } = useContext(UserContext);
  

  // states ////////////////////////////////////////////////////////////////////////
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState(TAB.SUGGEST_CLASS);
  const [loading, setLoading] = useState(false);
  const {refresh, setRefresh} = useContext(UserContext);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [suggettingClasses, setSuggettingClasses] = useState<Class[]>([]);
  const [suggessingTutors, setSuggessingTutors] = useState<CV[]>([]);
  const [showingFilter, setShowingFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [paginations, setPaginations] = useState(new Pagination);
  const [filterValues, setFilterValues] = useState<Filters>();

  // handle /////////////////////////////////////////////////////////////////////////

  // Hàm gọi get danh sách lớp học gợi ý từ api
  const fetchSuggestedClasses = (currentPage: number, loading: (isloading: boolean) => void, reset = false, filterValues?: Filters ) => {
    if(userId) {
      AClass.getSuggetingClass(
        userId,
        user.TYPE,
        currentPage,
        filterValues,
        (newClasses, pagination ) => {
          setSuggettingClasses((prevClasses) => {
            return reset ? newClasses : [...prevClasses, ...newClasses];
          });
          setPaginations(pagination);
          setRefresh(false);
        },
        loading
      );
    }
  }

  //  Hàm xử lý để navigate sang detail class
  const handleNavigateToDetail = useCallback((classId: number) => {
    navigation?.navigate(ScreenName.DETAIL_CLASS, { classId });
  }, []);

  // Hàm xử lý để chuyển tab 
  const handleTabChange = (selectedTab: string) => {
    setActiveTab(selectedTab);

    if (selectedTab === TAB.SUGGEST_CLASS) {
      // Lấy lớp học gợi ý
      // SFirebase.track(FirebaseNode.Classes, [], () => {
        fetchSuggestedClasses(page,setLoading)
      // });
    } else if (selectedTab === TAB.SUGGEST_CV) {
      // Lấy cvy gợi ý
      ACV.getAllCVList((data) => {
        setSuggessingTutors(data)
      })
    }
  };

  // Hàm sử lý phân trang khi cuộn
  const handleEndReached = () => {
    if (!isFetchingMore && page < paginations.total_pages) {
      // Tăng page lên để tải thêm
      setPage((prevPage) => prevPage + 1); 
    }
  };

  // effect ///////////////////////////////////////////////////////

  // Lấy danh sách lớp học gợi ý lần đầu tiên
  useEffect(() => {
    fetchSuggestedClasses(page,setLoading)
  }, [userId, user.TYPE, refresh]);

  // Lấy danh sách lớp học khi page thay đổi
  useEffect(() => {
    if(page > 1) {
      fetchSuggestedClasses(page, setIsFetchingMore, false ,filterValues)
      console.log(`page: ${page}`);
    }
  }, [page]);

  // Khi filter thay đổi, reset danh sách và page
  useEffect(() => {
    setPage(1);
    console.log("Filter thay đổi");
    
    fetchSuggestedClasses(1, setLoading, true ,filterValues); // Reset danh sách khi filter thay đổi
  }, [filterValues]);

  useEffect(() => {
    setUserId(user.ID);
    console.log(">>> user id: ", user.ID);
  }, [user]);


  // render ////////////////////////////////////////////////////////////

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerNav}>
        <View style={[styles.headerItem]}>
          <TouchableOpacity onPress={() => handleTabChange(TAB.SUGGEST_CLASS)}>
            <Text
              style={[
                styles.headerText,
                activeTab === TAB.SUGGEST_CLASS && styles.headerTextActive,
              ]}
            >
              Gợi ý lớp học
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.headerItem]}>
          <TouchableOpacity onPress={() => handleTabChange(TAB.SUGGEST_CV)}>
            <Text
              style={[
                styles.headerText,
                activeTab === TAB.SUGGEST_CV && styles.headerTextActive,
              ]}
            >
              Gợi ý gia sư
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.btnFilterContainer}>
      { activeTab === TAB.SUGGEST_CLASS && filterValues &&
        <Text style={styles.totalTitle}>Tổng số lớp học: {paginations.total_items}</Text>
      }
      { activeTab === TAB.SUGGEST_CV && 
        <Text style={styles.totalTitle}>Tổng số gia sư: {paginations.total_items}</Text>
      }
      <Text></Text>
        <TouchableOpacity onPress={() => setShowingFilter(true)} style={[styles.btnFilter, styles.boxShadow]}>
        <Feather name="filter" size={18} color="gray" />
        <Text style={styles.btnFilterText}>Lọc</Text>
        </TouchableOpacity>
      </View>

      { activeTab === TAB.SUGGEST_CLASS && 
      <View>
        {loading ? <ClassListSkeleton /> : (
          <FlatList
            data={suggettingClasses}
            renderItem={({ item: suggettingClass }) => {
              return (
                <View style={styles.classItem}>
                  <Pressable
                    onPress={() => handleNavigateToDetail(suggettingClass.id)}
                  >
                    <CourseItem
                      classData = {suggettingClass}
                    />
                  </Pressable>
                </View>
              );
            }}
            keyExtractor={(item, index) => `${item.id} - ${index}`}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={!isFetchingMore && paginations.total_pages !== page ? 
              ( <View style={[styles.loadingMore]}>
                <ActivityIndicator size="large" />
              </View>)
             : null}
            contentContainerStyle={[
              styles.classList,
              suggettingClasses.length === 1 && styles.centeredItem,
            ]}

          />
        )}
      </View>
      }

      { activeTab === TAB.SUGGEST_CV &&
      <FlatList
        data={suggessingTutors}
        renderItem={({ item: suggetsTutor }) => (
          <Pressable  style={styles.classItem}>
            <CvItem
              tutorData = {suggetsTutor}
            />
          </Pressable>
        )}
        keyExtractor={(item, inex) => inex.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.classList}
      />
    }

      <Filter
          isVisible={showingFilter}
          onRequestClose={() => setShowingFilter(false)}
          onSetFilterValues = {setFilterValues}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30
  },

  headerNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginHorizontal: 50
    borderBottomColor: BackgroundColor.gray_c9,
    borderBottomWidth: 1,
    marginBottom: 10,
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
    alignItems: 'center',
  },

  centeredItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  btnFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  totalTitle: {
    fontWeight: "500",
  },

  btnFilter: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 5,
  },

  btnFilterText:{
    fontWeight: "500",
    color: "#333",
  },

  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },

  loadingMore: {

  }
});
