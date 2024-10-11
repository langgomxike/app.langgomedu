import React from "react";
import { StyleSheet,
    ScrollView,
    Text,
    View,
    Image,
    TouchableOpacity, } from "react-native";
    import Ionicons from "@expo/vector-icons/Ionicons";
import { BackgroundColor } from "../../configs/ColorConfig";

export default function () {
    return (
        <View>
            {/* Class infomation */}
            <View style={styles.classInfoContainer}>
                {/* Tiêu đề môn học */}
                <Text style={styles.classInfoTitle}>Tìm gia sư</Text>

                <View style={styles.row}>
                  <View style={styles.itemInfoTwo}>
                    <Ionicons name="book-outline" size={24} color="black" />
                    <Text>Cao đẳng</Text>
                  </View>

                  <View
                    style={[styles.itemInfoTwo, { justifyContent: "flex-end" }]}
                  >
                    <Ionicons name="calendar-outline" size={24} color="black" />
                    <Text>03/10/2024</Text>
                  </View>
                </View>

                <View style={[styles.line, { marginTop: 10 }]}></View>

                <View style={styles.itemInfo}>
                  <View style={styles.row}>
                    <Ionicons name="cube-outline" size={24} color="black" />
                    <Text>Lớp</Text>
                  </View>
                  <Text style={styles.itemContent}>Cao đẳng</Text>
                </View>

                <View style={styles.itemInfo}>
                  <View style={styles.row}>
                    <Ionicons
                      name="git-commit-outline"
                      size={24}
                      color="black"
                    />
                    <Text>Hình thức</Text>
                  </View>
                  <Text style={styles.itemContent}>Tại nhà</Text>
                </View>

                <View style={styles.itemInfo}>
                  <View style={styles.row}>
                    <Ionicons name="timer-outline" size={24} color="black" />
                    <Text>Thời gian</Text>
                  </View>
                  <Text style={[styles.itemContent]}>4 giờ/Buổi</Text>
                </View>

                <View style={styles.itemInfo}>
                  <View style={styles.row}>
                    <Ionicons name="cash-outline" size={24} color="black" />
                    <Text>Học phí</Text>
                  </View>
                  <Text style={[styles.itemContent]}>100.000 VNĐ/Buổi</Text>
                </View>

                <View style={styles.itemInfo}>
                  <View style={styles.row}>
                    <Image
                      source={require("../../../assets/images/ic_start_time.png")}
                      style={styles.icImage}
                    />
                    <Text>Bắt đầu</Text>
                  </View>
                  <Text style={[styles.itemContentBlack]}>8:00</Text>
                </View>

                <View style={styles.itemInfo}>
                  <View style={styles.row}>
                    <Image
                      source={require("../../../assets/images/ic_end_time.png")}
                      style={styles.icImage}
                    />
                    <Text>Kết thúc</Text>
                  </View>
                  <Text style={[styles.itemContentBlack]}>11:00</Text>
                </View>
              </View>
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