import {useCallback, useContext, useEffect, useState} from "react";
import {Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {NavigationContext} from "@react-navigation/native";
import {BackgroundColor} from "../../configs/ColorConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import ScreenName from "../../constants/ScreenName";
import {UserContext, UserType} from "../../configs/UserContext";
import ListMajorSkeleton from "../components/skeleton/ListMajorSkeleton";
import {AccountContext} from "../../configs/AccountConfig";
import {LanguageContext} from "../../configs/LanguageConfig";
import ReactAppUrl from "../../configs/ConfigUrl";
import {AppInfoContext} from "../../configs/AppInfoContext";
import SFirebase, {FirebaseNode} from "../../services/SFirebase";
import SuggestList from "../components/SuggestList";
import UserClassManager from "../components/UserClassManager";
import {MajorsLevelsContext} from "../../configs/MajorsLevelsContext";
import {RefreshControl} from "react-native-gesture-handler";
import TypingEffect from "../components/TypingEffect";

const URL = ReactAppUrl.PUBLIC_URL;
const {width: SCREEN_WIDTH} = Dimensions.get("screen");

export default function HomeScreen() {
  //contexts, refs
  const navigation = useContext(NavigationContext);
  const accountContext = useContext(AccountContext);
  const appInfoContext = useContext(AppInfoContext);
  const language = useContext(LanguageContext).language;
  const {user, setUser} = useContext(UserContext);
  const {refresh, setRefresh} = useContext(UserContext);
  const majors = useContext(MajorsLevelsContext)?.majors;

  //states
  const [searchKey, setSearchKey] = useState<string>("");
  const [loading, setLoading] = useState(false);
  

  // handlers
  const handleChangeUserType = () => {
    if (accountContext.account) {
      const isTutor = accountContext.account.roles.some((role) => role.name === "TUTOR");
      
      if (isTutor) {        
        setUser({
          ...user,
          TYPE:
            user.TYPE === UserType.LEANER ? UserType.TUTOR : UserType.LEANER,
        });
      } else {
        // Nếu không phải TUTOR, có thể thông báo hoặc không làm gì
        alert(
          "Bạn không thay đổi loại người dùng.Chỉ có thể thay đổi nếu bạn là gia sư"
        );
      }
    }
  };

  const goToScan = useCallback(() => {
    navigation?.navigate(ScreenName.SCANNER);
  }, []);

  const onRefresh = useCallback(() => {
    setRefresh(true);
  }, [refresh]);

  // render
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          {/* Header button scan qr*/}
          <View style={styles.btnQrScanContainer}>
            <TouchableOpacity style={[styles.btnQrScan, styles.boxShadow]}>
              <Ionicons
                onPress={goToScan}
                name="qr-code-outline"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.headerContentContainer}>
            <TypingEffect />
            <Text style={[styles.headerTitle, styles.title2]}>
              {accountContext.account?.full_name}
            </Text>
          </View>

          <View style={styles.btnSwitchRoleContainer}>
            <TouchableOpacity
              onPress={handleChangeUserType}
              style={[styles.btnSwitchRole, styles.boxShadow]}
            >
              <Text>
                {user.TYPE === UserType.LEANER
                  ? language.LEARNER
                  : language.TUTOR}
              </Text>
            </TouchableOpacity>
          </View>

          <View></View>
        </View>
        {/*end header*/}

        {/* Body */}
        <View style={styles.bodyContainer}>
          {/* Major list header*/}
          <View style={styles.majorContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{language.SUBJECT_LIST}</Text>
            </View>
          </View>

          {/* Majors list body */}
          {(loading && <ListMajorSkeleton />) || (
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
                        {language.TYPE === "vi"
                          ? major.vn_name
                          : language.TYPE === "en"
                          ? major.en_name
                          : major.ja_name}
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
            <SuggestList />
            {/* User class manager */}
            {accountContext.account && (
              <UserClassManager userId={accountContext.account.id} />
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 80,
  },
  headerContainer: {
    backgroundColor: BackgroundColor.primary,
    paddingTop: 20,
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
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: {width: 1, height: 2},
    textShadowRadius: 4,
  },

  title2: {
    fontSize: 22,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },

  btnSwitchRoleContainer: {
    marginTop: 10,
  },

  btnSwitchRole: {
    backgroundColor: BackgroundColor.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 7,
    width: SCREEN_WIDTH * 0.3,
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

  btnQrScanContainer: {
    position: "absolute",
    right: 20,
    top: 10,
    zIndex: 999,
  },

  btnQrScan: {
    backgroundColor: BackgroundColor.white,
    padding: 10,
    borderRadius: 999,
  },

  headerContentContainer: {
    marginTop: 10,
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
