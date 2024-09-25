import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";


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
          <Text style={styles.title}>{name}</Text>
        </LinearGradient>
      </View>
      {/* Content */}
      <View style={styles.content}>
        <View style={styles.contentHorizontal}>
          <View style={[styles.contentItem, styles.twoSection]}>
            <Image
              source={require("../../../assets/images/ic_graduate_outline.png")}
              style={styles.contentIcon}
            />
            <Text style={styles.contentText}>{level}</Text>
          </View>

          <View style={[styles.contentItem, styles.twoSection]}>
            <Image
              source={require("../../../assets/images/ic_calendar_outline.png")}
              style={styles.contentIcon}
            />
            <Text style={styles.contentText}>{date}</Text>
          </View>
        </View>

        <View style={styles.line} />

        <View style={[styles.contentItem, styles.marginButtom, {paddingTop: 10}]}>
          <Image
            source={require("../../../assets/images/ic_clock.png")}
            style={styles.contentIcon}
          />
          <Text style={styles.contentText}>{time} giờ/Buổi</Text>
        </View>
    
        <View style={[styles.contentItem, styles.marginButtom]}>
          <Image
            source={require("../../../assets/images/home-tab.png")}
            style={styles.contentIcon}
          />
          <Text style={styles.contentText}>{type}</Text>
        </View>

        <View style={[styles.contentItem, styles.marginButtom]}>
          <Image
            source={require("../../../assets/images/ic_location.png")}
            style={styles.contentIcon}
          />
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
        fontSize: 20
    },
    marginButtom: {
        marginBottom: 10
    },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
    marginVertical: 10,
  },
  contentText: {
    fontSize: 16,
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
    width: 50,
    height: 50,
    marginBottom: 20,
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
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
});
