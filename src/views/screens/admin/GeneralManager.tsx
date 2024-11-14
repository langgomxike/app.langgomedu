import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
} from "react-native";
import ItemManager from "../../components/admin/ItemManager";

const itemManagerNames = [
  "Quản lý tên ứng dụng",
  "Quản lý tên của các chứng chỉ",
  "Quản lý môn học thường gặp",
  "Quản lý kĩ năng thường gặp",
]

export default function GeneralManager() {
  // Styles animated chevron

  return (
    <View style={styles.container}>
      <FlatList
      showsVerticalScrollIndicator={false}
      data={itemManagerNames}
      renderItem={({item}) => {
        return (
          <View style={styles.itemContainer}>
          <ItemManager title={item}/>
          </View>
        )
      }}

      contentContainerStyle={{paddingHorizontal: 20, paddingVertical: 20}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  itemContainer: {
    marginBottom: 20,
  }

  
});
