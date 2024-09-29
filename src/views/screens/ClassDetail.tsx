import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { BackgroundColor } from "../../configs/ColorConfig";
import CourseItem from "../components/CourseItem";
import Ionicons from "@expo/vector-icons/Ionicons";
export default function classDetail() {
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
                  Tìm gia sư dạy lập trình
                </Text>

                <View style={styles.row}>
                  <View style={styles.itemInfoTwo}>
                    <Ionicons name="book-outline" size={24} color="black" />
                    <Text>Lập trình ứng dụng</Text>
                  </View>

                  <View
                    style={[styles.itemInfoTwo, { justifyContent: "flex-end"}]}
                  >
                    <Ionicons name="calendar-outline" size={24} color="black" />
                    <Text>29/09/2024</Text>
                  </View>
                </View>

                <View style={[styles.line, { marginTop: 10 }]}></View>

                <View style={styles.itemInfo}>
                  <View style={styles.row}>
                    <Ionicons name="cube-outline" size={24} color="black" />
                    <Text>Lớp</Text>
                  </View>
                  <Text style={styles.itemContent}>Cao đẳng</Text>
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
                  <Text style={styles.itemContent}>Tại nhà</Text>
                </View>

                <View style={styles.itemInfo}>
                  <View style={styles.row}>
                    <Ionicons name="timer-outline" size={24} color="black" />
                    <Text>Thời gian</Text>
                  </View>
                  <Text style={[styles.itemContent]}>120 phút/Buổi</Text>
                </View>

                <View style={styles.itemInfo}>
                  <View style={styles.row}>
                    <Ionicons name="cash-outline" size={24} color="black" />
                    <Text>Học phí</Text>
                  </View>
                  <Text style={[styles.itemContent]}>200.000 VNĐ/Buổi</Text>
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
              <Text style={styles.containerTitle}>Các lớp liên quan</Text>
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
    paddingTop: 80,
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
  },

  relatedClassContainer: {
    backgroundColor: BackgroundColor.white,
    padding: 20,
    marginBottom: 20
  }
});
