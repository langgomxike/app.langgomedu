import { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CustomInput from "./Inputs/CustomInput";
import { BackgroundColor } from "../../configs/ColorConfig";
import RadioButton from "./Inputs/CustomRadioButton";
import ReactNativeModal from "react-native-modal";
import { Feather, Ionicons, Octicons } from "@expo/vector-icons";
import DropDownAddress from "./dropdown/DropDownAddress";
import DropDownMajors from "./dropdown/DropDownMajors";
import { TextInput } from "react-native-gesture-handler";

type FilterProps = {
  isVisible: boolean;
  onRequestClose: () => void;
};

const optionForms = [
  { label: "Online", value: "online" },
  { label: "Offline", value: "offline" },
];

const customPadding = 30;
const customPaddingHorizontal = 10;
const customPaddingVertical = 30;
const customBorderTopLeftRadius = 30;
const customBorderBottomLeftRadius = 30;
const customOverlayHeight = "100%";

const Filter = ({ isVisible, onRequestClose }: FilterProps) => {
  // USESTATE
  // CHECK BOX
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // SET VALUE "GIA NHO NHAT, GIA LON NHAT"
  const [minPrice, setMinPrice] = useState<string>(""); // Giá trị tối thiểu
  const [maxPrice, setMaxPrice] = useState<string>(""); // Giá trị tối đa
  const [error, setError] = useState<string | null>(null); // Thông báo lỗi

  // SET VALUE INPUT
  const [location, setLocation] = useState("");
  const [subject, setSubject] = useState("");
  const [itemLocations, setItemLocations] = useState<string[]>([]);
  const [itemSubjects, setItemSubjects] = useState<string[]>([]);
  const [quantitys, setQuantitys] = useState<number>(0);

  // HANDLE USECALLBACK
  const handleSelect = useCallback((selected: string[]) => {
    setSelectedValues(selected);
  }, []);

  const handleCloseModel = useCallback(() => {
    onRequestClose();
  }, [onRequestClose]);

  // LOCATON
  const handleInputLocation = () => {
    if (location.trim() === "") {
      return;
    }

    setItemLocations((prevLocations) => {
      const updatedList = [location, ...prevLocations]; // Thêm địa điểm mới vào đầu danh sách
      return updatedList.slice(0, 5); // Giới hạn chỉ tối đa 5 địa điểm
    });
    setLocation("");
  };

  const removeItemLocation = (index: number) => {
    setItemLocations((prevLocations) => {
      return prevLocations.filter((_, i) => i !== index);
    });
  };

  // SUBJECT
  const handleInputSubject = () => {
    if (subject.trim() === "") {
      return;
    }

    setItemSubjects((prevSubjects) => {
      const updatedList = [subject, ...prevSubjects];
      return updatedList.slice(0, 5); // Giới hạn chỉ tối đa 5 địa điểm
    });
    setSubject("");
  };

  const removeItemSubject = (index: number) => {
    setItemSubjects((prevSubjects) => {
      return prevSubjects.filter((_, i) => i !== index);
    });
  };

  // PRICE
  // Kiểm tra điều kiện giá
  const validatePrice = (min: string, max: string) => {
    const minVal = parseFloat(min);
    const maxVal = parseFloat(max);

    if (!isNaN(minVal) && !isNaN(maxVal) && minVal > maxVal) {
      setError("Giá tối thiểu không được lớn hơn giá tối đa.");
    } else {
      setError(null);
    }
  };

  // Hàm xử lý khi giá trị thay đổi
  const handleMinPriceChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setMinPrice(value);
    }
    validatePrice(value, maxPrice);
  };

  const handleMaxPriceChange = (value: string) => {
    if (/^\d*$/.test(value)) {
    setMaxPrice(value);
    }
    validatePrice(minPrice, value);
  };

  // SO LUONG
  const handleQuantity = (value: string) => {
    // chuyen doi chuoi thanh so
    const quantitys = parseFloat(value);
    if (quantitys < 0) {
      setQuantitys(0);
    } else {
      setQuantitys(quantitys);
    }
  };

  const handleAsc = useCallback(() => {
    Alert.alert("ASC", "asc");
  }, []);

  const handleDesc = useCallback(() => {
    Alert.alert("DESC", "desc");
  }, []);

  const handleApply = useCallback(() => {
    Alert.alert("APPLY", "apply");
    onRequestClose();
  }, [onRequestClose]);

  return (
    <ReactNativeModal
      animationIn="slideInRight"
      animationOut="slideOutRight"
      useNativeDriver={true}
      isVisible={isVisible}
      style={styles.modalContainer}
      avoidKeyboard={true}
      onBackdropPress={() => onRequestClose()}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <ScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              {/* DIA DIEM */}
              <View style={styles.paddingCustom}>
                <DropDownAddress />
              </View>

              {/* MON HOC */}
              <View style={{ paddingBottom: 20 }}>
                <DropDownMajors />
              </View>
              {/* HINH THUC */}
              <Text style={styles.textSection}>Hình thức:</Text>
              <View style={{ paddingLeft: 20 }}>
                <RadioButton onSelect={handleSelect} options={optionForms} />
              </View>

              {/* SAP XEP THEO GIA */}
              <View style={[styles.section, styles.paddingCustom]}>
                <Text style={styles.textSection}>Sắp xếp theo giá:</Text>
                <TouchableOpacity style={styles.iconDESC} onPress={handleDesc}>
                  <Octicons name="sort-desc" size={24} color="black" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconASC} onPress={handleAsc}>
                  <Octicons name="sort-asc" size={24} color="black" />
                </TouchableOpacity>
              </View>

              {/* GIA NHO NHAT */}
              <View style={styles.paddingCustom}>
                <Text style={styles.textSection}>Giá</Text>
                <View style={styles.inputPriceContainer}>
                  <TextInput
                    style={[
                      styles.inputPrice, styles.boxShadow,
                      error &&  parseFloat(minPrice) > parseFloat(maxPrice) ? styles.errorBorder: null,
                    ]}
                    placeholder="Tối thiểu"
                    keyboardType="numeric"
                    value={minPrice}
                    onChangeText={handleMinPriceChange}
                  />
                  <View style={styles.inputPriceContainerLine}></View>

                  {/* Input giá tối đa */}
                  <TextInput
                    style={[
                      styles.inputPrice,  styles.boxShadow,
                      error &&
                      parseFloat(maxPrice) < parseFloat(minPrice) 
                        ? styles.errorBorder
                        : null,
                    ]}
                    placeholder="Tối đa"
                    keyboardType="numeric"
                    value={maxPrice}
                    onChangeText={handleMaxPriceChange}
                  />
                </View>
                   {/* Hiển thị thông báo lỗi */}
                  {error && <Text style={styles.errorText}>{error}</Text>}
              </View>

              {/* SO LUONG */}
              <View style={styles.paddingCustom}>
                <CustomInput
                  label="Số lượng:"
                  placeholder="Nhập số lượng"
                  required={false}
                  onChangeText={handleQuantity}
                  type={"number"}
                  style={{ paddingHorizontal: 5 }}
                  value={quantitys + ""}
                />
              </View>
            </ScrollView>

            {/* BUTTON AP DUNG */}
            <View style={[styles.btnContainer]}>
              {/* BUTTON QUAY LAI */}
              <TouchableOpacity style={styles.btnApply} onPress={handleApply}>
                <Text style={styles.textApply}>Áp dụng</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{ marginTop: -20 }}
              onPress={handleCloseModel}
            >
              <Feather name="chevrons-right" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: customPaddingHorizontal,
    paddingVertical: customPaddingVertical,
    backgroundColor: "#fff",
    borderTopLeftRadius: customBorderTopLeftRadius,
    borderBottomLeftRadius: customBorderBottomLeftRadius,
  },

  modalContainer: {
    padding: 0,
    margin: 0,
    marginLeft: "7%",
  },

  overlay: {
    height: customOverlayHeight,
  },

  paddingCustom: {
    paddingBottom: customPadding,
  },

  section: {
    flexDirection: "row",
    alignItems: "center",
    transform: [{ translateY: 5 }],
  },

  iconASC: {
    position: "absolute",
    right: 60,
    transform: [{ translateY: -10 }],
  },

  iconDESC: {
    position: "absolute",
    right: 20,
    transform: [{ translateY: -10 }],
  },

  textSection: {
    fontWeight: "500",
    fontSize: 15,
    paddingLeft: 5,
  },

  iconASC_DESC: {
    transform: [{ translateY: -67 }],
  },

  list: {
    maxHeight: 200, // Limit list height (adjust as needed)
  },
  listContent: {
    flexGrow: 1,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    paddingLeft: 15,
    paddingRight: 23,
  },
  btnContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  btnApply: {
    borderRadius: 10,
    backgroundColor: BackgroundColor.primary,
    paddingVertical: 13,
    width: "50%",
  },
  textApply: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
  },

  inputPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 5,
    marginTop: 10,
    alignItems: "center",
    gap: 20,
  },

  inputPriceContainerLine: {
    height: 2,
    width: 15,
    backgroundColor: "#ccc",
  },

  inputPrice: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: BackgroundColor.white,
    borderWidth: 1,
    borderColor: "#fff"
  },

  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },

  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    paddingLeft: 5,
  },
  errorBorder: {
    borderColor: "rgba(255, 0, 0, 0.5)",
    shadowColor: "red",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
export default Filter;
