import {Image, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import BackLayout from "../../layouts/Back";
import SearchBar from "../../components/Inputs/SearchBar";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {BackgroundColor, TextColor} from "../../../configs/ColorConfig";
import Role from "../../../models/Role";
import Spinner from "react-native-loading-spinner-overlay";
import ARole from "../../../apis/ARole";
import Ionicons from "@expo/vector-icons/Ionicons";
import Pagination from "../../components/Pagination";
import {LanguageContext} from "../../../configs/LanguageConfig";
import SFirebase, {FirebaseNode} from "../../../services/SFirebase";
import ScreenName from "../../../constants/ScreenName";
import {NavigationContext, NavigationRouteContext} from "@react-navigation/native";
import User from "../../../models/User";
import {IdNavigationType} from "../../../configs/NavigationRouteTypeConfig";
import AUser from "../../../apis/AUser";
import ReactAppUrl from "../../../configs/ConfigUrl";
import Toast from "react-native-simple-toast";

export default function UserPermissionManagementScreen() {
  //contexts
  const language = useContext(LanguageContext).language;
  const navigation = useContext(NavigationContext);
  const route = useContext(NavigationRouteContext);

  //states
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);

  //handlers
  const goToPermissionManager = useCallback(() => {
    navigation?.navigate(ScreenName.PERMISSION_MANAGEMENT);
  }, []);

  const goToProfile = useCallback(() => {
    const data: IdNavigationType = {
      id: user?.id ?? "-1",
    }
    navigation?.navigate(ScreenName.PROFILE, data);
  }, [user]);

  //effects
  useEffect(() => {
    SFirebase.track(FirebaseNode.Roles, [], () => {
      setLoading(true);
      const timeId = setTimeout(() => {
        setLoading(false);
      }, 10000);

      ARole.getAllRoles((roles) => {
        setRoles(roles);
      }, () => {
        setLoading(false);
        clearTimeout(timeId);
      });
    });
  }, []);

  useEffect(() => {
    const data = route?.params as IdNavigationType;
    const userId: string = (data?.id ?? "-1") + "";

    SFirebase.track(FirebaseNode.Users, [
      {
        key: FirebaseNode.Id,
        value: userId,
      }
    ], () => {
      AUser.getUserById(userId, (user) => {
        setUser(user);
      });
    });
  }, []);

  return (
    <BackLayout>
      <Spinner visible={loading}/>

      <Text style={styles.title}>{language.USER_PERMISSION_MANAGEMENT?.toUpperCase()}</Text>

      <Pressable style={styles.buttonLink} onPress={goToPermissionManager}>
        <Text style={styles.link}>{language.PERMISSION_MANAGEMENT}</Text>

        <Ionicons name={"chevron-forward-outline"} size={20} style={{alignSelf: "center"}}/>
      </Pressable>

      <Pressable style={{alignSelf: "center"}} onPress={goToProfile}>
        <Image src={ReactAppUrl.PUBLIC_URL + user?.avatar} style={styles.avatar}/>

        <Text style={styles.userName}>{user?.full_name}</Text>
      </Pressable>

      <View style={styles.headerContainer}>
        {/*  body */}
        <RoleList allRols={roles} myRoles={user?.roles ?? []} user={user}/>
      </View>
    </BackLayout>
  );
}

type RoleListProp = {
  allRols: Role[];
  myRoles: Role[];
  user?: User;
}

const fakeRoleList: number[] = [];

for (let i = 0; i < 9; i++) {
  fakeRoleList.push(i);
}

function RoleList({allRols, myRoles, user}: RoleListProp) {
//contexts
  const language = useContext(LanguageContext).language;

//states
  const [page, setPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<number[]>(myRoles?.map(r => r.id));
  const [loading, setLoading] = useState(false);

  //handlers
  const select = useCallback((id: number) => {
    if (selectedRoles.includes(id)) {
      setSelectedRoles(selectedRoles.filter(p => p != id));
    } else {
      setSelectedRoles([...selectedRoles, id]);
    }
  }, [selectedRoles]);

  const onSubmit = useCallback(() => {
    setLoading(true);

    const timeId = setTimeout(() => {
      setLoading(false);
      Toast.show(language.UPDATED_FAILED, 1000);
    }, 10000);

    AUser.updateRolesOfUser(user?.id ?? "-1", selectedRoles,
      (result) => {
        if (result) {
          Toast.show(language.UPDATED, 1000);
        } else {
          Toast.show(language.UPDATED_FAILED, 1000);
        }
      },
      () => {
        setLoading(false);
        clearTimeout(timeId);
      });
  }, [selectedRoles]);

  //effetcs
  useEffect(() => {
    setSelectedRoles(myRoles?.map(r => r.id));
  }, [myRoles]);

  return <>
    <View style={styles.searchHeader}>
      <Spinner visible={loading}/>

      <SearchBar
        value={searchKey}
        onChangeText={setSearchKey}
        style={{flex: 1}}
      />

      <TouchableOpacity style={[styles.submitButton, styles.boxshadow]} onPress={onSubmit}>
        <Ionicons name="push-outline" size={20} color={TextColor.white}/>
        <Text style={{
          color: TextColor.white,
          textAlign: "center",
          fontSize: 8
        }}>{selectedRoles?.length ?? 0} / {allRols?.length ?? 0}</Text>
      </TouchableOpacity>
    </View>

    {allRols?.filter(r => r.name.includes(searchKey.toUpperCase())).slice(7 * (page - 1), 7 * page).map(role => (
      <View key={role.id} style={PItemStyles.container}>
        <Text style={{flex: 1, fontSize: 12}}>{role.name?.replaceAll("_", " ")}</Text>

        <Ionicons onPress={() => select(role.id)}
                  name={selectedRoles?.includes(role.id) ? "checkbox-outline" : "stop-outline"}
                  size={20}/>
      </View>
    ))}

    <View style={{marginHorizontal: 10}}>
      <View style={[PItemStyles.paginationContainer, styles.boxshadow]}>
        <Pagination
          totalPage={Math.ceil(allRols?.filter(p => p.name.includes(searchKey.toUpperCase()))?.length / 7)}
          currentPage={page}
          onChange={setPage}
        />
      </View>
    </View>
  </>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },

  userName: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
    color: TextColor.sub_primary,
    marginBottom: 10,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: BackgroundColor.white,
    borderWidth: 0.7,
    borderColor: BackgroundColor.sub_primary,
    marginTop: 10,
    alignSelf: "center",
  },

  buttonLink: {
    borderWidth: 0.5,
    borderColor: BackgroundColor.sub_primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 10,
    alignSelf: "flex-end",
    flexDirection: "row",
    gap: 5,
  },

  link: {
    color: TextColor.sub_primary,
    fontSize: 12,
    fontWeight: "700",
  },

  textInputBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 999,
  },

  shadowProp: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  textInput: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  addButton: {
    backgroundColor: BackgroundColor.primary,
    borderRadius: 999,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  submitButton: {
    backgroundColor: BackgroundColor.primary,
    borderRadius: 999,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
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

  roleContainer: {},

  permissionItem: {},

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
});

const PItemStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 5,
    marginVertical: 10,
    shadowColor:
    BackgroundColor.black,
    shadowOffset:
      {
        width: 0,
        height: 2,
      }
    ,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    backgroundColor: BackgroundColor.white,
    borderRadius: 10,
    padding: 12,
  },

  submit: {
    gap: 5,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: BackgroundColor.gray_e6,
    marginVertical: 5,
    marginHorizontal: 40,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: BackgroundColor.primary,
  },

  paginationContainer: {
    width: "100%",
    bottom: 0,
    borderWidth: 1,
    borderColor: BackgroundColor.gray_e6,
    paddingVertical: 5,
    marginBottom: 10,
    borderRadius: 999,
    backgroundColor: BackgroundColor.white,
  },
})