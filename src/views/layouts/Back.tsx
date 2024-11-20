import {ScrollView, StyleSheet, View} from "react-native";
import React, {Children, useContext} from "react";
import {NavigationContext} from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

type propsBack = {
  children: React.ReactNode;
};

const BackLayout = ({children}: propsBack) => {
  //contexts
  const navigation = useContext(NavigationContext);

  const handleBack = () => {
    navigation?.goBack();
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} style={styles.container}>
      <View style={styles.iconBack}>
        <Ionicons name={"close"} size={30} onPress={handleBack}/>
      </View>

      <View style={styles.body}>
        {children}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  iconBack: {
    paddingLeft: 20,
    paddingTop: 20,
  },
});

export default BackLayout;
