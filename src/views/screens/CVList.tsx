import React, {useState, useEffect, useContext} from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Search from "../components/Inputs/SearchBar";
import Feather from "@expo/vector-icons/Feather";
import {BackgroundColor} from "../../configs/ColorConfig";
import CvItem from "../components/CvItem";
import Pagination from "../components/Pagination";
import ACV from "../../apis/ACV";
import CV from "../../models/CV";
import { LanguageContext } from "../../configs/LanguageConfig";

const PER_PAGE = 3;
export default function CVListScreen() {
  // context
  const language = useContext(LanguageContext).language;
  // states
  const [searchKey, setSearchKey] = useState("");
  const [curentPage, setCurentPage] = useState(1);
  const [tutorList, setTutorList] = useState<CV[]>([]);

  // effect
  useEffect(() => {
    ACV.getAllCVList((cvs) => {
      setTutorList(cvs);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={{flex: 1}}>
          <Search value={searchKey} onChangeText={setSearchKey}/>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              alert(language.ALERT_FILTER);
            }}
            style={[styles.btnFilter, styles.boxShadow]}
          >
            <Feather name="filter" size={24} color="black"/>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bodyContainer}>
        <View style={styles.relatedClassContainer}>
          <FlatList
            data={tutorList}
            renderItem={({item: cv}) => (
              <View style={styles.classItem}>
                <CvItem
                  avatar={cv.user?.avatar?.path}
                  userName={cv.user?.full_name}
                  phoneNumber={cv.user?.phone_number}
                  email={cv.user?.email}
                  dayOfBirth={cv.information?.birthday && new Date(cv.information.birthday) || undefined}
                  address={cv.information?.address_1}
                  skills={cv.skills}
                />
              </View>
            )}
            keyExtractor={(item) => item.user?.id.toString() ?? ''}
            horizontal={false}
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.classList}
            style={{height: 500}}
            ListFooterComponent={
              <View style={{padding: 30}}>
                <Pagination
                  totalPage={tutorList.length / PER_PAGE}
                  currentPage={curentPage}
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
    marginTop: 30,
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
