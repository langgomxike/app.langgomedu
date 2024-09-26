import React from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native";

const boxType = {
  BOX_ONE: "box_one",
  BOX_TWO: "box_two",
};

const BoxWhite = () => {
  const selectBox = boxType.BOX_ONE;

  // ham render
  const renderBox = () => {
    switch (selectBox) {
      case boxType.BOX_ONE:
        return <View style={styles.boxOne} />;
      case boxType.BOX_TWO:
        return <View style={styles.boxTwo} />;
      default:
        return null;
    }
  };

  return (

    <View style={styles.container}>
        {renderBox()}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: "#e9ecef",
      alignItems: "center", // Canh giữa theo chiều dọc
      justifyContent: "center", // Canh giữa theo chiều ngang
      flex: 1,
    },
    boxOne: {
      width: 300,
      height: 200,
      backgroundColor: "white",
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 5,
    },
    boxTwo: {
      width: 300,
      height: 200,
      backgroundColor: "white",
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 5,
      borderWidth: 2, // Box 2 có thêm đường viền
      borderColor: "gray",
    },
  });

export default BoxWhite;
