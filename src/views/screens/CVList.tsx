import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Search from "../components/Inputs/SearchBar";
import Feather from '@expo/vector-icons/Feather';
import { BackgroundColor } from "../../configs/ColorConfig";
import TutorItem from "../components/TutorItem";
import Pagination from "../components/Pagination";

const tutors = [
  {
    id: 1,
    avatar: "hinh1.png",
    userName: "Nguyen Văn A",
    phoneNumber: "0987654321",
    email: "nguyenvana@gmail.com",
    dayOfBirth: "29/9/2004",
    address: "228, đường số 6, Linh Chiểu, Thủ Đức",
    skills: ["Math", "Physics", "Chemistry", "Math", "Physics", "Chemistry"],
  },
  {
    id: 2,
    avatar: "hinh2.png",
    userName: "Le Thi B",
    phoneNumber: "0123456789",
    email: "lethib@gmail.com",
    dayOfBirth: "15/8/2003",
    address: "12, đường số 10, Bình Thạnh",
    skills: ["English", "Biology"],
  },
  {
    id: 3,
    avatar: "hinh3.png",
    userName: "Tran Van C",
    phoneNumber: "0912345678",
    email: "tranvanc@gmail.com",
    dayOfBirth: "1/1/2002",
    address: "45, đường số 8, Quận 1",
    skills: ["History", "Geography"],
  },
];
export default function CVList() {
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
              data={tutors}
              renderItem={({ item }) => (
                <View style={styles.classItem}>
                  <TutorItem
                    avatar={item.avatar}
                    userName={item.userName}
                    phoneNumber={item.phoneNumber}
                    email={item.email}
                    dayOfBirth={item.dayOfBirth}
                    address={item.address}
                    skills={item.skills}
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
