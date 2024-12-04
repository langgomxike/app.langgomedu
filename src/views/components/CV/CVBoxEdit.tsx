import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import HLine, { HLineType } from "../HLine";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { BackgroundColor, TextColor, } from "../../../configs/ColorConfig";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Education from "../../../models/Education";
import Experience from "../../../models/Experience";
import Certificate from "../../../models/Certificate";
import Modal from "react-native-modal";
import Ionicons from "@expo/vector-icons/Ionicons";
import Input from "../Inputs/CVInput";
import * as ImagePicker from "expo-image-picker";
import DropDownLocation from "../dropdown/DropDownLocationCV";
import Address from "../../../models/Address";
import UploadFile from "../../../models/uploadFile";

export type CvBoxProps = {
  title: string;
  typeItem: "education" | "experience" | "certificate";
  children?: ReactNode;
  onAddItem: (item: any) => void;
  onAddImage: (item: any, type: "education" | "experience" | "certificate") => void;
};

function convertDateStringToMilliseconds(dateString: string) {
  if (!dateString) {
    return 0;
  }
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day).getTime();
}

const CvBoxEdit = ({ title, typeItem, children, onAddItem , onAddImage}: CvBoxProps) => {
  //CONTEXTS, REFS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const isFirstRender = useRef(true);

  //state
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [startedAt, setStartedAt] = useState<string>("");
  const [endedAt, setEndedAt] = useState<string>("");
  const [score, setScore] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<any>(null);

  //address
  const [province, setProvince] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [ward, setWard] = useState<string>('');
  const [detail, setDetail] = useState<string>('');

  const [resetKey, setResetKey] = useState(0);

  const [errors, setErrors] = useState({
    name: false,
    note: false,
    startedAt: false,
    endedAt: false,
    address: false,
    evidence: false,
    score: false,
  });
  const [addressErrors, setAddressErrors] = useState({
    province: false,
    district: false,
    ward: false,
  })

  // HANDLER >>>>>>>>>>>>>>>>>>>>>>>
  const handleClickAccept = () => {
    // console.log(addressErrors, );
    
    if (!validateInputs()) {
      return; // Dừng lại nếu có lỗi
    }
    // prepare
    const address = new Address(-1, province, district, ward, detail);
    const started_at = convertDateStringToMilliseconds(startedAt);
    const ended_at = convertDateStringToMilliseconds(endedAt);
    const uploadFile = new UploadFile(selectedImage.uri, selectedImage.fileName, selectedImage.mimeType);
    onAddImage(uploadFile, typeItem);
    switch (typeItem) {
      case "education":
        const edu: Education = new Education(-1, name, note, address, started_at, ended_at, uploadFile);
        console.log(JSON.stringify(edu, null, 2));
        onAddItem(edu);
        handleClearItem();
        break;
      case "experience":
        const exp: Experience = new Experience(-1, name, note, address, started_at, ended_at, uploadFile);
        console.log(exp);
        onAddItem(exp);
        handleClearItem();
        break;
      case "certificate":
        const cer: Certificate = new Certificate(-1, name, note, score, started_at, ended_at, uploadFile);
        console.log(cer);
        onAddItem(cer)
        handleClearItem()
        break;
      default:
        break;
    }
    // onAddItem();
    setModalVisible(false)
  };
  const handleClearItem = useCallback(() => {
    setName('');
    setNote('');
    setStartedAt('');
    setEndedAt('');
    setScore('');
    setProvince('');
    setDistrict('');
    setWard('');
    setDetail('');
    setSelectedImage(null);
    isFirstRender.current = true;
  }, [])
  const handleCloseModal = useCallback(() => {
    // console.log("handleCloseModal");
    setModalVisible(false);
    resetValidate();
    handleClearItem(); // Reset các giá trị trong modal
    setResetKey((prevKey) => prevKey + 1);
  }, [])

  const validateInputs = () => {
    const newErrors = {
      name: name.trim() === "",
      note: note.trim() === "",
      startedAt: startedAt.trim() === "",
      endedAt: endedAt.trim() === "",
      address: typeItem === "certificate" ? false : detail.trim() === "",
      evidence: selectedImage === null,
      score: typeItem !== "certificate" ? false : score.trim() === "",
    };
    let newAddressErrors = {
      province : false,
      district : false,
      ward : false,
    }
    if(typeItem !== "certificate"){
      newAddressErrors = {
        province: province.trim() === "",
        district: district.trim() === "",
        ward: ward.trim() === "",
      }
    }
    
    setErrors(newErrors);
    setAddressErrors(newAddressErrors);

    // Trả về true nếu không có lỗi
    return !Object.values(newErrors).some((error) => error);
  };
  const resetValidate = () => {
    const errors = {
      name: false,
      note: false,
      startedAt: false,
      endedAt: false,
      address: false,
      evidence: false,
      score: false,
    }
    const addressErrors = {
      province: false,
      district: false,
      ward: false,
    }
    setErrors(errors);
    setAddressErrors(addressErrors);
  }
  const selectImage = async () => {
    // Request permission to access photos
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }

    // Open the image picker
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setSelectedImage(pickerResult.assets[0]);
      // console.log("Image selected:", pickerResult.assets[0]);
      // Handle the selected image URI, e.g., save or display it
    }
  }

  // EFFECTS >>>>>>>>>>>>>>>>>>>>>>>>
  //Revalidate Inputs
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return
    }
    validateInputs()
  }, [isFirstRender])


  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>{title}</Text>
        <HLine type={HLineType.LIGHT} />
        <View style={styles.children}>
          {children}
        </View>
      </View>
      <View style={styles.addButtonBox}>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
          style={styles.addButton}
        >
          <FontAwesome6 name="add" size={24} color={TextColor.white} />
        </TouchableOpacity>
      </View>

      <Modal
        key={resetKey}
        isVisible={modalVisible === true}
        animationIn={"slideInUp"}
        animationOut={"slideOutDown"}
        onBackdropPress={() => { handleCloseModal() }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.headerTitle}>Nhập thông tin</Text>
            <TouchableOpacity
              onPress={() => { handleCloseModal() }}
              style={styles.btnClose}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView
            // showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={styles.modalBody}>
            <Input
              label="Tên"
              onTextChange={setName}
              value={name}
              require={true}
              editable={true}
              error={errors.name}
            />

            <Input
              label="Ghi chú"
              onTextChange={setNote}
              value={note}
              require={true}
              editable={true}
              error={errors.note}
            />
            <View style={[styles.dateInputBox]}>
              <Input
                label={typeItem === "certificate" ? "Có Giá trị tại: " : "Ngày bắt đầu :"}
                onTextChange={setStartedAt}
                value={startedAt}
                require={true}
                editable={true}
                datePicker={true}
                error={errors.startedAt}
              />
              <Input
                label={typeItem === "certificate" ? "Hết hạn lúc: " : "Ngày Kết thúc :"}
                onTextChange={setEndedAt}
                value={endedAt}
                require={true}
                editable={true}
                datePicker={true}
                error={errors.endedAt}
              />
            </View>
            {typeItem === "certificate" ? <Input
                label={"Bậc điểm đạt được"}
                onTextChange={setScore}
                value={score}
                require={true}
                editable={true}
                error={errors.score}
              /> :
              <View>
              <Text style={styles.label}>Địa chỉ</Text>
              <DropDownLocation
                onSetSelectedProvince={setProvince}
                onSetSelectedDistrict={setDistrict}
                onSetSelectedWard={setWard}
                selectedProvince={province}
                selectedDistrict={district}
                selectedWard={ward}
                errors={addressErrors} />
              <Input
                label="Địa Chỉ Chi Tiết"
                onTextChange={setDetail}
                value={detail}
                editable={true}
                error={errors.address}
              />
            </View>
            }
            
            <View>
              <Text>Tải mình chứng</Text>

              {/* Uploading payment */}
              <View style={styles.uploadPaymentContainer}>
                <TouchableOpacity
                  onPress={selectImage}
                  style={[styles.uploadImageButton, styles.boxShadow, errors.evidence && styles.errorImageButton]}
                >
                  <Ionicons name="image-outline" size={24} color="black" />
                  <Text style={styles.buttonText}>Chọn hình</Text>
                </TouchableOpacity>

                <View style={styles.textContainer}>
                  <Text style={styles.uploadText}>
                    Tải ảnh minh chứng
                  </Text>
                  <Text style={styles.subText}>
                    Vui lòng tải lên ảnh chụp minh chứng.
                  </Text>
                </View>

                {/* Display the selected image if available */}
                {selectedImage && (
                  <Image
                    source={{ uri: selectedImage.uri }}
                    style={styles.selectedImage}
                  />
                )}
              </View>
            </View>

          </ScrollView>
          <View style={[styles.btnContainer]}>
            <TouchableOpacity
              onPress={() => handleClickAccept()}
              style={[styles.btn, styles.btnSave, styles.boxShadow]}
            >
              <Text style={styles.btnSaveText}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default CvBoxEdit;

const styles = StyleSheet.create({
  container: {},
  box: {
    marginVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: BackgroundColor.white,
    borderColor: BackgroundColor.gray_e6,
    elevation: 2,
    paddingBottom: 20,
  },
  title: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  children: {
    marginTop: 10,
    marginHorizontal: 10,
  },
  addButtonBox: {
    height: 20,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BackgroundColor.primary,
    position: "absolute",
    right: "0%",
    bottom: "75%",
  },

  // Modal
  modalContainer: {
    height: "70%",
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 20,
    shadowColor: "#000",
    overflow: "hidden",
  },
  modalHeader: {
    marginBottom: 20,
    borderBlockColor: BackgroundColor.gray_e6,
    borderBottomWidth: 1,
    paddingBottom: 10,
    justifyContent: "center",
    position: "relative",
  },

  headerTitle: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },

  btnClose: {
    position: "absolute",
    right: 0,
    top: 0,
  },

  subTitle: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 30,
  },

  selectedImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    borderRadius: 10,
    marginTop: 10,
  },

  modalBody: { flex: 1 },

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

  //upload file
  uploadPaymentContainer: {
    alignItems: "center",
    backgroundColor: BackgroundColor.white,
    marginTop: 10,
    paddingVertical: 20,
  },

  uploadImageButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  errorImageButton: {
    borderWidth: 0.5,
    borderColor: BackgroundColor.danger,
    backgroundColor: BackgroundColor.sub_danger,
  },

  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  textContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  subText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 10, // Để văn bản không tràn khi có nhiều nội dung
  },
  //button
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  btn: {
    padding: 15,
    borderRadius: 10,
  },

  btnSave: {
    flex: 1,
    backgroundColor: BackgroundColor.primary,
  },

  btnSaveText: {
    color: BackgroundColor.white,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },

  //input modal text
  dateInputBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingLeft: 5
  }
});
