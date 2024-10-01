import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { BackgroundColor } from "../../configs/ColorConfig";
import Ionicons from '@expo/vector-icons/Ionicons';


type CourseItemProps = {
  name: string;
  level: string;
  date: string;
  time: number;
  type: string;
  address: string;
  cost: number;
}

function formatNumberWithDot(value:number) {
    // return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    return new Intl.NumberFormat('vi-VN').format(value) 
}

export default function courseItem({
  name,
  level,
  date,
  time,
  type,
  address,
  cost,
}:CourseItemProps){
  return (
    <View style={[styles.courseContainer, styles.boxShadow]}>
      {/* Header */}
      <View>
        <LinearGradient
          colors={["#52edff", "#0D99FF"]} // Tạo màu gradient từ xanh đậm sang xanh nhạt
          style={styles.header}
        >
          <Image
            source={require("../../../assets/images/ic_math.png")}
            style={styles.courseImage}
          />
          <Text style={styles.title}
          numberOfLines={2}      // Giới hạn 2 dòng
          ellipsizeMode="tail" 
          >{name}</Text>
        </LinearGradient>
      </View>
      {/* Content */}
      <View style={styles.content}>
        <View style={styles.contentHorizontal}>
          <View style={[styles.contentItem, styles.twoSection, {paddingVertical: 5}]}>
          <Ionicons name="book-outline" size={24} color="black" />
            <Text style={styles.contentText}>{level}</Text>
          </View>

          <View style={[styles.contentItem, styles.twoSection]}>
            <Ionicons name="calendar-outline" size={24} color="black" />
            <Text style={styles.contentText}>{date}</Text>
          </View>
        </View>

        <View style={styles.line} />

        <View style={[styles.contentItem, styles.marginButtom, {paddingTop: 10}]}>
          <Ionicons name="time-outline" size={24} color="black" />
          <Text style={styles.contentText}>{time} giờ/Buổi</Text>
        </View>
    
        <View style={[styles.contentItem, styles.marginButtom]}>
          <Ionicons name="home-outline" size={24} color="black" />
          <Text style={styles.contentText}>{type}</Text>
        </View>

        <View style={[styles.contentItem, styles.marginButtom]}>
          {/* <Image
            source={require("../../../assets/images/ic_location.png")}
            style={styles.contentIcon}
          /> */}
          <Ionicons name="location-outline" size={24} color="black" />
          <Text style={styles.contentText}>{address}</Text>
        </View>
        <View style={styles.line} />

        <View>
            <Text style={styles.footerText}>{formatNumberWithDot(cost)} VNĐ/Buổi</Text>
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
        marginBottom: 18
    },
  line: {
    height: 1,
    backgroundColor: BackgroundColor.gray_c6,
    marginVertical: 10,
  },
  contentText: {
    fontSize: 14,
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
});
