import { Text, View, StyleSheet, FlatList, Image } from "react-native";
import { BackgroundColor, TextColor } from "../../../configs/ColorConfig";
import LessionItem, { LessionItemProps } from "./LessionItem";
import Lesson from "../../../models/Lesson";
import { useCallback, useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import User from "../../../models/User";
import { LanguageContext } from "../../../configs/LanguageConfig";
export type timeLineProp = {
  selectedUser?: User;
  lessons: Lesson[];
  selectedDate: Date;
  type: number;
  onChangeType: (type: number) => void;
};

/**
 * tyoe 0 => learner
 * type 1 => tutor
 */

export default function TimeLine({ selectedUser, lessons, selectedDate, type, onChangeType }: timeLineProp) {
  //State >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const [activeTab, setActiveTab] = useState(type);
  const languageContext = useContext(LanguageContext);
  //HANDLER >>>>>>>>>>>>>>>>>>>>>>>>>>
  const handleChangeType = useCallback((type: number) => {
    setActiveTab(type);
    onChangeType(type);
  }, [])

  useEffect(()=>{
    setActiveTab(type);
  }, [type])

  return (
    <View style={[styles.container]}>
      <View style={styles.headerNav}>
        <View style={[styles.headerItem, activeTab === 0 &&  styles.headerItemActive]}>
          <TouchableOpacity onPress={() => handleChangeType(0)}>
            <Text
              style={[
                styles.headerText,
                activeTab === 0 && styles.headerTextActive,
              ]}
            >
              {languageContext.language.LEARNING_CLASS}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.headerItem, activeTab === 1 &&  styles.headerItemActive]}>
          <TouchableOpacity onPress={() => handleChangeType(1)}>
            <Text
              style={[
                styles.headerText,
                activeTab === 1 && styles.headerTextActive,
              ]}
            >
              {languageContext.language.TEACHING_CLASS}
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
          <Text style={styles.textEmpty}> {languageContext.language.EMPTY_TODAY_CLASS} </Text>
        </View>
      ) : (
        <FlatList
          data={lessons}
          renderItem={({ item }) => {
            const classId = item.class?.id;
            const classIcon = item.class?.major?.icon;
            const title = item.class?.title;
            const classType = selectedUser?.id === item.class?.tutor?.id ? 0 : 1;
            const tutorName = item.class?.tutor?.full_name;
            const startedAt = new Date(item.started_at);
            const duration = item.duration;
            return (
              <LessionItem
                selectedUser={selectedUser}
                classId={classId}
                lessonData={item}
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
  headerItemActive: {
    backgroundColor: BackgroundColor.cyan_overlay,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: BackgroundColor.primary,
    borderBottomWidth: 0,
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
