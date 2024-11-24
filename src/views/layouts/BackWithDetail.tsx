import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MyIcon, { AppIcon } from "../components/MyIcon";
import Avatar, { Orientation } from "../components/Avatar";
import React, { useCallback, useContext } from "react";
import { NavigationContext } from "@react-navigation/native";
import {AccountContext} from "../../configs/AccountConfig";
import {BackgroundColor} from "../../configs/ColorConfig";
import User from "../../models/User";

type propsBackDetail = {
  icName: string;
  subIcon?: React.ReactNode;
  children: React.ReactNode;
  hiddenBackButton? :boolean;
  user?: User;
  handleUploadAvatar? :() => void;
};

const BackWithDetailLayout = ({
  children,
  user,
  handleUploadAvatar = () => {}
}: propsBackDetail) => {
  //contexts
  const navigation = useContext(NavigationContext);
  const accountContext = useContext(AccountContext);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header]}>
        <View style={[styles.avatar]}>
          <Avatar
            canEdit={true}
            userName={user ? user.full_name?.toUpperCase(): accountContext.account?.full_name?.toUpperCase() || ""}
            orientation={Orientation.vertically}
            onPress={handleUploadAvatar}
          />
        </View>
      </View>

      {/* Main content */}
      <View style={styles.mainContent}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.sub_primary,
  },

  header: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: BackgroundColor.primary,
    height: 220,
    paddingHorizontal: 20,
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    transform: [{ translateY: -60 }],
  },

  textIcon: {
    marginLeft: 5,
    color: "#fff",
    fontWeight: "bold",
    transform: [{ translateY: -15}]
  },

  backText: {
    color: "#fff",
    fontSize: 16,
  },

  profileContainer: {
    alignItems: "center",
    marginTop: 75,
  },

  avatar: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },

  mainContent: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 16,
    zIndex: 1,
  },
});

export default BackWithDetailLayout;
