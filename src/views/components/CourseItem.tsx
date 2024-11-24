import { LinearGradient } from 'expo-linear-gradient';
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { BackgroundColor } from "../../configs/ColorConfig";
import Ionicons from '@expo/vector-icons/Ionicons';
import Class from '../../models/Class';
import ReactAppUrl from '../../configs/ConfigUrl';
import moment from "moment";


type CourseItemProps = {
  classData: Class
}
const URL = ReactAppUrl.PUBLIC_URL;
const colorItem = "#666"
export default function CourseItem({
  classData
}:CourseItemProps){

  //handler
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
    <View style={[styles.courseContainer, styles.boxShadow]}>
      {/* Header */}
      <View>
        <LinearGradient
          colors={["#52edff", "#0D99FF"]} // Tạo màu gradient từ xanh đậm sang xanh nhạt
          style={styles.header}
        >
          <Image
            source={{uri: `${URL}${classData.major?.icon}`}}
            style={styles.courseImage}
          />
          <Text style={styles.title}
          numberOfLines={2}      // Giới hạn 2 dòng
          ellipsizeMode="tail" 
          >{classData.title}</Text>
        </LinearGradient>
      </View>
      {/* Content */}
      <View style={styles.content}>
        <View style={styles.contentHorizontal}>
          <View style={[styles.contentItem, styles.twoSection, {paddingVertical: 5}]}>
          <Ionicons name="book-outline" size={20} color={colorItem} />
            <Text style={styles.contentText}>{classData.class_level?.vn_name}</Text>
          </View>

          <View style={[styles.contentItem, styles.twoSection, {justifyContent: "flex-end"}]}>
            <Ionicons name="calendar-outline" size={20} color={colorItem} />
            <Text style={styles.contentText}>{moment(classData.started_at).format("DD/MM/YYYY")}</Text>
          </View>
        </View>

        <View style={styles.line} />

        <View style={[styles.contentItemContainer, styles.marginButtom, {paddingTop: 10}]}>
            <View style={styles.item}>
              <Ionicons name="time-outline" size={20} color={colorItem} />
              <Text style={{color: colorItem}}>Thời lượng</Text>
            </View>
          <Text style={styles.contentText}>11 giờ/Buổi</Text>
        </View>
    
        <View style={[styles.contentItemContainer, styles.marginButtom]}>
          <View style={styles.item}>
          <Ionicons name="git-commit-outline" size={20} color={colorItem} />
            <Text style={{color: colorItem}}>Hình thức</Text>
          </View>
          <Text style={styles.contentText}>{classData.type}</Text>
        </View>

        <View style={[{flexDirection: "column", justifyContent: "space-between"}, styles.marginButtom]}>
          <View style={styles.item}>
            <Ionicons name="location-outline" size={20} color={colorItem} />
            <Text style={{color: colorItem}}>Địa chỉ</Text>
          </View>
          <Text style={[styles.contentAddress]}>{`${classData.address?.ward}, ${classData.address?.district}\n${classData.address?.province}`}</Text>
        </View>
        <View style={styles.line} />

        <View>
            <Text style={styles.footerText}>{formatCurrency(classData.price)}/Buổi</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    footerText: {
        color: '#0D99FF',
        fontWeight: '600',
        fontSize: 18
    },
    marginButtom: {
        marginBottom: 10
    },
  line: {
    height: 1,
    backgroundColor: BackgroundColor.gray_c6,
    marginVertical: 10,
  },
  contentText: {
    fontSize: 14,
    textAlign: "right",
    fontWeight: "500",
    color: "#4D5267",
  },
  contentIcon: {
    width: 23,
    height: 23,
  },
  twoSection: {
    flex: 1,
  },
  contentItem: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  contentHorizontal: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  courseImage: {
    width: 40,
    height: 40,
    marginBottom: 15,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  courseContainer: {
    backgroundColor: "white",
    borderRadius: 20,
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

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    height: 45
  },

  contentItemContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },

  item:{
    flexDirection: "row",
     gap: 8,
  },

  contentAddress: {
    fontSize: 14,
    textAlign: "left",
    fontWeight: "500",
    color: "#4D5267",
    marginLeft: 5,
    marginTop: 5,
  },

});
