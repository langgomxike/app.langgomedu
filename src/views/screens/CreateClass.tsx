import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import { useContext, useState } from "react";
import LearnerClass from "../components/CreateClass/LearnerClass"; // Phụ huynh tạo lớp
import TurtorClass from "../components/CreateClass/TurtorClass"; // Gia sư tạo lớp
import { AccountContext } from "../../configs/AccountConfig";
import { RoleList } from "../../models/Role";
import { LanguageContext } from "../../configs/LanguageConfig";

export default function CreateClassScreen() {
  const accountContext = useContext(AccountContext);
  const languageContext = useContext(LanguageContext).language;

  const [activeTab, setActiveTab] = useState<number | null>(0);

  const handleTabPress = (tabIndex: number) => {
    const roleIds = accountContext.account?.roles?.map((role) => role.id);

    if (tabIndex === 1) {
      // Tab "Tạo lớp cho gia sư"
      if (!(roleIds?.includes(RoleList.TUTOR) && !roleIds?.includes(RoleList.BANNED_USER))) {
        Alert.alert(
          languageContext.NOTIFICATION.toUpperCase(),
          languageContext.NO_ACCESS_TUTOR
        );
        return;
      }
    }

    setActiveTab(tabIndex); // Chỉ set activeTab nếu qua tất cả các điều kiện trên
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{languageContext.CREATE_CLASS}</Text>
      <View style={styles.tabContainer}>
        {/* Tab Phụ huynh tạo lớp */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 0 && styles.activeTab]}
          onPress={() => handleTabPress(0)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 0 && styles.activeTabText,
            ]}
          >
            {languageContext.CREATE_CLASS_FOR_PARENT}
          </Text>
        </TouchableOpacity>

        {/* Tab Gia sư tạo lớp */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 1 && styles.activeTab]}
          onPress={() => handleTabPress(1)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 1 && styles.activeTabText,
            ]}
          >
            {languageContext.CREATE_CLASS_FOR_TUTOR}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nội dung của từng tab */}
      <View>
        {activeTab === 0 && <LearnerClass />}
        {activeTab === 1 && <TurtorClass />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    padding: 20,
    backgroundColor: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
  },
  tab: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: "gray",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#4da6ff", // Đường gạch dưới tab được chọn
  },
  activeTabText: {
    color: "#4da6ff", // Màu chữ tab được chọn
    fontWeight: "bold",
  },
});
