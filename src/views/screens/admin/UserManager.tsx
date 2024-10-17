import React from "react";
import { View, Text, StyleSheet } from "react-native";
import UserComponent from "../../components/admin/UserComponent";

export default function () {
  //render
  return (
    <View style={styles.container}>
      <Text>User Screen</Text>
      <View style={styles.bodyContainer}>
        <UserComponent />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },

  bodyContainer: {
    paddingHorizontal: 20,
  },
});
