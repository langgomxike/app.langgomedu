import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import ProfileScreen from "./Profile";
import { useState } from "react";
import InfoClass from "../components/InfoClass";

export default function CreateClassScreen() {
  const [activeTab, setActiveTab] = useState("classInfo"); // State để quản lý tab đang được chọn
  const [title, setTitle] = useState("");

  return (
    <View style={styles.container}>
        <Text style={styles.header}>Tạo lớp học tuyển gia sư</Text>
      <View style={styles.tabContainer}>
        {/* Tab Thông tin lớp */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab("classInfo")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "classInfo" && styles.activeTabText,
            ]}
          >
            Thông tin lớp
          </Text>
          {activeTab === "classInfo" && <View style={styles.activeTabLine} />}
        </TouchableOpacity>

        {/* Tab Thông tin học sinh */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab("studentInfo")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "studentInfo" && styles.activeTabText,
            ]}
          >
            Thông tin học sinh
          </Text>
          {activeTab === "studentInfo" && <View style={styles.activeTabLine} />}
        </TouchableOpacity>
      </View>

      {/* Nội dung của từng tab */}
      <View style={styles.contentContainer}>
        {activeTab === "classInfo" ? (
          <InfoClass/>
        ) : (
          <Text>Nội dung Thông tin học sinh</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    // backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 30,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
  },
  tab: {
    alignItems: "center",
    flex: 1,
  },
  tabText: {
    fontSize: 16,
    color: "gray",
  },
  activeTabText: {
    color: "#4da6ff", // Màu của tab đang hoạt động
    fontWeight: "bold",
  },
  activeTabLine: {
    width: "100%",
    height: 2,
    backgroundColor: "#4da6ff", // Màu của đường gạch dưới tab đang hoạt động
    marginTop: 5,
  },
  contentContainer: {
    marginTop: 20,
  },
});
