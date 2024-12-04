import React, {useContext} from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {BackgroundColor} from "../../configs/ColorConfig";
import Lesson from "../../models/Lesson";
import moment from "moment";
import {LanguageContext} from "../../configs/LanguageConfig";

type ClassInfoProps = {
  lessonDetail: Lesson;
};

export default function ClassInfo({lessonDetail}: ClassInfoProps) {
  //context
  const language = useContext(LanguageContext).language;

  const days = [
    language.SUNDAY,
    language.MONDAY,
    language.TUESDAY,
    language.WEDNESDAY,
    language.THURSDAY,
    language.FRIDAY,
    language.SATURDAY,
  ]
  // handers
  function convertTimestampToTime(timestamp: number) {
    // Tạo đối tượng Date từ timestamp
    const date = new Date(timestamp);

    // Lấy giờ và phút từ đối tượng Date
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Trả về chuỗi giờ và phút
    return `${hours}:${minutes}`;
  }
  function formatCurrency(amount: number, locale = "vi-VN", currency = "VND") {
    // Kiểm tra nếu không phải số, trả về chuỗi lỗi
    if (typeof amount !== "number") return "Invalid input";

    return amount.toLocaleString(locale, {
      style: "currency",
      currency,
    });
  }

  return (
    <View>
      {/* Class infomation */}
      {lessonDetail && (
        <View style={styles.classInfoContainer}>
          {/* Tiêu đề môn học */}
          <Text style={styles.classInfoTitle}>{lessonDetail.class?.title}</Text>

          <View style={styles.row}>
            <View style={styles.itemInfoTwo}>
              <Ionicons name="book-outline" size={24} color="black" />
              <Text>
                {language.TYPE === "vi"
                  ? lessonDetail.class?.class_level?.vn_name
                  : language.TYPE === "en"
                  ? lessonDetail.class?.class_level?.en_name
                  : lessonDetail.class?.class_level?.ja_name}
              </Text>
            </View>

            <View style={[styles.itemInfoTwo, {justifyContent: "flex-end"}]}>
              <Ionicons name="calendar-outline" size={24} color="black" />
              <Text>
                {moment(lessonDetail.started_at).format("DD/MM/YYYY")}
              </Text>
            </View>
          </View>

          <View style={[styles.line, {marginTop: 10}]}></View>

          <View style={styles.itemInfo}>
            <View style={styles.row}>
              <Ionicons name="cube-outline" size={24} color="black" />
              <Text>{language.SUBJECT_L}</Text>
            </View>
            <Text style={styles.itemContent}>
            {language.TYPE === "vi"
                  ? lessonDetail.class?.major?.vn_name
                  : language.TYPE === "en"
                  ? lessonDetail.class?.major?.en_name
                  : lessonDetail.class?.major?.ja_name}
            </Text>
          </View>

          <View style={styles.itemInfo}>
            <View style={styles.row}>
              <Ionicons name="git-commit-outline" size={24} color="black" />
              <Text>{language.FORM}</Text>
            </View>
            <Text style={styles.itemContent}>
              {lessonDetail.is_online === true ? "online" : "offline"}
            </Text>
          </View>

          <View style={styles.itemInfo}>
            <View style={styles.row}>
              <Ionicons name="timer-outline" size={24} color="black" />
              <Text>{language.SESSION}</Text>
            </View>
            <Text style={[styles.itemContent]}>{days[lessonDetail.day]}</Text>
          </View>

          <View style={styles.itemInfo}>
            <View style={styles.row}>
              <Image
                source={require("../../../assets/images/ic_start_time.png")}
                style={styles.icImage}
              />
              <Text>{language.START}</Text>
            </View>
            <Text style={[styles.itemContentBlack]}>
              {convertTimestampToTime(lessonDetail.started_at)}
            </Text>
          </View>

          <View style={styles.itemInfo}>
            <View style={styles.row}>
              <Image
                source={require("../../../assets/images/ic_end_time.png")}
                style={styles.icImage}
              />
              <Text>{language.END}</Text>
            </View>
            <Text style={[styles.itemContentBlack]}>
              {convertTimestampToTime(
                lessonDetail.started_at + lessonDetail.duration
              )}
            </Text>
          </View>

          <View style={styles.itemInfo}>
            <View style={styles.row}>
              <Ionicons name="cash-outline" size={24} color="black" />
              <Text>{language.PRICE}</Text>
            </View>
            {lessonDetail.class && 
            <Text style={[styles.itemContent]}>{formatCurrency(lessonDetail.class.price)}/{language.SESSION}</Text>
            }
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: BackgroundColor.gray_c6,
  },

  icImage: {
    width: 24,
    height: 24,
    borderRadius: 999,
  },

  classInfoContainer: {
    paddingHorizontal: 20,
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

  itemContentBlack: {
    flex: 1,
    textAlign: "right",
    color: BackgroundColor.black,
    fontWeight: "bold",
  },

  itemContentFee: {
    flex: 1,
    textAlign: "right",
    color: BackgroundColor.danger,
    fontWeight: "bold",
  },
});
