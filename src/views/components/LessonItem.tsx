import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { BackgroundColor } from '../../configs/ColorConfig';

const ICON_SIZE = 20;

export default function LessonItem() {
  return (
    <View style={[styles.lessonItem, styles.boxshadow]}>
    <View style={styles.contentLessonContainer}>
      <View style={styles.contenLessonTitle}>
        <Ionicons
          name="today-outline"
          size={ICON_SIZE}
          color="black"
        />
        <Text>Buổi học</Text>
      </View>
      <Text>Thứ 2</Text>
    </View>

    <View style={styles.contentLessonContainer}>
      <View style={styles.contenLessonTitle}>
        <Ionicons
          name="timer-outline"
          size={ICON_SIZE}
          color="black"
        />
        <Text>Thời lượng</Text>
      </View>
      <Text>2 giờ</Text>
    </View>

    <View style={styles.contentLessonContainer}>
      <View style={styles.contenLessonTitle}>
        <Ionicons
          name="git-commit-outline"
          size={ICON_SIZE}
          color="black"
        />
        <Text>Hình thức</Text>
      </View>
      <Text>Online</Text>
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
        <Text>Ghi chú</Text>
      </View>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipisicing
        elit.
      </Text>
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
})