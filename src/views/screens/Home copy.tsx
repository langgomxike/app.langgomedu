import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { BackgroundColor } from "../../configs/ColorConfig";
import Search from "../components/Inputs/Seach";
import CourseItem from "../components/CourseItem";
import TutorItem from "../components/TutorItem";
import Ionicons from "@expo/vector-icons/Ionicons";

const skills: Array<string> = [
  "Nghe",
  "Noi",
  "Doc",
  "Viet",
  "Lap trinh ung dung",
  "Lap trinh web",
];

export default function HomeScreen() {
  const [searchKey, setSearchKey] = useState<string>("");
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          {/* Header title */}
          <View style={styles.headerTitleContainer}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.headerTitle, styles.title1]}>Xin Chào!</Text>
              <Text style={[styles.headerTitle, styles.title2]}>
                Nguyễn Văn A
              </Text>
            </View>

            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <TouchableOpacity
                style={[styles.btnSwitchRole, styles.boxShadow]}
              >
                <Text>Leaner</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Header search */}
          <View style={styles.headerSearch}>
            <View style={{ flex: 1 }}>
              <Search value={searchKey} onChangeText={setSearchKey} />
            </View>

            <View>
              <TouchableOpacity style={[styles.btnQrScan, styles.boxShadow]}>
                <Ionicons name="qr-code-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Body */}
        <View style={styles.bodyContainer}>
          <View style={styles.majorContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Danh sách môn học</Text>
              <TouchableOpacity>
                <Text style={styles.showAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles.listMajorContainer}>
              <View style={[styles.majorItem,styles.boxShadow]}>
                <Image
                  source={require("../../../assets/images/ic_math.png")}
                  style={styles.majorIcon}
                />
                <Text style={styles.majorText}>Toán</Text>
              </View>

              <View style={[styles.majorItem, styles.boxShadow]}>
                <Image
                  source={require("../../../assets/images/ic_math.png")}
                  style={styles.majorIcon}
                />
                <Text style={styles.majorText}>Toán</Text>
              </View>

              <View style={[styles.majorItem, styles.boxShadow]}>
                <Image
                  source={require("../../../assets/images/ic_math.png")}
                  style={styles.majorIcon}
                />
                <Text style={styles.majorText}>Toán</Text>
              </View>

              <View style={[styles.majorItem, styles.boxShadow]}>
                <Image
                  source={require("../../../assets/images/ic_math.png")}
                  style={styles.majorIcon}
                />
                <Text style={styles.majorText}>Web</Text>
              </View>

              <View style={[styles.majorItem, styles.boxShadow]}>
                <Image
                  source={require("../../../assets/images/ic_math.png")}
                  style={styles.majorIcon}
                />
                <Text
                  style={styles.majorText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Lập trình web
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Class */}
          <View>
            <View style={styles.classContainer}>
              <View style={styles.titleContainer}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Ionicons
                    name="chevron-down-outline"
                    size={20}
                    color="black"
                  />
                  <Text style={styles.title}>Các lớp học</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.showAllText}>Xem tất cả</Text>
                </TouchableOpacity>
              </View>

              <View>
                <CourseItem
                  name="Tìm gia sư dạy toán"
                  level="Lớp 12"
                  date="24/09/2024"
                  time={4}
                  type="Tại nhà"
                  address="Linh Chiểu, Thủ Đức"
                  cost={200000}
                />
              </View>
            </View>

            <View style={styles.classContainer}>
              <View style={styles.titleContainer}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Ionicons
                    name="chevron-down-outline"
                    size={20}
                    color="black"
                  />
                  <Text style={styles.title}>Các lớp học</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.showAllText}>Xem tất cả</Text>
                </TouchableOpacity>
              </View>

              <View>
                <TutorItem
                avatar="hinh1.png"
                userName="Nguyen Văn A"
                phoneNumber="0987654321"
                email="nguyenvana@gmail.com"
                dayOfBirth="29/9/2004"
                address="228, đường soos6, Linh chiểu, Thủ Đức"
                skills={skills}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    backgroundColor: BackgroundColor.primary,
    paddingTop: 60,
    paddingBottom: 100,
    paddingHorizontal: 20,
  },

  bodyContainer: {
    backgroundColor: BackgroundColor.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -50,
    paddingTop: 10,
  },

  headerTitleContainer: {
    flexDirection: "row",
    marginBottom: 30,
  },

  headerTitle: {
    color: BackgroundColor.white,
    fontWeight: "700",
  },

  title1: {
    fontSize: 20,
  },

  title2: {
    fontSize: 18,
  },

  btnSwitchRole: {
    backgroundColor: BackgroundColor.white,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 7,
  },

  btnSwitchRoleText: {
    fontWeight: "condensedBold",
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

  headerSearch: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },

  btnQrScan: {
    backgroundColor: BackgroundColor.white,
    padding: 10,
    borderRadius: 999,
  },

  majorContainer: {
    paddingHorizontal: 20,
  },

  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 25,
  },

  title: {
    fontWeight: "800",
    fontSize: 16,
  },

  showAllText: {
    fontSize: 16,
    color: "#989898",
  },

  listMajorContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 20,
    paddingHorizontal: 10,
  },

  majorItem: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: BackgroundColor.white,
    borderRadius: 10,
    width: 80,
  },
  majorIcon: {
    width: 30,
    height: 30,
    marginBottom: 10,
  },

  majorText: {
    textAlign: "center",
  },

  classContainer: {
    paddingHorizontal: 20,
    marginBottom: 20
  },
});
