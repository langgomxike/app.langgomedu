import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import CourseItem from "../CourseItem";
import { BackgroundColor } from "../../../configs/ColorConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ClassComponent from "../admin/ClassComponent";

type DetailHistoryBottonSheetProps = {
  isVisible: boolean;
  onCloseButtonSheet: () => void;
};

const ICON_SIZE = 20;

export default function ({
  isVisible,
  onCloseButtonSheet,
}: DetailHistoryBottonSheetProps) {
  //state
  const [report, setReport] = useState(false);

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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <ClassComponent/>
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
  },

  userAvatar: {
    width: 40,
    height: 40,
  },

  headerContainer: {},

  userAvatarContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    gap: 10,
  },

  userInfoBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  badge: {
    backgroundColor: "#FF5050",
    color: "#fff",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 2,
    fontWeight: "medium",
  },

  userFullName: {
    fontSize: 16,
    fontWeight: "bold",
  },

  userHeaderContent: {},

  line: {
    backgroundColor: BackgroundColor.gray_c6,
    height: 1,
    marginVertical: 10,
  },
});
