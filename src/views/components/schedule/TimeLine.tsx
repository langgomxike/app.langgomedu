import { Text, View, StyleSheet, FlatList, Image } from "react-native";
import { BackgroundColor, TextColor } from "../../../configs/ColorConfig";
import LessionItem, { LessionItemProps } from "./LessionItem";
import Lesson from "../../../models/Lesson";
import { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
export type timeLineProp = {
  user_id?: string;
  student_id?: string;
  lessons: Lesson[];
  selectedDate: Date;
};

export default function TimeLine({
  user_id,
  student_id,
  lessons,
  selectedDate,
}: timeLineProp) {
  const [activeTab, setActiveTab] = useState("learning");

  return (
    <View style={[styles.container]}>
      <View style={styles.headerNav}>
        <View style={[styles.headerItem]}>
        <TouchableOpacity onPress={() => setActiveTab("learning")}>
            <Text
              style={[
                styles.headerText,
                activeTab === "learning" && styles.headerTextActive,
              ]}
            >
              Lớp đang học
            </Text>
        </TouchableOpacity>
        </View>

        <View style={[styles.headerItem]}>
          <TouchableOpacity onPress={() => setActiveTab("teaching")}>
            <Text
              style={[
                styles.headerText,
                activeTab === "teaching" && styles.headerTextActive,
              ]}
            >
              Lớp đang dạy
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {lessons.length === 0 ? (
        <View style={styles.boxEmpty}>
          <Image
            style={styles.imageEmpty}
            source={require("../../../../assets/images/alarm-off.png")}
          />
          <Text style={styles.textEmpty}> Hôm nay không có lớp học </Text>
        </View>
      ) : (
        <FlatList
          data={lessons}
          renderItem={({ item }) => {
            const classId = item.class?.id;
            const classIcon = item.class?.major?.icon;
            const title = item.class?.title;
            const classType = user_id === item.class?.tutor?.id ? 0 : 1;
            const tutorName = item.class?.tutor?.full_name;
            const startedAt = new Date(item.started_at);
            const duration = item.duration;
            return (
              <LessionItem
                classId={classId}
                lessonId={item.id}
                classIcon={classIcon}
                title={title ? title : ""}
                classType={classType}
                tutorName={tutorName ? tutorName : ""}
                startedAt={startedAt}
                duration={duration}
                selectedDate={selectedDate}
              />
            );
          }}
          contentContainerStyle={{
            paddingHorizontal: 10,
            marginTop: 5,
          }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          keyExtractor={(item, index) => `${item.id}${index}`}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // height: 400,
    marginHorizontal: 20,
    marginVertical: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: BackgroundColor.white,
    marginBottom: 150,
    // borderWidth: 1,
  },
  title: {
    paddingLeft: 10,
    fontSize: 18,
  },
  bold: {
    fontWeight: "bold",
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
  imageEmpty: {
    width: 150,
    height: 150,
    marginTop: 10,
  },
  textEmpty: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
  },
  boxEmpty: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 100,
  },

  headerNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginHorizontal: 50
    borderBottomColor: BackgroundColor.gray_c9,
    borderBottomWidth: 1,
  },

  headerItem: {
    flex: 1,
    alignItems: "center",
    gap: 10,
  },
  headerText: {
    fontWeight: "bold",
    color: "#888",
    padding: 10,
  },

  headerTextActive: {
    color: BackgroundColor.primary,
  },

  itemLineActive: {
    height: 3,
    width: "100%",
    borderRadius: 10,
    backgroundColor: BackgroundColor.primary,
  },
});
