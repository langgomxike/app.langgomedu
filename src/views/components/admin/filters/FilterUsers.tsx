import { useCallback, useContext, useEffect, useState } from "react";
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
import Filters from "../../../../models/Filters";
import ReactNativeModal from "react-native-modal";
import DropDownAddress from "../../dropdown/DropDownAddress";
import { BackgroundColor } from "../../../../configs/ColorConfig";
import DropdownGender from "../../dropdown/DropDownGender";
import { LanguageContext } from "../../../../configs/LanguageConfig";



type FilterUserProps = {
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

export default function FilterUser  ({ isVisible, onRequestClose, onSetFilterValues }: FilterUserProps) {

  // context
  const language = useContext(LanguageContext).language;

  // states ----------------------------------------------------------------
  const [sortValues, setSortValues] = useState<string>("");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedWards, setSelectedWards] = useState<string[]>([]);

  const [selectedGender, setSelectedGender] = useState<number>(0);

  // handles ----------------------------------------------------------------
  // LOCATON
  function convertStringArrayToNumberArray(stringArray: string[]): number[] {
    return stringArray.map((str) => {
      const num = Number(str);
      return isNaN(num) ? 0 : num;
    });
  }

  const handleApply = useCallback(() => {
    const filterValues: Filters = {
      province: selectedCities.length == 0 ? undefined : selectedCities,
      district: selectedDistricts.length == 0 ? undefined : selectedDistricts,
      ward: selectedWards.length == 0 ? undefined : selectedWards,
      gender: selectedGender == 0 ? undefined : selectedGender,
      sort: sortValues == "" ? undefined : sortValues
    }

    onSetFilterValues(filterValues)
    
    onRequestClose();
  }, [selectedCities, selectedDistricts, selectedWards]);

  const handleResetFilter =  useCallback(() => {
    setSortValues("");
    setSelectedCities([]);
    setSelectedDistricts([]);
    setSelectedWards([]);
    setSelectedGender(0)
  }, []);


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

              <View>
                <DropdownGender selectedGender={selectedGender}  onSlectedGenderId={setSelectedGender} />
              </View>

            </ScrollView>

            {/* BUTTON AP DUNG */}
            <View style={[styles.btnContainer]}>
              {/* BUTTON QUAY LAI */}
              <TouchableOpacity style={styles.btnReset} onPress={handleResetFilter}>
                <Text style={styles.textReset}>{language.RESET}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnApply} onPress={handleApply}>
                <Text style={styles.textApply}>{language.APPLY}</Text>
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
