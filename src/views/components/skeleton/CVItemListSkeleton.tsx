import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native'
import { BackgroundColor } from '../../../configs/ColorConfig';
import CustomShimmer from './CustomShimmer';

const {width: SCREEN_WIDTH} = Dimensions.get("screen");
export default function CVItemListSkeleton() {
  return (
   <FlatList
   horizontal={true}
   showsHorizontalScrollIndicator={false}
   scrollEnabled={false}
   data={[1,2,3]}
   renderItem={() => (
    <View style={styles.cvItem}>
    <View style={[styles.container, styles.boxShadow]}>
      <View style={styles.headerContainer}>
        <View style={[styles.boxShadow, {alignItems: "center"}]}>
          <CustomShimmer width={70} height={70} isCircle={true} />
          <CustomShimmer width={SCREEN_WIDTH * 0.2} height={20} style={{marginTop: -15}} />
        </View>
        <CustomShimmer width={SCREEN_WIDTH * 0.4} height={20} style={{margin: 10}} />
      </View>

      <View style={styles.bodyContainer}>
        <View style={styles.personalInfomation}>
          {/* <View style={styles.col2}> */}
          {/* Phone */}
          <View style={[styles.infoContent]}>
          <CustomShimmer width={SCREEN_WIDTH * 0.5} height={17} />
          </View>

          <View style={[styles.infoContent]}>
          <CustomShimmer width={SCREEN_WIDTH * 0.6} height={17} />
          </View>
          <View style={[styles.infoContent]}>
          <CustomShimmer width={SCREEN_WIDTH * 0.3} height={17} />
          </View>

          <View style={{ flexDirection: "column", gap: 5, justifyContent: "space-between"}}>
          <CustomShimmer width={SCREEN_WIDTH * 0.2} height={17} />
          </View>
          <CustomShimmer width={SCREEN_WIDTH * 0.6} height={30} />
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
    cvItem: {
        width: SCREEN_WIDTH * 0.8
    },
    container: {
      backgroundColor: BackgroundColor.white,
      borderRadius: 20,
      margin: 10
    },
  
    scrollContainer: {
      padding: 10, // Khoảng cách bên trong
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
  
    boxshadow2: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
  
      elevation: 2,
    },
  
    headerContainer: {
      backgroundColor: BackgroundColor.primary,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      alignItems: "center",
      paddingVertical: 20,
    },
  
    bodyContainer: {
      backgroundColor: BackgroundColor.white,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
  
    line: {
      height: 1,
      backgroundColor: BackgroundColor.gray_c6,
    },
  
    personalInfomation: {
      paddingHorizontal: 20,
      paddingBottom: 10,
      marginVertical: 15,
      gap: 20,
    },
  
    infoContent: {
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
      justifyContent: "space-between",
    },

  
  
  });