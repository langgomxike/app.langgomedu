import { FlatList , StyleSheet, View, Text} from "react-native";
import CustomShimmer from "./CustomShimmer";
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BackgroundColor } from "../../../configs/ColorConfig";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");
export default function ClassListSkeleton() {
    return (
        <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            data={[1, 1]}
            renderItem={(item) => (
                <View style={styles.classItem}>
                <View style={[styles.courseContainer, styles.boxShadow]}>
                {/* Header */}
                <View>
                  <LinearGradient
                    colors={["#52edff", "#0D99FF"]} // Tạo màu gradient từ xanh đậm sang xanh nhạt
                    style={styles.header}
                  >
                   <CustomShimmer width={40} height={40} isCircle={true}/>
                   <CustomShimmer width={SCREEN_WIDTH * 0.4} height={20} isCircle={true} style={{marginTop: 10, marginBottom: 20}}/>
                  </LinearGradient>
                </View>
                {/* Content */}
                <View style={styles.content}>
                  <View style={styles.contentHorizontal}>
                    <View
                      style={[
                        styles.contentItem,
                        styles.twoSection,
                        { paddingVertical: 5 },
                      ]}
                    >
                      <CustomShimmer  height={15} isCircle={true} style={{marginTop: 10}}/>
                    </View>
          
                    <View
                      style={[
                        styles.contentItem,
                        styles.twoSection,
                        { justifyContent: "flex-end" },
                      ]}
                    >
                      <CustomShimmer  height={15} isCircle={true} style={{marginTop: 10}}/>
                    </View>
                  </View>
          
                  <View style={styles.line} />
          
                  <View
                    style={[
                      styles.contentItemContainer,
                      styles.marginButtom,
                      { paddingTop: 10 },
                    ]}
                  >
                     <CustomShimmer height={15} width={SCREEN_WIDTH * 0.5} isCircle={true} style={{flex: 1}}/>
                  </View>
          
                  <View style={[styles.contentItemContainer, styles.marginButtom]}>
                  <CustomShimmer height={15} width={SCREEN_WIDTH * 0.6} isCircle={true}/>
                  </View>
          
                  <View
                    style={[
                      { flexDirection: "column", justifyContent: "space-between" },
                      styles.marginButtom,
                    ]}
                  >
                    <CustomShimmer height={15} width={SCREEN_WIDTH * 0.3} isCircle={true}/>
                    <CustomShimmer height={20} width={SCREEN_WIDTH * 0.6} isCircle={true} style={{marginTop:10}}/>
                  </View>
                  <View style={styles.line} />
          
                  <View>
                  <CustomShimmer height={25} width={SCREEN_WIDTH * 0.5} isCircle={true}/>
                  </View>
                </View>
              </View>

                </View>
            )}
            contentContainerStyle={{ padding: 10,}}
          />
    )
}

const styles = StyleSheet.create({
    footerText: {
      color: "#0D99FF",
      fontWeight: "600",
      fontSize: 18,
    },
    marginButtom: {
      marginBottom: 10,
    },
    line: {
      height: 1,
      backgroundColor: BackgroundColor.gray_c6,
      marginVertical: 10,
    },
    contentText: {
      fontSize: 14,
      textAlign: "right",
      fontWeight: "500",
      color: "#4D5267",
    },
    contentIcon: {
      width: 23,
      height: 23,
    },
    twoSection: {
      flex: 1,
    },
    contentItem: {
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
    },
  
    contentHorizontal: {
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
    },
    content: {
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    courseImage: {
      width: 40,
      height: 40,
      marginBottom: 15,
    },
    header: {
      paddingVertical: 20,
      paddingHorizontal: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
  
    courseContainer: {
      backgroundColor: "white",
      borderRadius: 20,
    },
  
    boxShadow: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
  
      elevation: 3,
    },
  
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: "white",
      height: 45,
    },
  
    contentItemContainer: {
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
      justifyContent: "space-between",
    },
  
    item: {
      flexDirection: "row",
      gap: 8,
    },
  
    contentAddress: {
      fontSize: 14,
      textAlign: "left",
      fontWeight: "500",
      color: "#4D5267",
      marginLeft: 5,
      marginTop: 5,
    },

    classItem: {
        padding: 10,
        width: SCREEN_WIDTH * 0.8,
      },
  });
  