import React, { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import { BackgroundColor } from "../../../configs/ColorConfig";
import { LanguageContext } from "../../../configs/LanguageConfig";

type Student = {
  id: number;
  name: string;
};

type StudentCheckboxProps = {
  visible: string | null;
  onRequestClose: () => void;
  studentList: Student[];
};

export default function StudentCheckbox({
  studentList,
  visible,
  onRequestClose,
}: StudentCheckboxProps) {
  // State
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const language = useContext(LanguageContext).language;

  // Handle
  // Hàm xử lý khi nhấn vào checkbox
  const handleToggleCheckbox = (id: number) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(
        selectedStudents.filter((studentId) => studentId !== id)
      );
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };
  return (
    <Modal visible={visible=== "modal_attended"} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        {/* Show the popup */}
        <View style={styles.container}>
          <View style={styles.modalTitleContainer}>
            <Text style={styles.modalTitle}>{language.ATTENDANCE_HISTORY}</Text>
            <TouchableOpacity onPress={onRequestClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{flex: 9}}>
            <FlatList
                    data={studentList}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                    return (
                      <View style={styles.attendedItemContainer}>
                      <TouchableOpacity activeOpacity={0.5}>
                        {/* Adttended date */}
                        <View style={[styles.row, styles.attendedDateContainer]}>
                          <FontAwesome
                            name="calendar-check-o"
                            size={15}
                            color="#64748b"
                          />
                          <Text style={styles.attendedDate}>03/10/2024</Text>
                        </View>
        
                        {/* History attended subject */}
                        <View style={[styles.row, styles.subjectContainer]}>
                          <Image
                            source={{
                              uri: "https://cdn-icons-png.flaticon.com/128/15311/15311632.png",
                            }}
                            style={styles.subjectImage}
                          />
                          <Text style={styles.subjecTitle}>{language.ANDROID_PROGRAM}</Text>
                        </View>
                        <View style={styles.badgeContainer}>
                          <Text style={[styles.badge, styles.payText]}>{language.PAYMENT}</Text>
                          <Text style={[styles.badge, styles.attendedText]}>{language.ATTEND}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    );
                    }}
                    contentContainerStyle={styles.contentContainerStyle}
                />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "95%",
    height: "80%",
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 20,
    shadowColor: "#000",
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "space-between",
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  contentContainerStyle: {
    paddingVertical: 10,
  },

  attendedItemContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: BackgroundColor.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    marginBottom: "3%",
    marginHorizontal: 5,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  subjectContainer: {
    marginTop: -10,
  },

  subjectImage: {
    width: 35,
    height: 35,
  },

  subjecTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },

  attendedDateContainer: {
    justifyContent: "flex-end",
    marginBottom: 10,
  },

  attendedDate: {
    color: "#64748b",
    fontSize: 12
  },

  badgeContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
    justifyContent: "flex-end",
  },

  badge: {
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 3,
    fontSize: 12,
  },
  payText: {
    backgroundColor: BackgroundColor.warning,
    color: BackgroundColor.black,
    fontWeight: "bold",
  },

  attendedText: {
    backgroundColor: BackgroundColor.primary,
    color: BackgroundColor.white,
    fontWeight: "bold",
  }
});
