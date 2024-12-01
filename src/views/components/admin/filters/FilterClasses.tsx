import { useCallback, useEffect, useState } from "react";
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

import CustomInput from "../../Inputs/CustomInput";
import { BackgroundColor } from "../../../../configs/ColorConfig";
import RadioButton from "../../Inputs/CustomRadioButton";
import ReactNativeModal from "react-native-modal";
import { Octicons } from "@expo/vector-icons";
import DropDownAddress from "../../dropdown/DropDownAddress";
import DropDownMajors from "../../dropdown/DropDownMajors";
import { TextInput } from "react-native-gesture-handler";
import Filters from "../../../../models/Filters";

type FilterProps = {
  isVisible: boolean;
  onRequestClose: () => void;
  onSetFilterValues: (filterValues: Filters) => void;
};

const optionForms = [
  { label: "Online", value: "online" },
  { label: "Offline", value: "offline" },
];

const SORT = {
  priceASC : "priceASC",
  priceDESC : "priceDESC",
}

const customPadding = 30;
const customPaddingHorizontal = 10;
const customPaddingVertical = 30;
const customBorderTopLeftRadius = 30;
const customBorderBottomLeftRadius = 30;
const customOverlayHeight = "100%";

const Filter = ({ isVisible, onRequestClose, onSetFilterValues }: FilterProps) => {
  // USESTATE
  // CHECK BOX
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [sortValues, setSortValues] = useState<string>("");

  // ADDRESS 
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedWards, setSelectedWards] = useState<string[]>([]);

  // MAJORS AND CLASS LEVEL
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [selectedClassLevels, setSelectedClassLevels] = useState<string[]>([]);

  // SET VALUE "GIA NHO NHAT, GIA LON NHAT"
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // SET VALUE INPUT
  const [quantitys, setQuantitys] = useState<string>("");

  // STARTED AND ENDED
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // HANDLE USECALLBACK
  const handleSelect = useCallback((selected: string[]) => {
    setSelectedType(selected);
  }, []);

  const handleCloseModel = useCallback(() => {
    onRequestClose();
  }, [onRequestClose]);

  // LOCATON

  // SUBJECT

  // PRICE
  // Kiểm tra điều kiện giá
  const validatePrice = (min: string, max: string) => {
    const minVal = parseFloat(min.replace(/\,/g, ""));
    const maxVal = parseFloat(max.replace(/\,/g, ""));
    if (!isNaN(minVal) && !isNaN(maxVal) && minVal > maxVal) {
      setError("Giá tối thiểu không được lớn hơn giá tối đa.");
    }else {
      setError(null);
    }
  };

  const formatCurrency = (value: string) => {
    if (!value) return "";
    // Loại bỏ tất cả ký tự không phải số
    const numericValue = value.replace(/\D/g, "");
    // Format số tiền
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Hàm xử lý khi giá trị thay đổi
  const handleMinPriceChange = (value: string) => {
    const formattedValue = formatCurrency(value);
    setMinPrice(formattedValue);

    validatePrice(formattedValue, maxPrice);
  };
  
  const handleMaxPriceChange = (value: string) => {
    const formattedValue = formatCurrency(value);
    setMaxPrice(formattedValue);

    validatePrice(minPrice, formattedValue);
  };
  

  // SO LUONG
  const handleQuantity = (value: string) => {
    if (/^\d*$/.test(value)) {
      setQuantitys(value);
      }
  };

  function convertStringArrayToNumberArray(stringArray: string[]): number[] {
    return stringArray.map((str) => {
      const num = Number(str);
      return isNaN(num) ? 0 : num;
    });
  }

  function convertDateStringToMilliseconds(dateString: string) {
    if (!dateString) {
      return null;
    }
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day).getTime();
  }

  const handleApply = useCallback(() => {
    const filterValues: Filters = {
      minPrice: minPrice === "" ? undefined : Number(minPrice.replace(/,/g, "")),
      maxPrice: maxPrice === "" ? undefined : Number(maxPrice.replace(/,/g, "")),
      province: selectedCities.length == 0 ? undefined : selectedCities,
      district: selectedDistricts.length == 0 ? undefined : selectedDistricts,
      ward: selectedWards.length == 0 ? undefined : selectedWards,
      classLevelId: selectedClassLevels.length === 0 ? undefined :convertStringArrayToNumberArray(selectedClassLevels),
      major: selectedMajors.length == 0 ? undefined : convertStringArrayToNumberArray(selectedMajors),
      maxLearners: quantitys == "" ? undefined :  Number(quantitys),
      startedAt: convertDateStringToMilliseconds(fromDate),
      endedAt: convertDateStringToMilliseconds(toDate),
      sort: sortValues == "" ? undefined : sortValues
    }

    onSetFilterValues(filterValues)
    
    onRequestClose();
  }, [selectedCities, selectedDistricts, selectedWards,selectedMajors, selectedClassLevels ,sortValues, minPrice, maxPrice, quantitys, fromDate]);

  const handleResetFilter =  useCallback(() => {
    setSelectedType([]);
    setSortValues("");
    setSelectedCities([]);
    setSelectedDistricts([]);
    setSelectedWards([]);
    setSelectedMajors([]);
    setSelectedClassLevels([]);
    setMinPrice("");
    setMaxPrice("");
    setQuantitys("");
    setFromDate("");
    setToDate("");
  }, []);

  // effects
  useEffect(() => {
    // console.log(">> selectedCities: ", selectedCities);
    // console.log(">> selectedDistricts: ", selectedDistricts);
    // console.log(">> selectedWards: ", selectedWards);
    // console.log(">> sort", sortValues)
    // console.log(">> min price: ", minPrice);
    // console.log(">> max price: ", maxPrice);
    // // console.log(">> quantity: ", quantitys);
    // console.log(">> from date: ", fromDate);
    // console.log(">> from date: ", convertDateStringToMilliseconds(fromDate));
    // console.log(">> morjors: ", selectedMajors);
    // console.log(">> class levels: ", selectedClassLevels);
    
  }, [selectedCities, selectedDistricts, selectedWards,selectedMajors, selectedClassLevels ,sortValues, minPrice, maxPrice, quantitys, fromDate]);

  

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
      
        <View style={styles.overlay}>
          <View style={styles.container}>
            <ScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              {/* DIA DIEM */}
              <View style={styles.paddingCustom}>
                <DropDownAddress 
                  selectedCities={selectedCities}
                  selectedDistricts={selectedDistricts}
                  selectedWards={selectedWards}
                  onSetSelectedCities={setSelectedCities} 
                  onSetSelectedDistricts={setSelectedDistricts}
                  onSetSelectedWards={setSelectedWards}
                 />
              </View>

              {/* MON HOC */}
              <View style={{ paddingBottom: 20 }}>
                <DropDownMajors 
                selectedMajors={selectedMajors}
                selectedClassLevels={selectedClassLevels}
                onSetSelectedMajors={setSelectedMajors} 
                onSetSelectedClassLevels={setSelectedClassLevels}/>
              </View>

              {/* HINH THUC */}
              <Text style={styles.textSection}>Hình thức:</Text>
              <View style={{ paddingLeft: 20 }}>
                <RadioButton onSelect={handleSelect} options={optionForms} />
              </View>

              {/* SAP XEP THEO GIA */}
              <View style={[styles.section, styles.paddingCustom]}>
                <Text style={styles.textSection}>Sắp xếp theo giá:</Text>
                <TouchableOpacity style={styles.iconDESC} onPress={() => setSortValues(SORT.priceDESC)}>
                  <Octicons name="sort-desc" size={24} color={sortValues === SORT.priceDESC ? BackgroundColor.primary : "black"} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconASC} onPress={() => setSortValues(SORT.priceASC)}>
                  <Octicons name="sort-asc" size={24} color={sortValues === SORT.priceASC ? BackgroundColor.primary : "black"} />
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
                  label="Số lượng học sinh:"
                  placeholder="Nhập số lượng"
                  required={false}
                  onChangeText={handleQuantity}
                  type={"number"}
                  style={{ paddingHorizontal: 5 }}
                  value={quantitys + ""}
                />
              </View>

              <View style={[styles.queryDateBlock]}>
            <View style={{ flex: 1 }}>
              <CustomInput
                label="Từ ngày"
                placeholder="Chọn ngày..."
                required={false}
                value={fromDate}
                onChangeText={setFromDate}
                type="date"
              />
            </View>
            <View style={{ flex: 1 }}>
              <CustomInput
                label="Đến ngày"
                placeholder="Chọn ngày..."
                required={false}
                value={toDate}
                onChangeText={setToDate}
                type="date"
              />
            </View>
          </View>
            </ScrollView>

            {/* BUTTON AP DUNG */}
            <View style={[styles.btnContainer]}>
              {/* BUTTON QUAY LAI */}
              <TouchableOpacity style={styles.btnReset} onPress={handleResetFilter}>
                <Text style={styles.textReset}>Thiết lập lại</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnApply} onPress={handleApply}>
                <Text style={styles.textApply}>Áp dụng</Text>
              </TouchableOpacity>
            </View>
            {/* <TouchableOpacity
              style={{ marginTop: -20 }}
              onPress={handleCloseModel}
            >
              <Feather name="chevrons-right" size={30} color="black" />
            </TouchableOpacity> */}
          </View>
        </View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: customPaddingHorizontal,
    paddingTop: customPaddingVertical,
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 5,
    paddingTop: 20,
    paddingBottom: 25,
  },

  btnApply: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: BackgroundColor.primary,
    paddingVertical: 13,
  },

  textApply: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
  },

  btnReset: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: BackgroundColor.white,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: BackgroundColor.sub_danger
  },

  textReset: {
    fontWeight: "500",
    color: "#ff0000",
    fontSize: 15,
    textAlign: "center",
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
    borderColor: "#eee",
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

  queryDateBlock: {
    flexDirection: "row",
    gap: 20,
    marginBottom: "15%",
    paddingHorizontal: 5,
  },
});
export default Filter;
