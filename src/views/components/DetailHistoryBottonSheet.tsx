import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetFlatList 
} from "@gorhom/bottom-sheet";
import ClassInfo from "./ClassInfo";
import { BackgroundColor } from "../../configs/ColorConfig";
import {FlatList } from 'react-native-gesture-handler';

type DetailHistoryBottonSheetProps = {
  isVisible: boolean;
  onCloseButtonSheet: () => void;
};

export default function ({
  isVisible,
  onCloseButtonSheet,
}: DetailHistoryBottonSheetProps) {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Định nghĩa chiều cao BottomSheet
  const snapPoints = useMemo(() => ["50%", "90%"], []);

  // callbacks
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onCloseButtonSheet();
      }
    },
    [onCloseButtonSheet]
  );

  const renderBackProp = useCallback(
    (props: any) => {
      // Chỉ render backdrop khi BottomSheet đang hiển thị (isVisible === true)
      return isVisible ? (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      ) : null;
    },
    [isVisible]
  );

  // Mở hoặc đóng tùy theo `isVisible`
  if (isVisible && bottomSheetRef.current) {
    bottomSheetRef.current.snapToIndex(1);
  }

  //render
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      onChange={handleSheetChanges}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackProp}
    >
      <View style={styles.contentContainer}>
        <View style={styles.classInfoContainer}>

        <ClassInfo/>

          <View style={styles.line}></View>

        </View>
         {/* Other user */}
         <View style={styles.otherUserContainer}>
                <Text style={styles.titleContainer}>Phụ huyh/học sinh</Text>
                <FlatList
                  data={[1, 2, 3, 4, 5, 6]}
                  nestedScrollEnabled={true}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) =>{ 
                    return (
                    <View style={[styles.otherUserBox, styles.boxshadow]}>
                      <View
                        style={styles.otherUserPressable}
                      >
                        <View style={styles.otherUser}>
                          <View style={styles.otherUserAvatarContainer}>
                            <Image
                              source={require("../../../assets/avatar/img_avatar_cat.png")}
                              style={styles.otherUserAvatar}
                            />
                          </View>
                          <Text style={styles.otherUserName}>Nguyễn Văn B</Text>
                        </View>
                      </View>

                        <View
                          style={styles.otherUserContentContainer}
                        >
                          <View style={styles.contentBlock}>
                            <Text style={styles.textContentTitle}>Đã chuyển khoản cho bạn!</Text>
                            <TouchableOpacity onPress={() => {}}>
                            <Text style={styles.textSubTitle}>Xem thông tin</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                    </View>
                  )}}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  contentContainerStyle={styles.otherUserContainerList}
                />
              </View>

      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
  },

  classInfoContainer: {
  },

  line: {
    height: 1,
    backgroundColor: BackgroundColor.gray_e6,
    marginVertical: 20,
  },

  otherUserContainer: {
    backgroundColor: BackgroundColor.white,
    
  },

  titleContainer: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 10,
    paddingHorizontal: 20,
  },

  otherUserAvatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 999,
    overflow: "hidden",
  },

  otherUserAvatar: {
    width: 50,
    height: 50,
  },

  otherUserName: {
    fontWeight: "bold",
    fontSize: 15,
  },

  otherUserBox: {
    backgroundColor: BackgroundColor.white,
    borderWidth: 1,
    borderColor: BackgroundColor.gray_e6,
    borderRadius: 10,
    width: 300,
    marginRight: 10,
    overflow: "hidden",
  },

  otherUserPressable: {
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  otherUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  otherUserContainerList: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },

  boxshadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },

  otherUserContentContainer: {
    width: "100%",
    paddingBottom: 20,
  },

  contentBlock: {
    marginTop: 10,
    paddingHorizontal: 20,
    backgroundColor: BackgroundColor.white,
  },

  textContentTitle: {
    textAlign: "center",
  }, 

  textSubTitle: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    color: BackgroundColor.primary,
    fontWeight: "bold",
  },

  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "10%",
    gap: 20,
  },

  btn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    width: "40%",
  },

  btnText: {
    fontWeight: "bold",
    textAlign: "center",
  },

  btnDeny: {
    backgroundColor: BackgroundColor.warning,
  },

  btnAccpet: {
    backgroundColor: BackgroundColor.primary,
    color: BackgroundColor.white,
  },


});
