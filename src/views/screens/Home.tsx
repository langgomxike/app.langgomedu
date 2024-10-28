import { useContext, useEffect, useRef, useState, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Pressable,
  Animated,
} from "react-native";
import {
  useNavigation,
  NavigationProp,
  NavigationContext,
} from "@react-navigation/native";

import { BackgroundColor } from "../../configs/ColorConfig";
import Search from "../components/Inputs/SearchBar";
import CourseItem from "../components/CourseItem";
import TutorItem from "../components/CvItem";
import Filter from "../components/Filter";
import Ionicons from "@expo/vector-icons/Ionicons";
import ScreenName from "../../constants/ScreenName";
import {
  RootStackParamList,
  RootStackParamListFilter,
} from "../../configs/NavigationRouteTypeConfig";
import AMajor from "../../apis/AMajor";
import Major from "../../models/Major";
import { UserContext, UserType } from "../../configs/UserContext";
import ReactAppUrl from "../../configs/ConfigUrl";
import AClass from "../../apis/AClass";
import Class from "../../models/Class";
import CustomShimmer from "../components/skeleton/CustomShimmer";
import ListMajorSkeleton from "../components/skeleton/ListMajorSkeleton";
import ClassListSkeleton from "../components/skeleton/ClassListSkeleten";
import AUser from "../../apis/AUser";
import { AccountContext } from "../../configs/AccountConfig";
import SFirebase, { FirebaseNode } from "../../services/SFirebase";
import SLog, { LogType } from "../../services/SLog";

const tutors = [
  {
    id: 1,
    avatar: "hinh1.png",
    userName: "Nguyen Văn A",
    phoneNumber: "0987654321",
    email: "nguyenvana@gmail.com",
    dayOfBirth: "29/9/2004",
    address: "228, đường số 6, Linh Chiểu, Thủ Đức",
    skills: ["Math", "Physics", "Chemistry", "Math", "Physics", "Chemistry"],
  },
  {
    id: 2,
    avatar: "hinh2.png",
    userName: "Le Thi B",
    phoneNumber: "0123456789",
    email: "lethib@gmail.com",
    dayOfBirth: "15/8/2003",
    address: "12, đường số 10, Bình Thạnh",
    skills: ["English", "Biology"],
  },
  {
    id: 3,
    avatar: "hinh3.png",
    userName: "Tran Van C",
    phoneNumber: "0912345678",
    email: "tranvanc@gmail.com",
    dayOfBirth: "1/1/2002",
    address: "45, đường số 8, Quận 1",
    skills: ["History", "Geography"],
  },
];

const items = [
  { id: 1, title: "Các lớp học đang tham gia" },
  { id: 2, title: "Các lớp học đang dạy" },
  { id: 3, title: "Các lớp học đã tạo" },
];

const URL = ReactAppUrl.PUBLIC_URL;

export default function HomeScreen() {
  //contexts, refs
  const navigation = useContext(NavigationContext);
  const accountContext = useContext(AccountContext);

  //states
  const [visibleModal, setVisibleModal] = useState<string | null>("");
  const [searchKey, setSearchKey] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState<number[]>(
    items.map((item) => item.id)
  );
  const [userTypeName, setUserTypeName] = useState("Leaner");
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [majors, setMajors] = useState<Major[]>([]);
  const [attedingClasses, setAttedingClasses] = useState<Class[]>([]);
  const [teachingClasses, setTeachingClasses] = useState<Class[]>([]);
  const [createdClasses, setCreatedClasses] = useState<Class[]>([]);

  // context
  const { user, setUser } = useContext(UserContext);

  // handle
  const handleChangeUserType = () => {
    setUser({
      ...user, // Giữ nguyên các thông tin cũ
      TYPE: user.TYPE === UserType.LEANER ? UserType.TUTOR : UserType.LEANER,
    });

    setUserTypeName(user.TYPE === UserType.LEANER ? "Tutor" : "Leaner");
  };

  function fomatDate(timestamp: number) {
    if (!timestamp) return ""; // Kiểm tra nếu timestamp là undefined hoặc null

    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Trả về chuỗi theo định dạng DD/MM/YYYY
  }

  //handlers
  const goToScan = useCallback(() => {
    navigation?.navigate(ScreenName.SCANNER);
  }, []);

  const handleNavigateToDetail = (classId: number)=> {    
    navigation?.navigate(ScreenName.DETAIL_CLASS, { classId });
  }

  const goToClassList = useCallback(() => {
    navigation?.navigate(ScreenName.CLASS_LIST);
  }, []);

  const goToCVList = useCallback(() => {
    navigation?.navigate(ScreenName.CV_LIST);
  }, []);

  const goToDetailCV = useCallback(() => {
    navigation?.navigate(ScreenName.CV);
  }, []);

  const handleOpenDrawer = () => {
    // navigation
  };

  // effect
  useEffect(() => {
    AMajor.getAllMajors((data) => {
      setMajors(data);
    }, setLoading);

    AClass.getAttedingClass(
      user.ID,
      (data) => {
        setAttedingClasses(data);
      },
      setLoading
    );

    AClass.getAttedingClass(
      user.ID,
      (data) => {
        setAttedingClasses(data);
      },
      setLoading
    );

    AClass.getTeachingClass(
      user.ID,
      (data) => {
        setTeachingClasses(data);
      },
      setLoading
    );

    AClass.getCreatedClass(
      user.ID,
      (data) => {
        setCreatedClasses(data);
      },
      setLoading
    );
  }, []);

  // useEffect(() => {
  //   SFirebase.trackOne(FirebaseNode.CLASS, 1, () => {
  //     SLog.log(LogType.Info, "track one", "done tracking");
  //     //give api to get one by id here...
  //   });

  //   SFirebase.trackAll(FirebaseNode.CLASS, () => {
  //     SLog.log(LogType.Info, "track all", "done tracking");
  //     //give api to get all here...
  //   });
  // }, []);

  // animations
  const animation = useRef(items.map(() => new Animated.Value(1))).current;

  const toggleExpand = (id: number) => {
    const isExplaned = expandedItems.includes(id);
    
    let index = id - 1;
    Animated.timing(animation[index], {
      toValue: isExplaned ? 0 : 1,
      duration: 500,
      useNativeDriver: false,
    }).start();

    setExpandedItems((prev) =>
      isExplaned ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Hàm lấy height interpolation cho từng item
  const getHeightInterpolation = (index: number) => {
    return animation[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, 380], // Thu hẹp là 0, mở rộng là 450
    });
  };

  // Hàm lấy opacity interpolation cho từng item
  const getOpacityInterpolation = (index: number) => {
    return animation[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1], // Mờ là 0.5, rõ là 1
    });
  };

  // Hàm lấy rotation interpolation cho từng item
  const getRotationInterpolation = (index: number) => {
    return animation[index].interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "90deg"], // Xoay từ 0 đến 90 độ
    });
  };

  const handleNavigateToCVList = useCallback(() => {
    navigation?.navigate(ScreenName.CV_LIST);
  }, []);

  useEffect(() => {
    AUser.implicitLogin((user) => {
      if (!user) {
        navigation?.navigate(ScreenName.LOGIN);
      } else {
        if (accountContext.setAccount) {
          accountContext.setAccount(user);
        }
      }
    });
  }, []);

  useEffect(() => {
    SFirebase.getClassCreationFee((fee) => {
      alert(fee);
    });
  }, []);

  // render
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          {/* Header title */}
          <View style={styles.headerTitleContainer}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.headerTitle, styles.title1]}>Xin Chào!</Text>
              <Text style={[styles.headerTitle, styles.title2]}>
                Nguyễn Văn A
              </Text>
            </View>

            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <TouchableOpacity
                onPress={handleChangeUserType}
                style={[styles.btnSwitchRole, styles.boxShadow]}
              >
                <Text>{userTypeName}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Header search */}
          <View style={styles.headerSearch}>
            <View style={{ flex: 1 }}>
              <Search value={searchKey} onChangeText={setSearchKey} />
            </View>

            <View>
              <TouchableOpacity style={[styles.btnQrScan, styles.boxShadow]}>
                <Ionicons
                  onPress={goToScan}
                  name="qr-code-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Body */}
        <View style={styles.bodyContainer}>
          <View style={styles.majorContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Danh sách môn học</Text>
              <TouchableOpacity>
                <Text style={styles.showAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Majors list */}
          {loading && <ListMajorSkeleton />}

          {!loading && (
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={majors}
              renderItem={({ item: major }) => (
                <View style={styles.listMajorContainer}>
                  <View style={[styles.majorItem, styles.boxShadow]}>
                    {URL && (
                      <Image
                        source={{ uri: URL + major.icon?.path }}
                        style={styles.majorIcon}
                      />
                    )}
                    <View style={styles.majorTextContainer}>
                      <Text
                        style={styles.majorText}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {major.vn_name}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              contentContainerStyle={{ paddingHorizontal: 10 }}
            />
          )}

          {/* Class */}
          <View>
            {/* Attending class */}
            <View style={styles.classContainer}>
              <View style={[styles.titleContainer, { paddingHorizontal: 20 }]}>
                <TouchableOpacity
                  onPress={() => toggleExpand(items[0].id)}
                  style={{ flexDirection: "row", gap: 10 }}
                >
                  <Animated.View
                    style={{
                      transform: [
                        { rotate: getRotationInterpolation(items[0].id - 1) },
                      ],
                    }}
                  >
                    <Ionicons name="chevron-forward" size={20} color="black" />
                  </Animated.View>
                  <Text style={styles.title}>{items[0].title}</Text>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity>
                    <Text onPress={goToClassList} style={styles.showAllText}>
                      Xem tất cả
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setVisibleModal("modal_fiter")}
                  >
                    <Image
                      source={require("../../../assets/images/ic_filter.png")}
                      style={{ width: 20, height: 20 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Animated.View
                style={[
                  styles.relatedClassContainer,
                  {
                    height: getHeightInterpolation(items[0].id - 1),
                    opacity: getOpacityInterpolation(items[0].id - 1),
                  },
                ]}
              >
                {loading && <ClassListSkeleton />}

                {!loading && (
                  <FlatList
                    data={attedingClasses}
                    renderItem={({ item: attedingClass }) => {
                      return (
                        <View style={styles.classItem}>
                          <Pressable onPress={() => handleNavigateToDetail(attedingClass.id)}>
                            <CourseItem
                              majorIconUrl={`${URL}${attedingClass.major?.icon?.path}`}
                              name={attedingClass.title}
                              level={attedingClass.class_level?.vn_name || ""}
                              date={fomatDate(attedingClass.started_at)}
                              time={2}
                              type={"Tại nhà"}
                              address={attedingClass.address_1}
                              cost={attedingClass.price}
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
                      attedingClasses.length === 1 && styles.centeredItem,
                    ]}
                  />
                )}
              </Animated.View>
            </View>

            {/* Teaching class */}
            {teachingClasses.length > 0 && (
              <View style={styles.classContainer}>
                <View
                  style={[styles.titleContainer, { paddingHorizontal: 20 }]}
                >
                  <TouchableOpacity
                    onPress={() => toggleExpand(items[1].id)}
                    style={{ flexDirection: "row", gap: 10 }}
                  >
                    <Animated.View
                      style={{
                        transform: [
                          { rotate: getRotationInterpolation(items[1].id - 1) },
                        ],
                      }}
                    >
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="black"
                      />
                    </Animated.View>
                    <Text style={styles.title}>{items[1].title}</Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity>
                      <Text style={styles.showAllText}>Xem tất cả</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setVisibleModal("modal_fiter")}
                    >
                      <Image
                        source={require("../../../assets/images/ic_filter.png")}
                        style={{ width: 20, height: 20 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <Animated.View
                  style={[
                    styles.relatedClassContainer,
                    {
                      height: getHeightInterpolation(items[1].id - 1),
                      opacity: getOpacityInterpolation(items[1].id - 1),
                    },
                  ]}
                >
                  {loading && <ClassListSkeleton />}

                  {!loading && (
                    <FlatList
                      data={teachingClasses}
                      renderItem={({ item: attedingClass }) => {
                        return (
                          <View style={styles.classItem}>
                            <Pressable onPress={() => handleNavigateToDetail(attedingClass.id)}>
                              <CourseItem
                                majorIconUrl={`${URL}${attedingClass.major?.icon?.path}`}
                                name={attedingClass.title}
                                level={attedingClass.class_level?.vn_name || ""}
                                date={fomatDate(attedingClass.started_at)}
                                time={2}
                                type={"Tại nhà"}
                                address={attedingClass.address_1}
                                cost={attedingClass.price}
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
                        teachingClasses.length === 1 && styles.centeredItem,
                      ]}
                    />
                  )}
                </Animated.View>
              </View>
            )}

            {/* Created classes */}
            {createdClasses.length > 0 && (
              <View style={styles.classContainer}>
                <View
                  style={[styles.titleContainer, { paddingHorizontal: 20 }]}
                >
                  <TouchableOpacity
                    onPress={() => toggleExpand(items[2].id)}
                    style={{ flexDirection: "row", gap: 10 }}
                  >
                    <Animated.View
                      style={{
                        transform: [
                          { rotate: getRotationInterpolation(items[2].id - 1) },
                        ],
                      }}
                    >
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="black"
                      />
                    </Animated.View>
                    <Text style={styles.title}>{items[2].title}</Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity>
                      <Text style={styles.showAllText}>Xem tất cả</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setVisibleModal("modal_fiter")}
                    >
                      <Image
                        source={require("../../../assets/images/ic_filter.png")}
                        style={{ width: 20, height: 20 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <Animated.View
                  style={[
                    styles.relatedClassContainer,
                    {
                      height: getHeightInterpolation(items[2].id - 1),
                      opacity: getOpacityInterpolation(items[2].id - 1),
                    },
                  ]}
                >
                  {loading && <ClassListSkeleton />}

                  {!loading && (
                    <FlatList
                      data={createdClasses}
                      renderItem={({ item: createdClass }) => {
                        return (
                          <View style={styles.classItem}>
                            <Pressable onPress={() => handleNavigateToDetail(createdClass.id)}>
                              <CourseItem
                                majorIconUrl={`${URL}${createdClass.major?.icon?.path}`}
                                name={createdClass.title}
                                level={createdClass.class_level?.vn_name || ""}
                                date={fomatDate(createdClass.started_at)}
                                time={2}
                                type={"Tại nhà"}
                                address={createdClass.address_1}
                                cost={createdClass.price}
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
                        createdClasses.length === 1 && styles.centeredItem,
                      ]}
                    />
                  )}
                </Animated.View>
              </View>
            )}

            {/* <View style={styles.line}></View> */}

            <View style={styles.classContainer}>
              <View style={[styles.titleContainer, { paddingHorizontal: 20 }]}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Ionicons
                    name="chevron-down-outline"
                    size={20}
                    color="black"
                  />
                  {/* <Ionicons name="chevron-forward" size={24} color="black" /> */}
                  <Text style={styles.title}>Các CV</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity onPress={handleNavigateToCVList}>
                    <Text onPress={goToCVList} style={styles.showAllText}>
                      Xem tất cả
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setVisibleModal("modal_fiter")}
                  >
                    <Image
                      source={require("../../../assets/images/ic_filter.png")}
                      style={{ width: 20, height: 20 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                <FlatList
                  data={tutors}
                  renderItem={({ item }) => (
                    <Pressable onPress={goToDetailCV} style={styles.classItem}>
                      <TutorItem
                        avatar={item.avatar}
                        userName={item.userName}
                        phoneNumber={item.phoneNumber}
                        email={item.email}
                        // dayOfBirth={item.dayOfBirth}
                        address={item.address}
                        // skills={item.skills}
                      />
                    </Pressable>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal={true}
                  showsHorizontalScrollIndicator={true}
                  contentContainerStyle={styles.classList}
                />
              </View>
            </View>
          </View>
        </View>

        <Filter
          isVisible={visibleModal}
          onRequestClose={() => setVisibleModal(null)}
        />
        <Filter
          isVisible={visibleModal}
          onRequestClose={() => setVisibleModal(null)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    backgroundColor: BackgroundColor.primary,
    paddingTop: 50,
    paddingBottom: 100,
    paddingHorizontal: 20,
  },

  bodyContainer: {
    backgroundColor: BackgroundColor.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -50,
    paddingTop: 10,
  },

  headerTitleContainer: {
    flexDirection: "row",
    marginBottom: 30,
  },

  headerTitle: {
    color: BackgroundColor.white,
    fontWeight: "700",
  },

  title1: {
    fontSize: 20,
  },

  title2: {
    fontSize: 18,
  },

  btnSwitchRole: {
    backgroundColor: BackgroundColor.white,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 7,
  },

  btnSwitchRoleText: {
    fontWeight: "bold",
  },

  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  headerSearch: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  btnQrScan: {
    backgroundColor: BackgroundColor.white,
    padding: 10,
    borderRadius: 999,
  },

  line: {
    height: 1,
    backgroundColor: BackgroundColor.gray_c6,
  },

  majorContainer: {
    paddingHorizontal: 20,
  },

  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 25,
  },

  title: {
    fontWeight: "800",
    fontSize: 16,
  },

  showAllText: {
    fontSize: 16,
    color: "#989898",
  },

  listMajorContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 20,
    paddingHorizontal: 10,
  },

  majorTextContainer: {
    height: 43,
    justifyContent: "center",
  },

  majorItem: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: BackgroundColor.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BackgroundColor.gray_e6,
    width: 80,
  },
  majorIcon: {
    width: 30,
    height: 30,
    marginBottom: 10,
  },

  majorText: {
    textAlign: "center",
    fontSize: 12,
  },

  classContainer: {
    // paddingHorizontal: 20,
    marginBottom: 20,
  },

  relatedClassContainer: {
    backgroundColor: BackgroundColor.white,
  },

  classItem: {
    padding: 10,
    width: 340,
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