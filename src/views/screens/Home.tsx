import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {
  Animated,
  Dimensions,
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
import AUser from "../../apis/AUser";
import {AccountContext} from "../../configs/AccountConfig";
import Toast from "react-native-simple-toast";
import SAsyncStorage, {AsyncStorageKeys} from "../../services/SAsyncStorage";
import {LanguageContext} from "../../configs/LanguageConfig";
import vn from "../../../languages/vn.json";
import en from "../../../languages/en.json";
import ja from "../../../languages/ja.json";
import ReactAppUrl from "../../configs/ConfigUrl";
import SFirebase, { FirebaseNode } from "../../services/SFirebase";
import SuggestList from "../components/SuggestList";
import UserClassManager from "../components/UserClassManager";
import { RoleList } from "../../models/Role";
import { MajorsLevelsContext } from "../../configs/MajorsLevelsContext";
import AClassLevel from "../../apis/AClassLevel";


const items = [
  {id: 1, title: "Các lớp học đang tham gia"},
  {id: 2, title: "Các lớp học đang dạy"},
  {id: 3, title: "Các lớp học đã tạo"},
  {id: 4, title: "Các lớp học gợi ý"},
];


const URL = ReactAppUrl.PUBLIC_URL
const {width: SCREEN_WIDTH} = Dimensions.get('screen');

export default function HomeScreen() {
  //contexts, refs
  const animation = useRef(items.map(() => new Animated.Value(1))).current;

  const navigation = useContext(NavigationContext);
  const accountContext = useContext(AccountContext);
  const languageContext = useContext(LanguageContext);
  const {user, setUser} = useContext(UserContext);
  const majorsLevelsContext = useContext(MajorsLevelsContext);

  //states
  const [showingFilter, setShowingFilter] = useState(false);
  const [searchKey, setSearchKey] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState<number[]>(
    items.map((item) => item.id)
  );
  const [userTypeName, setUserTypeName] = useState("Leaner");
  const [majors, setMajors] = useState<Major[]>([]);

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
    if(accountContext.account || "089204000003" ) {
      // const userId = accountContext.account.id
      const userId = "089204000003"

      AMajor.getAllMajors((data) => {
        setMajors(data);
        majorsLevelsContext?.setMajors(data);
      }, setLoading);

      AClassLevel.getAllClassLevels((data) => {
        majorsLevelsContext?.setClassLevels(data);
      });
  

    }
  }, [userTypeName, accountContext.setAccount]);

  //set up login
  useEffect(() => {
    AUser.implicitLogin((user) => {
      if (!user) {
        navigation?.reset({
          index: 0,
          routes: [{ name: ScreenName.LOGIN }],
        });
      } else {
        //store new token into async storage
        SAsyncStorage.setData(AsyncStorageKeys.TOKEN, user.token);

        if (accountContext.setAccount) {
          accountContext.setAccount(user);
          setUser({ID: user.id, TYPE: UserType.LEANER});

          //check if admin/superadmin or not
          if (
            user.role?.id === RoleList.SUPER_ADMIN ||
            user.role?.id === RoleList.ADMIN
          ) {
            navigation?.reset({
              index: 0,
              routes: [{ name: ScreenName.HOME_ADMIN }],
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

  // render
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.headerContainer}>

          {/* Header title */}
          <View style={styles.headerTitleContainer}>
            <View style={{flex: 1}}>
              <Text style={[styles.headerTitle, styles.title1]}>Xin Chào!</Text>
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
            {/* SuggestList */}
            <SuggestList/>
            {/* User class manager */}
            <UserClassManager/>
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
    paddingBottom: 80
  },
  headerContainer: {
    backgroundColor: BackgroundColor.primary,
    paddingTop: 30,
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