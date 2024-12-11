import React, {useCallback, useContext, useMemo, useRef, useState} from "react";
import {Image, Modal, Pressable, StyleSheet, Text, View} from "react-native";
import BottomSheet, {BottomSheetBackdrop} from "@gorhom/bottom-sheet";
import {BackgroundColor, TextColor} from "../../../configs/ColorConfig";
import Attendance from "../../../models/Attendance";
import ReactAppUrl from "../../../configs/ConfigUrl";
import ImageViewer from "react-native-image-zoom-viewer";
import {IImageInfo} from "react-native-image-zoom-viewer/built/image-viewer.type";
import DateTimeConfig from "../../../configs/DateTimeConfig";
import {ClassDetailRoute, IdNavigationType} from "../../../configs/NavigationRouteTypeConfig";
import {NavigationContext} from "@react-navigation/native";
import ScreenName from "../../../constants/ScreenName";

type DetailHistoryBottonSheetProps = {
  isVisible: boolean;
  onCloseButtonSheet: () => void;
  attendance?: Attendance;
};

export default function ({
                           isVisible,
                           onCloseButtonSheet,
                           attendance
                         }: DetailHistoryBottonSheetProps) {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const navigation = useContext(NavigationContext);

  //states
  const [viewEvidence, setViewEvidence] = useState(false);

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

  const goToProfile = useCallback(() => {
    const data: IdNavigationType = {
      id: attendance?.user?.id ?? "-1",
    }

    navigation?.navigate(ScreenName.PROFILE, data);
  }, []);

  const goToDetailClass = useCallback(() => {
    const data: ClassDetailRoute = {
      classId: attendance?.class?.id ?? -1,
    }

    navigation?.navigate(ScreenName.DETAIL_CLASS, data);
  }, []);

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

        <View style={{flexDirection: "row", gap: 10, justifyContent: "flex-end", marginHorizontal: 20}}>
          <Pressable onPress={goToProfile}>
            <Image src={ReactAppUrl.PUBLIC_URL + attendance?.user?.avatar} style={styles.avatar}/>
          </Pressable>

          <Pressable onPress={goToDetailClass}>
            <Image src={ReactAppUrl.PUBLIC_URL + attendance?.class?.major?.icon} style={styles.avatar}/>
          </Pressable>
        </View>

        <View style={styles.line}/>

        <Text
          style={[styles.itemContainer, {borderColor: attendance?.attended_at ? BackgroundColor.sub_primary : BackgroundColor.sub_danger}]}>
          Diem
          danh: {attendance?.attended_at ? DateTimeConfig.getDateFormat(attendance.attended_at, true, true) : "Chua diem danh"}</Text>

        <Text
          style={[styles.itemContainer, {borderColor: attendance?.deferred ? BackgroundColor.sub_primary : BackgroundColor.sub_danger}]}>
          Ghi no: {attendance?.deferred ? "Da thuc hien ghi no" : "Khong ghi no"}</Text>

        <Text
          style={[styles.itemContainer, {borderColor: attendance?.confirm_deferred_at ? BackgroundColor.sub_primary : BackgroundColor.sub_danger}]}>
          Xac nhan ghi
          no: {attendance?.confirm_deferred_at ? DateTimeConfig.getDateFormat(attendance.confirm_deferred_at, true, true) : "Chua duoc xac nhan"}</Text>

        <Text
          style={[styles.itemContainer, {borderColor: attendance?.paid_at ? BackgroundColor.sub_primary : BackgroundColor.sub_danger}]}>
          Thanh
          toan: {attendance?.paid_at ? DateTimeConfig.getDateFormat(attendance.paid_at, true, true) : "Chua thanh toan"}</Text>

        <Text
          style={[styles.itemContainer, {borderColor: attendance?.type ? BackgroundColor.sub_primary : BackgroundColor.sub_danger}]}>Hinh
          thuc thanh
          toan: {attendance?.type ?? "Khong the xac minh"}</Text>

        <Text
          style={[styles.itemContainer, {borderColor: attendance?.confirm_paid_at ? BackgroundColor.sub_primary : BackgroundColor.sub_danger}]}>
          Xac nhan thanh
          toan: {attendance?.confirm_paid_at ? DateTimeConfig.getDateFormat(attendance.confirm_paid_at, true, true) : "Chua duoc xac nhan"}</Text>

        <Pressable style={{flex: 1,}} onPress={() => setViewEvidence(true)}>
          <Image src={ReactAppUrl.PUBLIC_URL + attendance?.payment_path}
                 style={[styles.img, {borderColor: BackgroundColor.warning, borderWidth: 1,}]}/>
        </Pressable>

        <Modal visible={viewEvidence}>
          <ImageViewer onCancel={() => setViewEvidence(false)}
                       enableSwipeDown={true}
                       imageUrls={[{url: ReactAppUrl.PUBLIC_URL + attendance?.payment_path}] as IImageInfo[]}/>
        </Modal>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    gap: 10,
  },

  img: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    width: "60%",
    alignSelf: "center",
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: BackgroundColor.sub_primary,
  },

  line: {
    height: 1,
    backgroundColor: BackgroundColor.gray_e6,
    marginVertical: 5,
  },

  itemContainer: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    backgroundColor: BackgroundColor.white,
    color: TextColor.black,
    shadowColor: BackgroundColor.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});
