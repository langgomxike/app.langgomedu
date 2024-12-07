import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {BackgroundColor} from "../../configs/ColorConfig";
import ClassListSkeleton from "./skeleton/ClassListSkeleten";
import ScreenName from "../../constants/ScreenName";
import {NavigationContext} from "@react-navigation/native";
import CourseItem from "./CourseItem";
import SFirebase, {FirebaseNode} from "../../services/SFirebase";
import AClass from "../../apis/AClass";
import {UserContext} from "../../configs/UserContext";
import Class from "../../models/Class";
import ReactAppUrl from "../../configs/ConfigUrl";
import CvItem from "./CvItem";
import ACV from "../../apis/ACV";
import CV from "../../models/CV";
import Filter from "./Filter";
import Feather from "@expo/vector-icons/Feather";
import Values from "../../constants/Values";
import Pagination from "../../models/Pagination";
import Filters from "../../models/Filters";
import {AccountContext} from "../../configs/AccountConfig";
import {LanguageContext} from "../../configs/LanguageConfig";
import FilterCV from "./FilterCV";
import CVItemListSkeleton from "./skeleton/CVItemListSkeleton";
import User from "../../models/User";

const TAB = {
  SUGGEST_CLASS: "suggestClass",
  SUGGEST_CV: "suggestCV",
};

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("screen");
const URL = ReactAppUrl.PUBLIC_URL;
const PERPAGE = Values.PERPAGE;
export default function SuggestList() {
  //contexts, refs
  const navigation = useContext(NavigationContext);
  const user = useContext(UserContext).user;
  const account = useContext(AccountContext).account;
  const language = useContext(LanguageContext).language;

  // states ----------------------------------------------------------------
  const [activeTab, setActiveTab] = useState(TAB.SUGGEST_CLASS);
  const [loadingClass, setLoadingClass] = useState(false);
  const [loadingCV, setLoadingCV] = useState(false);
  const {refresh, setRefresh} = useContext(UserContext);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [suggestingClasses, setSuggestingClasses] = useState<Class[]>([]);
  const [suggestingTutors, setSuggestingTutors] = useState<CV[]>([]);
  const [showingFilter, setShowingFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [paginations, setPaginations] = useState(new Pagination());
  const [filterCVs, setFilterCVs] = useState<Filters | null>(null);
  const [filterClasses, setFilterClasses] = useState<Filters | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);

  // handle ----------------------------------------------------------------
  //  Hàm xử lý để navigate sang detail class
  const handleNavigateToDetail = useCallback((classId: number) => {
    navigation?.navigate(ScreenName.DETAIL_CLASS, {classId});
  }, []);

  // Hàm xử lý để chuyển tab
  const handleTabChange = (selectedTab: string) => {
    setActiveTab(selectedTab);
    setFilterCVs(null);
    setFilterClasses(null);
  };

  // Lấy danh sách gợi ý class
  const fetchSuggestsClasses = (
    currentPage: number,
    userData: User,
    onLoading: (loading: boolean) => void
  ) => {
    if (userData) {
      console.log("fetchSuggestsClasses", userData.id);
      const filterValues: Filters = {
        // province: "Hồ Chí Minh",
        major: [6],
      };
      AClass.getSuggetingClasses(
        userData.id,
        user.TYPE,
        currentPage,
        filterValues,
        (newClasses, pagination) => {
          setIsEmpty(newClasses.length === 0);
          setSuggestingClasses((prevClasses) => [
            ...prevClasses,
            ...newClasses,
          ]);
          setPaginations(pagination);
          onLoading(false);
        },
        onLoading
      );
    }
  };

  // Lấy danh sách classes theo filter
  const fetchClassesFilter = (
    currentPage: number,
    filterValues: Filters,
    onLoading: (loading: boolean) => void
  ) => {
    if (account) {
      AClass.getFilterClasses(
        account.id,
        user.TYPE,
        currentPage,
        filterValues,
        (data, pagination) => {
          setIsEmpty(data.length === 0);
          setSuggestingClasses((prevClasses) => [...prevClasses, ...data]);
          setPaginations(pagination);
          onLoading(false);
        },
        onLoading
      );
    }
  };

  // Lấy danh sách gợi ý cvs
  const fetchSuggestsCvs = (
    currentPage: number,
    userData: User,
    onLoading: (loading: boolean) => void
  ) => {
    if (userData) {
      const address = `${userData.address?.province}, ${userData.address?.district}, ${userData.address?.ward}`;
      ACV.getSuggestedCVs(
        userData.id,
        currentPage,
        address,
        (data, pagination) => {
          setIsEmpty(data.length === 0);
          setSuggestingTutors((prevTutors) => [...prevTutors, ...data]);
          setPaginations(pagination);
          onLoading(false);
        },
        onLoading
      );
    }
  };

  // Lấy danh sách cv theo filter
  const fetchCVsFilter = (
    currentPage: number,
    filterValues: Filters,
    onLoading: (loading: boolean) => void
  ) => {
    if (account) {
      ACV.getFilterCVs(
        account.id,
        currentPage,
        filterValues,
        (data, pagination) => {
          setIsEmpty(data.length === 0);
          setSuggestingTutors((prevTutors) => [...prevTutors, ...data]);
          setPaginations(pagination);
          onLoading(false);
        },
        onLoading
      );
    }
  };

  // Hàm dùng chung để fetch dữ liệu
  const fetchDataByTabClass = (
    page: number,
    onLoaing: (loading: boolean) => void,
    isReset: boolean = false
  ) => {
    if (!account) return;
    if (!filterClasses) {
      console.log("GỌi 1 cái ở đây");
      fetchSuggestsClasses(page, account, onLoaing);
    } else {
      fetchClassesFilter(page, filterClasses, onLoaing);
    }

    // Nếu cần reset, có thể thực hiện thêm logic reset ở đây
    if (isReset) {
      setPage(1);
    }
  };

  const fetchDataByTabCV = (
    page: number,
    onLoaing: (loading: boolean) => void,
    isReset: boolean = false
  ) => {
    if (!account) return;

    if (!filterCVs) {
      fetchSuggestsCvs(page, account, onLoaing);
    } else {
      fetchCVsFilter(page, filterCVs, onLoaing);
    }

    if (isReset) {
      setPage(1);
    }
  };

  // Hàm sử lý phân trang khi cuộn
  const handleEndReached = useCallback(() => {
    if (page >= paginations.total_pages) return;
    setPage((prevPage) => prevPage + 1);
  }, [page, paginations, isFetchingMore, activeTab]);

  // effect ----------------------------------------------------------------

  // Khi filter thay đổi, reset danh sách và page
  useEffect(() => {
    console.log("Active tab thay đổi, hoặc filter thay đổi");

    setPage(1);
    if (activeTab === TAB.SUGGEST_CLASS) {
      setSuggestingClasses([]);
      fetchDataByTabClass(1, setLoadingClass, true);
    } else if (activeTab === TAB.SUGGEST_CV) {
      setSuggestingTutors([]);
      fetchDataByTabCV(1, setLoadingCV, true);
    }
  }, [filterCVs, filterClasses, activeTab]);

  // Khi `page` thay đổi, thực hiện fetch
  useEffect(() => {
    if (page === 1) return;
    if (activeTab === TAB.SUGGEST_CLASS) {
    fetchDataByTabClass(page, setIsFetchingMore);
    }
    if (activeTab === TAB.SUGGEST_CV) {
      fetchDataByTabCV(page, setIsFetchingMore);
      }
  }, [page]);

  useEffect(() => {
    if(!refresh) return;
    setSuggestingClasses([]);
    setSuggestingTutors([]);
    
    fetchDataByTabClass(1, setLoadingClass, true);
    fetchDataByTabCV(1, setLoadingCV, true);
    setRefresh(false);
  }, [refresh]);
  // render ----------------------------------------------------------------

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
              {language.CLASS_SUGGESTIONS}
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
              {language.TUTOR_SUGGESTIONS}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.btnFilterContainer}>
        {activeTab === TAB.SUGGEST_CLASS && filterClasses && (
          <Text style={styles.totalTitle}>
            {language.TOTAL_CLASSES}: {paginations.total_items}
          </Text>
        )}
        {activeTab === TAB.SUGGEST_CV && filterCVs && (
          <Text style={styles.totalTitle}>
            {language.TOTAL_TUTORS}: {paginations.total_items}
          </Text>
        )}
        <Text></Text>
        <TouchableOpacity
          onPress={() => setShowingFilter(true)}
          style={[styles.btnFilter, styles.boxShadow]}
        >
          <Feather name="filter" size={18} color="gray" />
          <Text style={styles.btnFilterText}>{language.FILTER}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bodyContainer}>
        {activeTab === TAB.SUGGEST_CLASS && (
          <View>
            {loadingClass ? (
              <ClassListSkeleton />
            ) : (
              <FlatList
                data={suggestingClasses}
                renderItem={({item: suggettingClass}) => {
                  return (
                    <View style={styles.classItem}>
                      <Pressable
                        onPress={() =>
                          handleNavigateToDetail(suggettingClass.id)
                        }
                      >
                        <CourseItem classData={suggettingClass} />
                      </Pressable>
                    </View>
                  );
                }}
                keyExtractor={(item, index) => `${item.id} - ${index}`}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.8}
                ListFooterComponent={
                  !isFetchingMore && paginations.total_pages !== page ? (
                    <View style={[styles.loadingMore]}>
                      <ActivityIndicator size="large" />
                    </View>
                  ) : null
                }
                contentContainerStyle={[
                  styles.classList,
                  suggestingClasses.length === 1 && styles.centeredItem,
                ]}
              />
            )}
          </View>
        )}

        {activeTab === TAB.SUGGEST_CV && (
          <View>
            {loadingCV ? (
              <CVItemListSkeleton />
            ) : (
              <FlatList
                data={suggestingTutors}
                renderItem={({item: suggetsTutor}) => (
                  <Pressable style={styles.classItem}>
                    <CvItem tutorData={suggetsTutor} />
                  </Pressable>
                )}
                keyExtractor={(item, inex) => inex.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.classList}
              />
            )}
          </View>
        )}

        {(!loadingClass || !loadingCV) && isEmpty && (
          <View style={[styles.emptyContainer]}>
            <Image
              source={require("../../../assets/images/ic_empty.png")}
              style={[styles.emptyImage]}
            />
            <Text style={styles.emptyText}>{"Không có dữ liệu"}</Text>
          </View>
        )}
      </View>

      {activeTab === TAB.SUGGEST_CLASS && (
        <Filter
          isVisible={showingFilter}
          onRequestClose={() => setShowingFilter(false)}
          onSetFilterValues={setFilterClasses}
        />
      )}

      {activeTab === TAB.SUGGEST_CV && (
        <FilterCV
          isVisible={showingFilter}
          onRequestClose={() => setShowingFilter(false)}
          onSetFilterValues={setFilterCVs}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 20,
    paddingBottom: 30,
  },

  bodyContainer: {
    // height: SCREEN_HEIGHT * 0.45,
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
    alignItems: "center",
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
    marginBottom: 20,
    paddingHorizontal: 20,
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

  btnFilterText: {
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

  loadingMore: {},

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
    textAlign: "center",
  },
});
