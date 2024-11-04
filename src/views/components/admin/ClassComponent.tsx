import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { BackgroundColor } from "../../../configs/ColorConfig";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import Class from "../../../models/Class";
import ReactAppUrl from "../../../configs/ConfigUrl";
import { ScrollView } from "react-native-gesture-handler";

const ICON_SIZE = 20;
const URL = ReactAppUrl.PUBLIC_URL;
 type ClassComponentProps = {
    classData: Class;
 }

export default function ClassComponent({classData}: ClassComponentProps) {
  
  function fomatDate(timestamp: number) {
    if (!timestamp) return ""; // Kiểm tra nếu timestamp là undefined hoặc null

    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Trả về chuỗi theo định dạng DD/MM/YYYY
  }

  function formatCurrency(amount: number, locale = "vi-VN", currency = "VND") {
    // Kiểm tra nếu không phải số, trả về chuỗi lỗi
    if (typeof amount !== "number") return "Invalid input";

    return amount.toLocaleString(locale, {
      style: "currency",
      currency,
    });

    // console.log(formatCurrency(price, "en-GB", "GBP")); // "£123,456,789.00" (Anh)
    // console.log(formatCurrency(price, "ja-JP", "JPY")); // "￥123,456,789" (Nhật)
    // console.log(formatCurrency(price, "vi-VN", "VND")); // "123.456.789 ₫" (Việt Nam)
  }

  return (
    <View>
    {classData &&
    <ScrollView>
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
            uri: `${URL}${classData.major?.icon?.path}`,
          }}
          style={styles.majorImage}
        />
        <Text style={styles.majorName}>{classData.major?.vn_name}</Text>
      </View>
          
      <Text style={styles.titleClass}>{classData.title}</Text>  

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
          <Text>{fomatDate(classData.started_at)}</Text>
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
          <Text>{fomatDate(classData.ended_at)}</Text>
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
          <Text>{formatCurrency(classData.price)}/buổi</Text>
        </View>

        <View style={styles.textWithIconContainer}>
          <View style={styles.textWithIcon}>
            <Ionicons name="location-outline" size={20} color="black" />
            <Text>Địa chỉ</Text>
          </View>
          <Text>{`${classData.address_4}, ${classData.address_3}\n${classData.address_2}, ${classData.address_1}`}</Text>
        </View>
      </View>

      <View style={styles.line}></View>
      <View style={styles.authorContainer}>
        <View style={styles.authorContent}>
          <Image
            source={{
              uri: `${URL}${classData.author?.avatar?.path}`,
            }}
            style={styles.authorAvatar}
          />
          <Text style={styles.authorName}>{classData.author?.full_name}</Text>
        </View>
      </View>
      </ScrollView>
    }
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
