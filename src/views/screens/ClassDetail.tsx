import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { BackgroundColor, BorderColor } from "../../configs/ColorConfig";
import CourseItem from "../components/CourseItem";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation,  NavigationProp } from '@react-navigation/native';
import { useRoute,  RouteProp } from '@react-navigation/native';
import ScreenName from "../../constants/ScreenName";
import { RootStackParamList } from "../../configs/NavigationRouteTypeConfig";


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
export default function ClassDetail() {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const route: RouteProp<RootStackParamList> = useRoute();
  const course = route.params.course
  // Hàm để điều hướng đến màn hình DetailClass mới
  // const handleNavigateToDetail = (classId: string) => {
  //   navigation.navigate(ScreenName.DETAIL_CLASS, { classId }); // Truyền classId qua route params
  // };


  return (
    <View style={styles.container}>
      <View style={{ flex: 9 }}>
        <ScrollView>
          <View>
            {/* Header */}
            <View style={styles.headerContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/128/15311/15311632.png",
                  }}
                  style={styles.headerImage}
                />
              </View>
              <Text style={styles.headerTitle}>Lập trình ứng dụng</Text>
            </View>
            {/* Body */}
            <View style={styles.bodyContainer}>
              {/* Class infomation */}
              <View style={styles.classInfoContainer}>
                {/* Tiêu đề môn học */}
                <Text style={styles.classInfoTitle}>
                  {course.name}
                </Text>

                <View style={styles.row}>
                  <View style={styles.itemInfoTwo}>
                    <Ionicons name="book-outline" size={24} color="black" />
                    <Text>{course.level}</Text>
                  </View>

                  <View
                    style={[styles.itemInfoTwo, { justifyContent: "flex-end" }]}
                  >
                    <Ionicons name="calendar-outline" size={24} color="black" />
                    <Text>{course.date}</Text>
                  </View>
                </View>

                <View style={[styles.line, { marginTop: 10 }]}></View>

                <View style={styles.itemInfo}>
                  <View style={styles.row}>
                    <Ionicons name="cube-outline" size={24} color="black" />
                    <Text>Lớp</Text>
                  </View>
                  <Text style={styles.itemContent}>{course.level}</Text>
                </View>

                <View style={styles.itemInfo}>
                  <View style={styles.row}>
                    <Ionicons
                      name="git-commit-outline"
                      size={24}
                      color="black"
                    />
                    <Text>Hình thức</Text>
                  </View>
                  <Text style={styles.itemContent}>{course.type}</Text>
                </View>

                <View style={styles.itemInfo}>
                  <View style={styles.row}>
                    <Ionicons name="timer-outline" size={24} color="black" />
                    <Text>Thời gian</Text>
                  </View>
                  <Text style={[styles.itemContent]}>{course.time} giờ/Buổi</Text>
                </View>

                <View style={styles.itemInfo}>
                  <View style={styles.row}>
                    <Ionicons name="cash-outline" size={24} color="black" />
                    <Text>Học phí</Text>
                  </View>
                  <Text style={[styles.itemContent]}>{course.cost} VNĐ/Buổi</Text>
                </View>

                <View style={[styles.line, { marginTop: 10 }]}></View>

                <View style={[styles.itemInfo, { marginTop: 20 }]}>
                  <View style={styles.row}>
                    <Text>Phí nhận lớp</Text>
                  </View>
                  <Text style={[styles.itemContentFee]}>50.000</Text>
                </View>
              </View>

              {/* Stduent infomation */}
              <View style={styles.studentInfomationContainer}>
                <Text style={styles.containerTitle}>Thông tin học sinh</Text>

                <View style={[styles.itemInfo, { marginTop: 20 }]}>
                  <View style={styles.row}>
                    <Text style={styles.itemInfoTitle}>Giới tính</Text>
                  </View>
                  <Text style={styles.itemInfoText}>Nam</Text>
                </View>
                <View style={[styles.line, { marginVertical: 11 }]}></View>
                <Text style={[styles.containerTitle, { marginBottom: 10 }]}>
                  Mục tiêu
                </Text>
                <Text>Biết lập trình cơ bản</Text>
              </View>

              {/* Các lớp học liên quan */}
              <View style={styles.relatedClassContainer}>
                <Text style={[styles.containerTitle, { padding: 20 }]}>
                  Các lớp liên quan
                </Text>
                <FlatList
                  data={courses}
                  renderItem={({ item }) => (
                    <View style={styles.classItem}>
                      <Pressable>
                      <CourseItem
                        name={item.name}
                        level={item.level}
                        date={item.date}
                        time={item.time}
                        type={item.type}
                        address={item.address}
                        cost={item.cost}
                      />
                      </Pressable>
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
        </ScrollView>
      </View>
      {/* Nút bấn để nhập lớp */}
      <View style={[styles.buttonContainer, styles.shadow]}>
        <TouchableOpacity style={[styles.btnReceiveClass, styles.boxShadow]}>
          <Text style={styles.btnReceiveClassText}>Nhận lớp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.gray_e6,
  },
  
  headerContainer: {
    backgroundColor: BackgroundColor.primary,
    paddingTop: 30,
    paddingBottom: 100,
    paddingHorizontal: 20,
    alignItems: "center",
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

  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,

    elevation: 18,
  },

  bodyContainer: {},

  line: {
    height: 1,
    backgroundColor: BackgroundColor.gray_c6,
  },

  imageContainer: {
    padding: 10,
    borderRadius: 999,
    backgroundColor: BackgroundColor.white,
  },
  headerImage: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: BackgroundColor.white,
  },

  classInfoContainer: {
    backgroundColor: BackgroundColor.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -50,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 10,
  },

  classInfoTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  itemInfoTwo: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  itemInfo: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginTop: 10,
  },

  itemContent: {
    flex: 1,
    textAlign: "right",
    color: BackgroundColor.primary,
    fontWeight: "bold",
  },

  itemContentFee: {
    flex: 1,
    textAlign: "right",
    color: BackgroundColor.danger,
    fontWeight: "bold",
  },

  studentInfomationContainer: {
    backgroundColor: BackgroundColor.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 10,
  },

  containerTitle: {
    fontWeight: "bold",
    fontSize: 15,
  },

  itemInfoTitle: {
    fontWeight: "bold",
  },

  itemInfoText: {
    flex: 1,
    textAlign: "right",
  },

  btnReceiveClass: {
    backgroundColor: BackgroundColor.primary,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginHorizontal: 50,
    borderRadius: 10,
  },

  btnReceiveClassText: {
    color: BackgroundColor.white,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },

  buttonContainer: {
    flex: 1,
    backgroundColor: BackgroundColor.white,
    justifyContent: "center",
    borderTopColor: BorderColor.gray_30,
    borderTopWidth: 1,
  },

  relatedClassContainer: {
    backgroundColor: BackgroundColor.white,
    marginBottom: 20,
    paddingBottom: 20
  },

  classItem: {
    padding: 10,
    width: 350,
  },

  classList: {
    paddingBottom: 10,
    paddingHorizontal: 10,
  }

});
