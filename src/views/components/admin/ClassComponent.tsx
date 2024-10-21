import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { BackgroundColor } from "../../../configs/ColorConfig";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";

const ICON_SIZE = 20;

export default function ClassComponent() {
  return (
    <View>
      <View style={styles.headerContent}>
        <Text style={styles.createdTime}>2 ngày trước</Text>
        <View style={styles.checkboxContainer}>
          <Text>Thanh toán</Text>
          <MaterialIcons
            name="check-box-outline-blank"
            size={20}
            color="black"
          />
        </View>
      </View>

      <View style={styles.majorContainer}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/12343/12343168.png",
          }}
          style={styles.majorImage}
        />
        <Text style={styles.majorName}>Kinh tế</Text>
      </View>
          
      <Text style={styles.titleClass}>Tìm gia sư hỗ trợ</Text>  

      <View style={styles.line}></View>

      <View style={styles.classContent}>
        <View style={styles.textWithIconContainer}>
          <View style={styles.textWithIcon}>
            <Ionicons
              name="calendar-clear-outline"
              size={ICON_SIZE}
              color="black"
            />
            <Text>Bắt đầu</Text>
          </View>
          <Text>20/10/2024</Text>
        </View>

        <View style={styles.textWithIconContainer}>
          <View style={styles.textWithIcon}>
            <Ionicons
              name="calendar-number-outline"
              size={ICON_SIZE}
              color="black"
            />
            <Text>Kết thúc</Text>
          </View>
          <Text>20/10/2024</Text>
        </View>

        <View style={styles.textWithIconContainer}>
          <View style={styles.textWithIcon}>
            <Ionicons
              name="git-commit-outline"
              size={ICON_SIZE}
              color="black"
            />
            <Text>Hình thức</Text>
          </View>
          <Text>Offline</Text>
        </View>

        <View style={styles.textWithIconContainer}>
          <View style={styles.textWithIcon}>
            <Ionicons name="wallet-outline" size={ICON_SIZE} color="black" />
            <Text>Giá</Text>
          </View>
          <Text>200.000đ/buổi</Text>
        </View>

        <View style={styles.textWithIconContainer}>
          <View style={styles.textWithIcon}>
            <Ionicons name="location-outline" size={20} color="black" />
            <Text>Địa chỉ</Text>
          </View>
          <Text>đường số 6, Linh chiểu, Thủ Đức, TP HCM</Text>
        </View>
      </View>

      <View style={styles.line}></View>
      <View style={styles.authorContainer}>
        <View style={styles.authorContent}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/4322/4322991.png",
            }}
            style={styles.authorAvatar}
          />
          <Text style={styles.authorName}>Đỗ Xuân Tuấn</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15
  },

  checkboxContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  createdTime: {
    backgroundColor: "rgba(143, 209, 79, 0.3)",
    paddingHorizontal: 15,
    paddingVertical: 3,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "500"
  },
  

  majorContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  majorImage: {
    width: 35,
    height: 35,
    marginBottom: 10,
  },

  majorName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  titleClass: {
    fontWeight: "500",
    fontSize: 15,
  },

  line: {
    height: 1,
    backgroundColor: BackgroundColor.gray_e6,
    marginTop: 10,
  },

  classContent: {
    marginTop: 10,
    gap: 10,
  },

  textWithIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  textWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  authorContainer: {
    marginTop: 10,
    gap: 10,
  },

  containerSubTitle: {
    fontWeight: "bold",
    fontSize: 15,
  },

  authorContent: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  authorAvatar: {
    width: 35,
    height: 35,
    borderRadius: 999,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
