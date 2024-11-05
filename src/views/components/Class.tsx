import { ScrollView, StyleSheet, Text } from "react-native";
import InfoClass from "./InfoClass";
import InfoLesson from "./InfoLesson";
import InfoTuition from "./InfoTuition";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import ClassLevel from "../../models/ClassLevel";

const Class = () => {
  const [dataTitle, setDataTitle] = useState<string>("");
  const [dataDesc, setDataDesc] = useState<string>("");
  const [dataMonHoc, setDataMonHoc] = useState<string>("");
  const [dataCapHoc, setDataCapHoc] = useState<ClassLevel>();

  const [dataBuoiHoc, setDataBuoiHoc] = useState<string>("");
  const [dataThoiGianBuoiHoc, setDataThoiGianBuoiHoc] = useState<number>(0);
  const [dataThoiGianBatDau, setDataThoiGianBatDau] = useState<number>(0);
  const [dataHinhThuc, setDataHinhThuc] = useState<boolean>(false);

  const [dataTuition, setDataTuition] = useState("");
  const [dataDateStart, setDataDateStart] = useState<Date | null>(null);
  const [dataDateEnd, setDataDateEnd] = useState<Date | null>(null);

  const handleDataChangeClass = (title?: string, desc?: string, monHoc?: string, capHoc?: ClassLevel) => {
 
    if (title) {
      setDataTitle(title);
    }

    if (desc) {
      setDataDesc(desc);
    }

    if (monHoc) {
      setDataMonHoc(monHoc);
    }

    if (capHoc) {
      setDataCapHoc(capHoc);
    }
  };

  const handleDataChangeLesson = (buoiHoc?: string, thoiLuongBuoiHoc?: number, thoiGianBatDau?: number, hinhThucHoc?: boolean) => {
    if (buoiHoc) {
      setDataBuoiHoc(buoiHoc);
    }
    if (thoiLuongBuoiHoc) {
      setDataThoiGianBuoiHoc(thoiLuongBuoiHoc);
    }
    if (thoiGianBatDau) {
      setDataThoiGianBatDau(thoiGianBatDau);
    }
    if (hinhThucHoc) {
      setDataHinhThuc(hinhThucHoc);
    }
  }

  const handleDataChangeTuition = (tuition?: string, dateStart?: Date, dateEnd?: Date) => {
    if (tuition) {
      setDataTuition(tuition);
    }
    if (dateStart) {
      setDataDateStart(dateStart);
    }
    if (dateEnd) {
      setDataDateEnd(dateEnd);
    }
  }

  const handleNext = () => {
    console.log("value: ", dataTitle);
  };

  useEffect(() => {
    console.log("title: ", dataTitle);
    console.log("desc: ", dataDesc);
    console.log("mon hoc: ", dataMonHoc);
    console.log("cap hoc: ", dataCapHoc);
    
  }, [dataTitle, dataDesc, dataMonHoc, dataCapHoc]);

  useEffect(() => {
    console.log("buoi hoc: ", dataBuoiHoc);
    console.log("thoi luong buoi hoc: ", dataThoiGianBuoiHoc);
    console.log("thoi gian bat dau: ", dataThoiGianBatDau);
    console.log("hinh thuc hoc: ", dataHinhThuc);
    
  }, [dataBuoiHoc, dataThoiGianBuoiHoc, dataThoiGianBatDau, dataHinhThuc]);

  useEffect(() => {
    console.log("hoc phi: ", dataTuition);
    console.log("ngay bat dau: ", dataDateStart);
    console.log("ngay ket thuc: ", dataDateEnd);
    
  }, [dataTuition, dataDateStart, dataDateEnd]);


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <InfoClass onNext={handleDataChangeClass}/>
      <InfoLesson onNext={handleDataChangeLesson}/>
      <InfoTuition onNext={handleDataChangeTuition}/>
      <TouchableOpacity style={styles.btnNext} onPress={handleNext}>
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
