import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import { useContext, useState } from "react";
import LearnerClass from "../components/LearnerClass"; // Phụ huynh tạo lớp
import TurtorClass from "../components/TurtorClass"; // Gia sư tạo lớp
import { AccountContext } from "../../configs/AccountConfig";
import { RoleList } from "../../models/Role";

export default function CreateClassScreen() {

  // Giả lập vai trò (role)
  const accountContext = useContext(AccountContext); // lay duoc acount

  // State quản lý tab đang được chọn
  const [activeTab, setActiveTab] = useState<number | null>(null);

  // Xử lý nhấn tab
  const handleTabPress = (tabIndex: number) => {

    const roleIds = accountContext.account?.roles?.map(role => role.id)

    // Kiểm tra quyền truy cập tab
    if ((tabIndex === 0 && roleIds?.includes(RoleList.TUTOR)) || (tabIndex === 1 && roleIds?.includes(RoleList.PARENT))) {
      Alert.alert("Thông báo", "Bạn không có quyền truy cập tab này!");
      return;
    }
    setActiveTab(tabIndex); // Đặt tab đang được chọn
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tạo lớp học tuyển sinh</Text>
      <View style={styles.tabContainer}>
        {/* Tab Phụ huynh tạo lớp */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 0 && styles.activeTab]} // Tab đang được chọn
          onPress={() => handleTabPress(0)} // Xử lý nhấn tab
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 0 && styles.activeTabText, // Text tab đang được chọn
            ]}
          >
            PHỤ HUYNH TẠO LỚP
          </Text>
        </TouchableOpacity>

        {/* Tab Gia sư tạo lớp */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 1 && styles.activeTab]} // Tab đang được chọn
          onPress={() => handleTabPress(1)} // Xử lý nhấn tab
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 1 && styles.activeTabText, // Text tab đang được chọn
            ]}
          >
            GIA SƯ TẠO LỚP
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