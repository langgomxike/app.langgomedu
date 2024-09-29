import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MyIcon, { AppIcon } from "../components/MyIcon";
import Avatar, { Orientation } from "../components/Avatar";
import React, { useCallback, useContext } from "react";
import { NavigationContext } from "@react-navigation/native";

type propsBackDetail = {
  icName: string;
  subIcon?: React.ReactNode;
  children: React.ReactNode;
};

const BackWithDetailLayout = ({
  icName,
  subIcon,
  children,
}: propsBackDetail) => {
  //contexts
  const navigation = useContext(NavigationContext);

  const handleAvatar = () => {
    alert("Avatar");
  };

  const handleBack = useCallback(() => {
    navigation?.goBack();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Back Icon and Text */}
        <View style={styles.leftSection}>
          <TouchableOpacity style={styles.iconButton}>
            <MyIcon icon={AppIcon.ic_back_circle} onPress={handleBack} />
            <Text style={styles.textIcon}>{icName}</Text>
            {/* {children} */}
          </TouchableOpacity>
        </View>

        <View style={styles.avatar}>
          <Avatar
            canEdit={true}
            userName="NGUYEN VAN A"
            orientation={Orientation.vertically}
            onPress={handleAvatar}
          />
        </View>

        {/* Info Icon */}
        <View style={styles.leftSection}>
          <TouchableOpacity style={styles.iconButton}>
            {/* <MyIcon icon={AppIcon.ic_info} onPress={handleInfor}/> */}
            {subIcon}
          </TouchableOpacity>
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
    backgroundColor: "#f5f5f5",
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    backgroundColor: '#008CFF',
    height: 215,
    paddingHorizontal:20,
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
    transform: [{translateY: -60}]
  },

  textIcon: {
    transform: [{translateY: -15}],
    marginLeft: 5,
    color: "#fff",
    fontWeight: "bold",
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
    transform: [{translateY: 35}, {translateX: -14}]
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
