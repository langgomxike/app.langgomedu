import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import SearchBar from "../../components/Inputs/SearchBar";
import Feather from "@expo/vector-icons/Feather";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {BackgroundColor, TextColor} from "../../../configs/ColorConfig";
import AppInfoContainer from "../../components/admin/AppInfoContainer";
import Role, {RoleList} from "../../../models/Role";
import Spinner from "react-native-loading-spinner-overlay";
import ARole from "../../../apis/ARole";
import Ionicons from "@expo/vector-icons/Ionicons";
import Permission from "../../../models/Permission";
import APermission from "../../../apis/APermission";
import Pagination from "../../components/Pagination";
import {LanguageContext} from "../../../configs/LanguageConfig";
import Toast from "react-native-simple-toast";
import SFirebase, {FirebaseNode} from "../../../services/SFirebase";
import {NavigationContext} from "@react-navigation/native";
import SLog, {LogType} from "../../../services/SLog";

export default function PermissionManagementScreen() {
  //contexts
  const language = useContext(LanguageContext).language;
  const navigation = useContext(NavigationContext);

  //states
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [newRole, setNewRole] = useState("");

  //handlers
  const addNewRole = useCallback(() => {
    if (!newRole || roles.map(r => r.name).includes(newRole.trim())) {
      Toast.show(language.INVALID_INPUT, 1000);
      return;
    }
    setLoading(true);

    const timeId = setTimeout(() => {
      setLoading(false);
      Toast.show(language.ADD_NEW_ROLE_FAILURE, 1000);
    }, 10000);

    const role = new Role();
    role.name = newRole.trim();

    ARole.addNewRole(role,
      (result) => {
        if (result) {
          Toast.show(language.ADD_NEW_ROLE_SUCCESS, 1000);
        } else {
          Toast.show(language.ADD_NEW_ROLE_FAILURE, 1000);
        }
      },
      () => {
        setLoading(false);
        clearTimeout(timeId);
        setNewRole("");
      }
    );
  }, [newRole, roles]);

  const deleteRole = useCallback((role: Role) => {
    const roleValues = Object.values(RoleList).filter(value => typeof value === "number");
 
    if(roleValues.includes(role.id)) {
      Toast.show(language.CANNOT_DELETE_SYSTEM_ROLE, 1000);
      return;
    }

    setLoading(true);

    const timeId = setTimeout(() => {
      setLoading(false);
      Toast.show(language.DELETE_FAILED, 1000);
    }, 10000);

    ARole.deleteNewRole(role,
      (result) => {
        if (result) {
          Toast.show(language.DELETED, 1000);
        } else {
          Toast.show(language.DELETE_FAILED, 1000);
        }
      },
      () => {
        setLoading(false);
        clearTimeout(timeId);
      }
    );
  }, []);

  //effects
  useEffect(() => {
    // Đặt lại title của header khi màn hình được hiển thị
    if (navigation) {
      navigation.setOptions({
        title: `${language.PERMISSION_MANAGEMENT}`,
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
    SFirebase.track(FirebaseNode.Roles, [], () => {
      setLoading(true);
      const timeId = setTimeout(() => {
        setLoading(false);
      }, 10000);

      ARole.getAllRoles((roles) => {
        setRoles(roles);
      }, () => {
        APermission.getAllPermissions((permissions) => {
          setPermissions(permissions);
        }, () => {
          setLoading(false);
          clearTimeout(timeId);
        })
      });
    });
  }, []);
  return (
    <ScrollView style={{backgroundColor: BackgroundColor.white}}>
    <View style={styles.container}>
      <Spinner visible={loading}/>

      <View style={styles.headerContainer}>
        {/* search bar*/}
        <View style={styles.searchHeader}>
          {/* add new role */}
          <View style={[styles.textInputBox, styles.shadowProp]}>
            <TextInput
              style={[styles.textInput]}
              value={newRole}
              autoCapitalize={"characters"}
              onChangeText={setNewRole}
              placeholder={language.ADD_NEW_ROLE}
              placeholderTextColor={TextColor.hint}
            />

            <TouchableOpacity style={[styles.addButton, styles.boxshadow]} onPress={addNewRole}>
              <Feather name="plus" size={25} color={TextColor.white}/>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={{fontStyle: "italic"}}>*{language.LONG_PRESS_TO_DELETE_ROLE}</Text>

        {/*  body */}
        {roles?.map(role => (
          <AppInfoContainer key={role.id} title={role.name?.replaceAll("_", " ")}
                            onLongPress={() => deleteRole(role)}>
            <PermissionList role={role} allPers={permissions}/>
          </AppInfoContainer>
        ))}
      </View>
    </View>
    </ScrollView>
  );
}

type PermissionListProp = {
  role: Role;
  allPers: Permission[];
}

function PermissionList({allPers, role}: PermissionListProp) {
//contexts
  const language = useContext(LanguageContext).language;

//states
  const [page, setPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [myPers, setMyPers] = useState<Permission[]>([]);
  const [selectedPers, setSelectedPers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);

  //handlers
  const select = useCallback((id: number) => {
    if (selectedPers.includes(id)) {
      setSelectedPers(selectedPers.filter(p => p != id));
    } else {
      setSelectedPers([...selectedPers, id]);
    }
  }, [selectedPers]);

  const onSubmit = useCallback(() => {
    setLoading(true);

    const timeId = setTimeout(() => {
      setLoading(false);
      // Toast.show(language.U, 1000);
    }, 10000);

    ARole.updatePermissionsOfRole(role, selectedPers,
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
  }, [selectedPers]);

  //effects
  useEffect(() => {
    setFirstLoading(true);

    const timeId = setTimeout(() => {
      setFirstLoading(false);
    }, 10000);

    SFirebase.track(FirebaseNode.Roles, [{key: FirebaseNode.Id, value: role.id}], () => {
      APermission.getPermissionsOfRole(role,
        (permissions) => {
          setMyPers(permissions);
          setSelectedPers(permissions.map(p => p.id));
        },
        () => {
          setFirstLoading(false);
          clearTimeout(timeId);
        }
      );
    });
  }, []);

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
        }}>{selectedPers?.length ?? 0} / {allPers?.length ?? 0}</Text>
      </TouchableOpacity>
    </View>

    {!firstLoading && allPers?.filter(p => p.name.includes(searchKey.toUpperCase())).slice(5 * (page - 1), 5 * page).map(permission => (
      <View key={permission.id} style={PItemStyles.container}>
        <Text style={{flex: 1, fontSize: 12}}>{permission.name?.replaceAll("_", " ")}</Text>

        <Ionicons onPress={() => select(permission.id)}
                  name={selectedPers?.includes(permission.id) ? "checkbox-outline" : "stop-outline"}
                  size={20}/>
      </View>
    ))}

    {firstLoading && <Text style={{flex: 1, textAlign: "center"}}>{language.LOADING}</Text>}

    <View style={{marginHorizontal: 10}}>
      <View style={[PItemStyles.paginationContainer, styles.boxshadow]}>
        <Pagination
          totalPage={Math.ceil(allPers?.filter(p => p.name.includes(searchKey.toUpperCase()))?.length / 5)}
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
    paddingHorizontal: 20,
    marginTop: 10,
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