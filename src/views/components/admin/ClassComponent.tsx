import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import React, {useCallback, useContext} from "react";
import {BackgroundColor} from "../../../configs/ColorConfig";
import {Ionicons} from "@expo/vector-icons";
import Class from "../../../models/Class";
import ReactAppUrl from "../../../configs/ConfigUrl";
import {ScrollView} from "react-native-gesture-handler";
import moment from "moment";
import {
  ClassManagerNavigationType,
  IdNavigationType,
  UserManagerNavigationType
} from "../../../configs/NavigationRouteTypeConfig";
import {NavigationContext} from "@react-navigation/native";
import ScreenName from "../../../constants/ScreenName";
import SLog, {LogType} from "../../../services/SLog";
import { LanguageContext } from "../../../configs/LanguageConfig";

const ICON_SIZE = 20;
const URL = ReactAppUrl.PUBLIC_URL;

type ClassComponentProps = {
  classData: Class;
};

export default function ClassComponent({ classData }: ClassComponentProps) {
  const naviagation = useContext(NavigationContext);
  const l =useContext(LanguageContext).language;
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

  const handleOpenAuthor = useCallback(() => {
    if (!classData.author) return;

    const data: IdNavigationType = {
      id: classData.author?.id ?? "-1"
    }

    naviagation?.navigate(ScreenName.PROFILE, data);
  }, [classData]);

  return (
    <View>
      {classData && (
        <ScrollView>
          <View style={styles.headerContent}>
            <Text style={styles.createdTime}>
              {moment(classData.updated_at).format("HH:mm DD/MM/YYYY")}
            </Text>
          </View>

          <View style={styles.majorContainer}>
            <Image
              source={{
                uri: `${URL}${classData.major?.icon}`,
              }}
              style={styles.majorImage}
            />
            <Text style={styles.majorName}>{classData.major?.vn_name}</Text>
          </View>

          <Text style={styles.titleClass}>ID:{classData.id}</Text>
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
                <Text>{l.START}</Text>
              </View>
              <Text>{moment(classData.started_at).format("DD/MM/YYYY")}</Text>
            </View>

            <View style={styles.textWithIconContainer}>
              <View style={styles.textWithIcon}>
                <Ionicons
                  name="calendar-number-outline"
                  size={ICON_SIZE}
                  color="black"
                />
                <Text>{l.END}</Text>
              </View>
              <Text>{moment(classData.ended_at).format("DD/MM/YYYY")}</Text>
            </View>

            <View style={styles.textWithIconContainer}>
              <View style={styles.textWithIcon}>
                <Ionicons
                  name="git-commit-outline"
                  size={ICON_SIZE}
                  color="black"
                />
                <Text>{l.IS_ONLINE}</Text>
              </View>
              <Text>Offline</Text>
            </View>

            <View style={styles.textWithIconContainer}>
              <View style={styles.textWithIcon}>
                <Ionicons
                  name="wallet-outline"
                  size={ICON_SIZE}
                  color="black"
                />
                <Text>Giá</Text>
              </View>
              <Text>{formatCurrency(classData.price)}/buổi</Text>
            </View>

            <View style={styles.textWithIconContainer}>
              <View style={styles.textWithIcon}>
                <Ionicons name="location-outline" size={20} color="black" />
                <Text>Địa chỉ</Text>
              </View>
              <Text
                style={{ flex: 1, textAlign: "right" }}
              >{`${classData.address?.ward}, ${classData.address?.district}, ${classData.address?.province}`}</Text>
            </View>
          </View>

          <View style={styles.line}></View>
          <View style={styles.authorContainer}>
            <Pressable onPress={handleOpenAuthor} style={styles.authorContent}>
              <Image
                source={{
                  uri: `${URL}${classData.author?.avatar}`,
                }}
                style={styles.authorAvatar}
              />
              <Text style={styles.authorName}>
                {classData.author?.full_name}
              </Text>
            </Pressable>
            {classData?.author?.id == classData?.tutor?.id && (
              <View style={styles.authorStatusContainer}>
               <View style={styles.colorAuthor}></View>
               <View style={styles.colorTutor}></View>
              </View>
            )}

            {classData?.author?.id != classData?.tutor?.id && 
              <View style={styles.authorStatusContainer}>
              {classData?.author?.id && 
                 <View style={styles.colorAuthor}></View>
              }
              {classData?.tutor?.id && 
                 <View style={styles.colorTutor}></View>
              }
              </View>
            }

          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    position: "absolute",
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  createdTime: {
    backgroundColor: "rgba(143, 209, 79, 0.3)",
    paddingHorizontal: 15,
    paddingVertical: 3,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "500",
  },

  majorContainer: {
    marginTop: 10,
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
    fontSize: 16,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  authorStatusContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end",
  },

  authorStatus: {
    height: 15,
    width: 15,
    borderRadius: 3,
    fontWeight: "500",
    fontSize: 12,
  },

  tutorStatus: {
    backgroundColor: "rgba(201, 230, 255, 0.69)",
    color: BackgroundColor.primary,
  },

  colorAuthor: {
    height: 12, 
    width: 25,
    borderRadius: 10,
    backgroundColor: BackgroundColor.author_color,
    padding: 5,
  },

  colorTutor: {
    height: 12, 
    width: 25,
    borderRadius: 10,
    backgroundColor: BackgroundColor.tutor_color,
    padding: 5,
  },
});
