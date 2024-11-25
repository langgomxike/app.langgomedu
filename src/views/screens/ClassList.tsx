import React, {useEffect, useState} from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Search from "../components/Inputs/SearchBar";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { BackgroundColor } from "../../configs/ColorConfig";
import CourseItem from "../components/CourseItem";
import Pagination from "../components/Pagination";
import Class from "../../models/Class";
import DateTimeConfig from "../../configs/DateTimeConfig";

export default function ClassListScreen() {
  // states
  const [searchKey, setSearchKey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [classes, setClasses] = useState<Class[]>([]);

  //handlers


  //effects
  useEffect(() => {
    alert("call api to get classes here");
  }, []);

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
            data={classes}
            renderItem={({ item }) => (
              <View style={styles.classItem}>
                <CourseItem 
                  majorIconUrl=""
                  name={item.title}
                  level={item.title}
                  date={DateTimeConfig.getDateFormat(item.started_at)}
                  time={item.started_at}
                  type={item.title}
                  address={item.address_1}
                  cost={item.price}
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
                  onChange={setCurrentPage}
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
    paddingVertical: 20,
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
    flex: 1,
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
