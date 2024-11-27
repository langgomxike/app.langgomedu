import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useContext } from 'react'
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { BackgroundColor } from '../../configs/ColorConfig';
import Lesson from '../../models/Lesson';
import moment, { duration } from 'moment';
import "moment/locale/vi"; 
import { LanguageContext } from '../../configs/LanguageConfig';

const ICON_SIZE = 20;

type LessonItemProps =  {
  lessonData: Lesson
}

export default function LessonItem({lessonData}: LessonItemProps) {
  const languageContext = useContext(LanguageContext);
  // Hàm lấy tên ngày từ số thứ tự
const days = [
  languageContext.language.SUNDAY,
  languageContext.language.MONDAY,
  languageContext.language.TUESDAY,
  languageContext.language.WEDNESDAY,
  languageContext.language.THURSDAY,
  languageContext.language.FRIDAY,
  languageContext.language.SATURDAY,
]


  return (
    <View style={[styles.lessonItem, styles.boxshadow]}>
    <View style={styles.contentLessonContainer}>
      <View style={styles.contenLessonTitle}>
        <Ionicons
          name="today-outline"
          size={ICON_SIZE}
          color="black"
        />
         <Text>{languageContext.language.LESSON_DAY}</Text>
      </View>
      <Text>{days[lessonData.day]}</Text>
    </View>

    <View style={styles.contentLessonContainer}>
      <View style={styles.contenLessonTitle}>
        <Ionicons
          name="timer-outline"
          size={ICON_SIZE}
          color="black"
        />
        <Text>{languageContext.language.LESSON_DURATION}</Text>
      </View>
      <Text>{lessonData.duration / 60000} {languageContext.language.MINUTES}</Text>
    </View>

    <View style={styles.contentLessonContainer}>
      <View style={styles.contenLessonTitle}>
      <Image
              source={require("../../../assets/images/ic_start_time.png")}
              style={styles.icImage}
            />
        <Text>{languageContext.language.START_TIME}</Text>
      </View>
      <Text>{moment(lessonData.started_at).format('LT')}</Text>
    </View>

    <View style={styles.contentLessonContainer}>
      <View style={styles.contenLessonTitle}>
      <Image
              source={require("../../../assets/images/ic_end_time.png")}
              style={styles.icImage}
            />
        <Text>{languageContext.language.END_TIME}</Text>
      </View>
      <Text>{moment(lessonData.started_at).add(lessonData.duration).format('LT')}</Text>
    </View>

    <View style={styles.contentLessonContainer}>
      <View style={styles.contenLessonTitle}>
        <Ionicons
          name="git-commit-outline"
          size={ICON_SIZE}
          color="black"
        />
        <Text>{languageContext.language.FORM}</Text>
      </View>
      <Text>{lessonData.is_online === true ? languageContext.language.ONLINE : languageContext.language.OFFLINE}</Text>
    </View>

    <View style={styles.line}></View>

    <View>
      <View
        style={[styles.contenLessonTitle, { marginBottom: 10 }]}
      >
        <Ionicons
          name="chatbox-ellipses-outline"
          size={ICON_SIZE}
          color="black"
        />
        <Text>{languageContext.language.LESSON_NOTE}</Text>
      </View>
      {lessonData.note && 
        <Text>
          {lessonData.note}
        </Text>
      }
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
    lessonListContainer: {
        marginHorizontal: 10,
      },
    
      lessonItem: {
        backgroundColor: BackgroundColor.white,
        borderRadius: 10,
        padding: 20,
        gap: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: BackgroundColor.gray_e6
      },
    
      contentLessonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
      },
    
      contenLessonTitle: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
      },

      boxshadow: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    
        elevation: 3,
      },

      line: {
        backgroundColor: BackgroundColor.gray_c6,
        height: 1,
      },

      icImage: {
        width: 24,
        height: 24,
      },
})