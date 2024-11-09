import { ScrollView, StyleSheet, Text } from "react-native";
import InfoClass from "./InfoClass";
import InfoLesson from "./InfoLesson";
import InfoTuition from "./InfoTuition";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useCallback, useEffect, useState } from "react";
import ClassLevel from "../../models/ClassLevel";
import AClass from "../../apis/AClass";
import { startAfter } from "firebase/database";

const Class = () => {
  // gia tri
  const [dataTitle, setDataTitle] = useState<string>("");
  const [dataDesc, setDataDesc] = useState<string>("");
  const [dataMajorId, setDataMajorId] = useState<number>(-1);
  const [dataClassLevel, setDataClassLevel] = useState<number>(-1);

  // lesson
  const [dataDayLesson, setDataDayLesson] = useState<number>(0);
  const [dataDuration, setDataDuration] = useState<number>(0);
  const [dataStartedAt, setDataStartedAt] = useState<number>(0);
  const [dataLessonType, setDataLessonType] = useState<boolean>(false);

  const [dataPrice, setDataPrice] = useState<number>(0);
  const [dataDateStart, setDataDateStart] = useState("");
  const [dataDateEnd, setDataDateEnd] = useState("");

  const handleDataChangeClass = (
    title?: string,
    desc?: string,
    monHoc?: string,
    capHoc?: number
  ) => {
    if (title) {
      setDataTitle(title);
    }

    if (desc) {
      setDataDesc(desc);
    }

    if (monHoc) {
      setDataMajorId(parseInt(monHoc));
    }

    if (capHoc) {
      setDataClassLevel(capHoc);
    }
  };

  const handleDataChangeLesson = (
    buoiHoc?: number,
    thoiLuongBuoiHoc?: number,
    thoiGianBatDau?: number,
    hinhThucHoc?: boolean
  ) => {
    if (buoiHoc !== undefined) {
      setDataDayLesson(buoiHoc);
    }
    if (thoiLuongBuoiHoc !== undefined) {
      setDataDuration(thoiLuongBuoiHoc);
    }
    if (thoiGianBatDau !== undefined) {
      setDataStartedAt(thoiGianBatDau);
    }
    if (hinhThucHoc !== undefined) {
      setDataLessonType(hinhThucHoc);
    }
  };

  const handleDataChangeTuition = (
    price?: string,
    dateStart?: string,
    dateEnd?: string
  ) => {
    if (price) {
      setDataPrice(parseFloat(price));
    }
    if (dateStart) {
      setDataDateStart(dateStart);
    }
    if (dateEnd) {
      setDataDateEnd(dateEnd);
    }
  };

  // convert string to date
  const convertStringToTimestamp = (dateString: string) => {
    // Tách ngày, tháng, năm từ chuỗi ngày
    const [day, month, year] = dateString.split("/").map(Number);

    // Tạo đối tượng Date với thứ tự là (year, month - 1, day)
    // Lưu ý: tháng trong Date là từ 0 - 11, nên cần trừ đi 1
    const dateObj = new Date(year, month - 1, day);

    // Kiểm tra tính hợp lệ của dateObj
    if (!isNaN(dateObj.getTime())) {
      // Trả về giá trị thời gian tính bằng milliseconds
      return dateObj.getTime();
    } else {
      // Trả về null nếu dateString không hợp lệ
      return null;
    }
  };

  const handleSaveClass = useCallback(() => {

    console.log("title: ", dataTitle);
    console.log("description: ", dataDesc);
    console.log("majorId: ", dataMajorId);
    console.log("classLevelId: ", dataClassLevel);
    console.log("gia: ", dataPrice);
    console.log("startedAt: ", dataDateStart);
    console.log("endedAt: ", dataDateEnd);
    console.log("Type of endedAt: ", typeof dataDateEnd);

    const lessons = [
      {
        day: dataDayLesson,
        started_at: dataStartedAt,
        duration: dataDuration,
        is_online: dataLessonType
      }
    ]
  
    if (dataDateStart && dataDateEnd) {
      console.log("huhu");

      AClass.createClass(
        dataTitle,
        dataDesc,
        dataMajorId,
        dataClassLevel,
        dataPrice,
        convertStringToTimestamp(dataDateStart),
        convertStringToTimestamp(dataDateEnd),
        lessons,
        () => {}
      );
    }
  }, [
    dataTitle,
    dataDesc,
    dataMajorId,
    dataClassLevel,
    dataPrice,
    dataDateStart,
    dataDateEnd,
    dataDayLesson,
    dataStartedAt,
    dataDuration,
    dataLessonType,
  ]);
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <InfoClass onNext={handleDataChangeClass} />
      <InfoLesson onNext={handleDataChangeLesson} />
      <InfoTuition onNext={handleDataChangeTuition} />
      <TouchableOpacity style={styles.btnNext} onPress={handleSaveClass}>
        <Text style={styles.txtNext}>Tạo Lớp</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Đảm bảo chiếm đủ không gian
    paddingBottom: 250,
  },
  btnNext: {
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
    height: 40,
    backgroundColor: "#0D99FF",
    marginTop: 20,
    borderRadius: 10,
    marginLeft: 75,
  },
  txtNext: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Class;
