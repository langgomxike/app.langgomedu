import { StyleSheet, View } from "react-native";
import MyIcon, { AppIcon } from "../components/MyIcon";
import React, { Children, useContext } from "react";
import { NavigationContext } from "@react-navigation/native";

type propsBack = {
  children: React.ReactNode;
};

const BackLayout = ({ children }: propsBack) => {
  //contexts
  const navigation = useContext(NavigationContext);

  const handleBack = () => {
    navigation?.goBack();
  };

  return (
    <View style={styles.iconBack}>
      <MyIcon icon={AppIcon.ic_back_circle} onPress={handleBack} />
      <View>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconBack: {
    position: "absolute",
    top: 60,
    left: 20,
  },
});

export default BackLayout;
