import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {
  Animated,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {NavigationContext} from "@react-navigation/native";
import {BackgroundColor} from "../../configs/ColorConfig";
import Search from "../components/Inputs/SearchBar";
import CourseItem from "../components/CourseItem";
import TutorItem from "../components/CvItem";
import Filter from "../components/Filter";
import Ionicons from "@expo/vector-icons/Ionicons";
import ScreenName from "../../constants/ScreenName";
import AMajor from "../../apis/AMajor";
import Major from "../../models/Major";
import User from "../../models/User";
import {UserContext, UserType} from "../../configs/UserContext";
import AClass from "../../apis/AClass";
import Class from "../../models/Class";
import ListMajorSkeleton from "../components/skeleton/ListMajorSkeleton";
import ClassListSkeleton from "../components/skeleton/ClassListSkeleten";
import AUser from "../../apis/AUser";
import {AccountContext} from "../../configs/AccountConfig";
import Role, {RoleList} from "../../models/Role";
import Toast from "react-native-simple-toast";
import SAsyncStorage, {AsyncStorageKeys} from "../../services/SAsyncStorage";
import {LanguageContext} from "../../configs/LanguageConfig";
import vn from "../../../languages/vn.json";
import en from "../../../languages/en.json";
import ja from "../../../languages/ja.json";
import DateTimeConfig from "../../configs/DateTimeConfig";
import ReactAppUrl from "../../configs/ConfigUrl";
import {AppInfoContext} from "../../configs/AppInfoContext";
import SFirebase from "../../services/SFirebase";

const items = [
  {id: 1, title: "Các lớp học đang tham gia"},
  {id: 2, title: "Các lớp học đang dạy"},
  {id: 3, title: "Các lớp học đã tạo"},
  {id: 4, title: "Các lớp học gợi ý"},
];


const URL = ReactAppUrl.PUBLIC_URL

export default function HomeScreen() {
  //contexts, refs
  const animation = useRef(items.map(() => new Animated.Value(1))).current;

  const navigation = useContext(NavigationContext);
  const accountContext = useContext(AccountContext);
  const appInfoContext = useContext(AppInfoContext);
  const languageContext = useContext(LanguageContext);
  const {user, setUser} = useContext(UserContext);

  //states
  const [showingFilter, setShowingFilter] = useState(false);
  const [searchKey, setSearchKey] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState<number[]>(
    items.map((item) => item.id)
  );
  const [userTypeName, setUserTypeName] = useState("Leaner");
  const [majors, setMajors] = useState<Major[]>([]);
  const [suggettingClasses, setSuggettingClasses] = useState<Class[]>([]);
  const [attedingClasses, setAttedingClasses] = useState<Class[]>([]);
  const [teachingClasses, setTeachingClasses] = useState<Class[]>([]);
  const [createdClasses, setCreatedClasses] = useState<Class[]>([]);
  const [suggessingTutors, setSuggessingTutors] = useState<User[]>([]);

  // handlers
  const handleChangeUserType = () => {
    setUser({
      ...user, // Giữ nguyên các thông tin cũ
      TYPE: user.TYPE === UserType.LEANER ? UserType.TUTOR : UserType.LEANER,
    });

    setUserTypeName(user.TYPE === UserType.LEANER ? "Tutor" : "Leaner");
  };

  const goToScan = useCallback(() => {
    navigation?.navigate(ScreenName.SCANNER);
  }, []);

  const handleNavigateToDetail = useCallback((classId: number) => {
    navigation?.navigate(ScreenName.DETAIL_CLASS, {classId});
  }, []);

  const goToClassList = useCallback(() => {
    navigation?.navigate(ScreenName.CLASS_LIST);
  }, []);

  const goToCVList = useCallback(() => {
    navigation?.navigate(ScreenName.CV_LIST);
  }, []);

  const goToDetailCV = useCallback(() => {
    navigation?.navigate(ScreenName.CV);
  }, []);

  // Đường dẫn tạm đếm admin
  // navigation?.navigate(ScreenName.HOME_ADMIN);
  // navigation?.navigate(ScreenName.REPORT_USER);
  // navigation?.navigate(ScreenName.CREATE_ACCOUNT_ADMIN);

  const handleNavigateToCVList = useCallback(() => {
    navigation?.navigate(ScreenName.CV_LIST);
  }, []);

  //open filter
  const handleOpenFilter = useCallback(() => {
    // navigation
  }, []);

  const toggleExpand = useCallback((id: number) => {
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
  }, [animation]);

  // Hàm lấy height interpolation cho từng item
  const getHeightInterpolation = useCallback((index: number) => {
    return animation[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, 380], // Thu hẹp là 0, mở rộng là 450
    });
  }, [animation]);

  // Hàm lấy opacity interpolation cho từng item
  const getOpacityInterpolation = useCallback((index: number) => {
    return animation[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1], // Mờ là 0.5, rõ là 1
    });
  }, [animation]);

  // Hàm lấy rotation interpolation cho từng item
  const getRotationInterpolation = useCallback((index: number) => {
    return animation[index].interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "90deg"], // Xoay từ 0 đến 90 độ
    });
  }, [animation]);

  // effects
  useEffect(() => {
    AMajor.getAllMajors((data) => {
      setMajors(data);
    }, setLoading);

    AClass.getSuggetingClass(
      user.ID,
      user.TYPE,
      (data) => {
        setSuggettingClasses(data);
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
  }, [userTypeName]);

  //set up login
  useEffect(() => {

    navigation?.navigate(ScreenName.HOME_ADMIN);

    return;

    AUser.implicitLogin((user) => {
      if (!user) {
        navigation?.reset({
          index: 0,
          routes: [{name: ScreenName.LOGIN}],
        });
      } else {
        //store new token into async storage
        SAsyncStorage.setData(AsyncStorageKeys.TOKEN, user.token);

        if (accountContext.setAccount) {
          accountContext.setAccount(user);
          setUser({ID: user.id, TYPE: UserType.LEANER});

          //check if admin/superadmin or not
          if (user.roles?.map(role => role.id).includes(RoleList.ADMIN) || user.roles?.map(role => role.id).includes(RoleList.SUPER_ADMIN)) {
            navigation?.reset({
              index: 0,
              routes: [{name: ScreenName.HOME_ADMIN}],
            });
          }

          Toast.show(languageContext.language.WELCOME + " " + user.full_name, 2000);
        }
      }
    });
  }, [accountContext.setAccount]);

  //set up multilanguage
  useEffect(() => {
    SAsyncStorage.getData(AsyncStorageKeys.LANGUAGE, (language) => {
      switch (+language) {
        case 0: // vn
          languageContext.setLanguage &&
          languageContext.setLanguage(vn);
          break;
        case 1: // en
          languageContext.setLanguage &&
          languageContext.setLanguage(en);
          break;
        case 2: //ja
          languageContext.setLanguage &&
          languageContext.setLanguage(ja);
          break;
      }
    });
  }, []);

  //get all information
  useEffect(() => {
    SFirebase.getAppInfos((infos) => {
      appInfoContext.setAppInfo && appInfoContext.setAppInfo(infos);
    });
  }, [appInfoContext.setAppInfo]);

  // render
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.headerContainer}>

          {/* Header title */}
          <View style={styles.headerTitleContainer}>
            <View style={{flex: 1}}>
              <Text style={[styles.headerTitle, styles.title1]}>{languageContext.language.WELCOME}!</Text>
              <Text style={[styles.headerTitle, styles.title2]}>
                {accountContext.account?.full_name}
              </Text>
            </View>

            <View style={{flex: 1, alignItems: "flex-end"}}>
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
            <View style={{flex: 1}}>
              <Search value={searchKey} onChangeText={setSearchKey}/>
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
        {/*end header*/}

        {/* Body */}
        <View style={styles.bodyContainer}>

          {/* Major list header*/}
          <View style={styles.majorContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Danh sách môn học</Text>
              <TouchableOpacity>
                <Text style={styles.showAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Majors list body */}
          {loading && <ListMajorSkeleton/> || (
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={majors}
              renderItem={({item: major}) => (
                <View style={styles.listMajorContainer}>
                  <View style={[styles.majorItem, styles.boxShadow]}>
                    {URL && (
                      <Image
                        source={{uri: URL + (major.icon ?? "")}}
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
              contentContainerStyle={{paddingHorizontal: 10}}
            />
          )}

          {/* Class lists */}
          <View>
            {/* Suggesting class */}
            <View style={styles.classContainer}>
              <View style={[styles.titleContainer, {paddingHorizontal: 20}]}>
                <TouchableOpacity
                  onPress={() => toggleExpand(items[3].id)}
                  style={{flexDirection: "row", gap: 10}}
                >
                  <Animated.View
                    style={{
                      transform: [
                        {rotate: getRotationInterpolation(items[3].id - 1)},
                      ],
                    }}
                  >
                    <Ionicons name="chevron-forward" size={20} color="black"/>
                  </Animated.View>
                  <Text style={styles.title}>{items[3].title}</Text>
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
                    onPress={() => setShowingFilter(true)}
                  >
                    <Image
                      source={require("../../../assets/images/ic_filter.png")}
                      style={{width: 20, height: 20}}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Animated.View
                style={[
                  styles.relatedClassContainer,
                  {
                    height: getHeightInterpolation(items[3].id - 1),
                    opacity: getOpacityInterpolation(items[3].id - 1),
                  },
                ]}
              >
                {loading && <ClassListSkeleton/> || (
                  <FlatList
                    data={suggettingClasses}
                    renderItem={({item: suggettingClass}) => {
                      return (
                        <View style={styles.classItem}>
                          <Pressable
                            onPress={() =>
                              handleNavigateToDetail(suggettingClass.id)
                            }
                          >
                            <CourseItem
                              majorIconUrl={`${URL}${suggettingClass.major?.icon}`}
                              name={suggettingClass.title}
                              level={suggettingClass.class_level?.vn_name || ""}
                              date={DateTimeConfig.getDateFormat(suggettingClass.started_at)}
                              time={2}
                              type={"Tại nhà"}
                              address={suggettingClass.address?.detail ?? ""}
                              cost={suggettingClass.price}
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
                      suggettingClasses.length === 1 && styles.centeredItem,
                    ]}
                  />
                )}
              </Animated.View>
            </View>
            {/* End suggesting class*/}

            {/* Attending class */}
            <View style={styles.classContainer}>
              <View style={[styles.titleContainer, {paddingHorizontal: 20}]}>
                <TouchableOpacity
                  onPress={() => toggleExpand(items[0].id)}
                  style={{flexDirection: "row", gap: 10}}
                >
                  <Animated.View
                    style={{
                      transform: [
                        {rotate: getRotationInterpolation(items[0].id - 1)},
                      ],
                    }}
                  >
                    <Ionicons name="chevron-forward" size={20} color="black"/>
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
                    onPress={() => setShowingFilter(true)}
                  >
                    <Image
                      source={require("../../../assets/images/ic_filter.png")}
                      style={{width: 20, height: 20}}
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
                {loading && <ClassListSkeleton/> || (
                  <FlatList
                    data={attedingClasses}
                    renderItem={({item: attedingClass}) => {
                      return (
                        <View style={styles.classItem}>
                          <Pressable
                            onPress={() =>
                              handleNavigateToDetail(attedingClass.id)
                            }
                          >
                            <CourseItem
                              majorIconUrl={`${URL}${attedingClass.major?.icon}`}
                              name={attedingClass.title}
                              level={attedingClass.class_level?.vn_name || ""}
                              date={DateTimeConfig.getDateFormat(attedingClass.started_at)}
                              time={2}
                              type={"Tại nhà"}
                              address={attedingClass?.address?.detail ?? ""}
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
            {/* End Attending class*/}

            {/* Teaching class */}
            {teachingClasses.length > 0 && (
              <View style={styles.classContainer}>
                <View
                  style={[styles.titleContainer, {paddingHorizontal: 20}]}
                >
                  <TouchableOpacity
                    onPress={() => toggleExpand(items[1].id)}
                    style={{flexDirection: "row", gap: 10}}
                  >
                    <Animated.View
                      style={{
                        transform: [
                          {rotate: getRotationInterpolation(items[1].id - 1)},
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
                      onPress={() => setShowingFilter(true)}
                    >
                      <Image
                        source={require("../../../assets/images/ic_filter.png")}
                        style={{width: 20, height: 20}}
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
                  {loading && <ClassListSkeleton/> || (
                    <FlatList
                      data={teachingClasses}
                      renderItem={({item: attedingClass}) => {
                        return (
                          <View style={styles.classItem}>
                            <Pressable
                              onPress={() =>
                                handleNavigateToDetail(attedingClass.id)
                              }
                            >
                              <CourseItem
                                majorIconUrl={`${URL}${attedingClass.major?.icon}`}
                                name={attedingClass.title}
                                level={attedingClass.class_level?.vn_name || ""}
                                date={DateTimeConfig.getDateFormat(attedingClass.started_at)}
                                time={2}
                                type={"Tại nhà"}
                                address={attedingClass.address?.detail ?? ""}
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
            {/* End Teaching class*/}

            {/* Created classes */}
            {createdClasses.length > 0 && (
              <View style={styles.classContainer}>
                <View
                  style={[styles.titleContainer, {paddingHorizontal: 20}]}
                >
                  <TouchableOpacity
                    onPress={() => toggleExpand(items[2].id)}
                    style={{flexDirection: "row", gap: 10}}
                  >
                    <Animated.View
                      style={{
                        transform: [
                          {rotate: getRotationInterpolation(items[2].id - 1)},
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
                      onPress={() => setShowingFilter(true)}
                    >
                      <Image
                        source={require("../../../assets/images/ic_filter.png")}
                        style={{width: 20, height: 20}}
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
                  {loading && <ClassListSkeleton/>}

                  {!loading && (
                    <FlatList
                      data={createdClasses}
                      renderItem={({item: createdClass}) => {
                        return (
                          <View style={styles.classItem}>
                            <Pressable
                              onPress={() =>
                                handleNavigateToDetail(createdClass.id)
                              }
                            >
                              <CourseItem
                                majorIconUrl={`${URL}${createdClass.major?.icon}`}
                                name={createdClass.title}
                                level={createdClass.class_level?.vn_name || ""}
                                date={DateTimeConfig.getDateFormat(createdClass.started_at)}
                                time={2}
                                type={"Tại nhà"}
                                address={createdClass.address?.detail ?? ""}
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
            {/* End Created classes */}

            {/* Suggessing Tutor list*/}
            <View style={styles.classContainer}>
              <View style={[styles.titleContainer, {paddingHorizontal: 20}]}>
                <View style={{flexDirection: "row", gap: 10}}>
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
                    onPress={() => setShowingFilter(true)}
                  >
                    <Image
                      source={require("../../../assets/images/ic_filter.png")}
                      style={{width: 20, height: 20}}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                <FlatList
                  data={suggessingTutors}
                  renderItem={({item}) => (
                    <Pressable onPress={goToDetailCV} style={styles.classItem}>
                      <TutorItem
                        avatar={item.avatar ?? ""}
                        userName={item.full_name}
                        phoneNumber={item.phone_number}
                        email={item.username}
                        address={item + "address"}
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
            {/* End Suggessing Tutor list*/}
          </View>
        </View>

        <Filter
          isVisible={showingFilter}
          onRequestClose={() => setShowingFilter(false)}
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
    width: 80,
    alignItems: "center",
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