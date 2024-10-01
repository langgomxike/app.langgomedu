import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Search from "../components/Inputs/SearchBar";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from '@expo/vector-icons/Feather';
import { BackgroundColor } from "../../configs/ColorConfig";
import CourseItem from "../components/CourseItem";
import Pagination from "../components/Pagination";

const courses = [
  {
    id: 1,
    name: "Tìm gia sư dạy toán",
    level: "Lớp 12",
    date: "24/09/2024",
    time: 4,
    type: "Tại nhà",
    address: "Linh Chiểu, Thủ Đức",
    cost: 200000,
  },
  {
    id: 2,
    name: "Khóa học lập trình JavaScript",
    level: "Người mới bắt đầu",
    date: "01/10/2024",
    time: 6,
    type: "Online",
    address: "Phạm Văn Đồng, Thủ Đức",
    cost: 300000,
  },
  {
    id: 3,
    name: "Gia sư tiếng Anh giao tiếp",
    level: "Trình độ trung cấp",
    date: "15/09/2024",
    time: 2,
    type: "Tại nhà",
    address: "Phạm Văn Đồng, Gò Vấp",
    cost: 150000,
  },
  {
    id: 4,
    name: "Khóa học thiết kế đồ họa Photoshop",
    level: "Trình độ cơ bản",
    date: "05/10/2024",
    time: 8,
    type: "Online",
    address: "Quận 1",
    cost: 400000,
  },
  {
    id: 5,
    name: "Lớp học Toán cao cấp",
    level: "Đại học",
    date: "20/10/2024",
    time: 5,
    type: "Tại nhà",
    address: "Nguyễn Văn Linh, Quận 7",
    cost: 250000,
  },
];

export default function ClassList() {
  const [searchKey, setSearchKey] = useState("");
  const [currentPage, setCurentPage] = useState(1);
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={{ flex: 1 }}>
          <Search value={searchKey} onChangeText={setSearchKey} />
        </View>
        <View>
          <TouchableOpacity style={[styles.btnFilter, styles.boxShadow]}>
          <Feather name="filter" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bodyContainer}>
          <View style={styles.relatedClassContainer}>
            <FlatList
              data={courses}
              renderItem={({ item }) => (
                <View style={styles.classItem}>
                  <CourseItem
                    name={item.name}
                    level={item.level}
                    date={item.date}
                    time={item.time}
                    type={item.type}
                    address={item.address}
                    cost={item.cost}
                  />
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal={false}
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={styles.classList}
              style={{ height: 500 }} 
              ListFooterComponent={
                <View style={{ padding: 30 }}>
                  <Pagination
                    totalPage={5}
                    currentPage={currentPage}
                    onChange={setCurentPage}
                  />
                </View>
              }
            />
          </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
  },

  searchContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 70,
    paddingHorizontal: 20,
    paddingVertical: 20
  },

  btnFilter: {
    backgroundColor: BackgroundColor.white,
    borderRadius: 999,
    padding: 10,
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
  bodyContainer: {
    backgroundColor: BackgroundColor.white,
    marginTop: 10,
    flex: 1
  },

  relatedClassContainer: {
    backgroundColor: BackgroundColor.white,
    flex: 1,
  },

  classItem: {
    padding: 10,
  },

  classList: {
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
});
