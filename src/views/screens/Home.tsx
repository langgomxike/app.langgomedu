import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import { BackgroundColor } from "../../configs/ColorConfig";
import Search from "../components/Inputs/SearchBar";
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
              <View style={[styles.titleContainer, { paddingHorizontal: 20 }]}>
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
                  horizontal={true}
                  showsHorizontalScrollIndicator={true}
                  contentContainerStyle={styles.classList}
                />
              </View>
            </View>

            <View style={styles.classContainer}>
              <View style={[styles.titleContainer, { paddingHorizontal: 20 }]}>
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
                horizontal={true}
                showsHorizontalScrollIndicator={true}
                contentContainerStyle={styles.classList}
              />
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
    borderWidth: 1,
    borderColor: BackgroundColor.gray_e6,
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
    // paddingHorizontal: 20,
    marginBottom: 20,
  },

  relatedClassContainer: {
    backgroundColor: BackgroundColor.white,
    marginBottom: 20,
    paddingBottom: 20,
  },

  classItem: {
    padding: 10,
    width: 350,
  },

  classList: {
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
});
