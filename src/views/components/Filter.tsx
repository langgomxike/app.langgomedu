import { useCallback, useContext, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CustomInput from "./Inputs/CustomInput";
import MyIcon, { AppIcon } from "./MyIcon";
import Button from "./Button";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";
import RadioButton from "./Inputs/CustomRadioButton";
import { NavigationContext } from "@react-navigation/native";
import ReactNativeModal from "react-native-modal";
import { Feather, Ionicons, Octicons } from "@expo/vector-icons";

type FilterProps = {
  isVisible: string | null;
  onRequestClose: () => void;
};

const Filter = ({ isVisible, onRequestClose }: FilterProps) => {
  // CHECK BOX
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // SET VALUE "GIA NHO NHAT, GIA LON NHAT"
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const options = [
    { label: "Online", value: "online" },
    { label: "Offline", value: "offline" },
  ];

  const handleSelect = (selected: string[]) => {
    setSelectedValues(selected);
  };

  // SET VALUE INPUT LOCATION
  const [location, setLocation] = useState("");
  const [subject, setSubject] = useState("");
  const [itemLocations, setItemLocations] = useState<string[]>([]);
  const [itemSubjects, setItemSubjects] = useState<string[]>([]);

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

  // MIN MAX PRICE
  const handleMinPriceChange = (value: string) => {
    setMinPrice(value);
    setMaxPrice(""); // Reset giá lớn nhất khi giá nhỏ nhất thay đổi
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);

    // kiem tra viec nguoi dung nhap da ket thuc chua
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      if (minPrice === "") {
        Alert.alert("Error", "Enter first minimum price");
        return;
      }

      // chuyen doi chuoi sang so
      const minPriceNumber = parseFloat(minPrice);
      const maxPriceNumber = parseFloat(value);

      if (!isNaN(minPriceNumber) && !isNaN(maxPriceNumber)) {
        if (maxPriceNumber <= minPriceNumber) {
          Alert.alert("Error", "Gia lon nhat phai lon hon gia nho nhat");
        }
      }
    }, 1000);
    setDebounceTimeout(newTimeout);
  };

  const navigation = useContext(NavigationContext);

  const handleBack = useCallback(() => {
    navigation?.goBack();
  }, []);

  const handleAsc = () => {
    Alert.alert("ASC", "asc");
  };

  const handleDesc = () => {
    Alert.alert("DESC", "desc");
  };

  const handleApply = () => {
    Alert.alert("APPLY", "apply");
  };

  return (
    <ReactNativeModal
      animationIn="slideInRight"
      animationOut="slideOutRight"
      useNativeDriver={true}
      isVisible={isVisible === "modal_fiter" ? true : false}
      style={styles.modalContainer}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            {/* DIA DIEM */}
            <View style={styles.paddingCustom}>
              <CustomInput
                label="Địa điểm:"
                placeholder="Nhập địa điểm"
                required={false}
                onChangeText={setLocation}
                type={"text"}
                value={location}
                onSubmitEditing={handleInputLocation}
                style={{ paddingHorizontal: 5 }}
              />

              <ScrollView
                style={styles.list}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                {itemLocations.map((item, index) => (
                  <View key={index.toString()} style={styles.listItem}>
                    <Text>{item}</Text>
                    <TouchableOpacity onPress={() => removeItemLocation(index)}>
                      <Ionicons name="close-outline" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* MON HOC */}
            <View style={styles.paddingCustom}>
              <CustomInput
                label="Môn học:"
                placeholder="Nhập môn học"
                required={false}
                onChangeText={setSubject}
                type={"text"}
                onSubmitEditing={handleInputSubject}
                value={subject}
                style={{ paddingHorizontal: 5 }}
              />
              <ScrollView
                style={styles.list}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                {itemSubjects.map((item, index) => (
                  <View key={index.toString()} style={styles.listItem}>
                    <Text>{item}</Text>
                    <TouchableOpacity onPress={() => removeItemSubject(index)}>
                      <Ionicons name="close-outline" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
            {/* HINH THUC */}
            <Text style={styles.textSection}>Hình thức:</Text>
            <View style={{ paddingLeft: 20 }}>
              <RadioButton onSelect={handleSelect} options={options} />
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

            {/* SAP XEP DANH GIA */}
            <View style={[styles.section, styles.paddingCustom]}>
              <Text style={styles.textSection}>Sắp xếp theo đánh giá:</Text>
              <TouchableOpacity style={styles.iconDESC} onPress={handleDesc}>
                  <Octicons name="sort-desc" size={24} color="black" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconASC} onPress={handleAsc}>
                  <Octicons name="sort-asc" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* GIA NHO NHAT */}
            <View style={styles.paddingCustom}>
              <CustomInput
                label="Giá nhỏ nhất:"
                placeholder="Nhập giá nhỏ nhất"
                required={false}
                onChangeText={handleMinPriceChange}
                type={"number"}
                value={minPrice}
                key="numeric"
                style={{ paddingHorizontal: 5 }}
              />
            </View>

            {/* GIA LON NHAT */}
            <View style={styles.paddingCustom}>
              <CustomInput
                label="Giá lớn nhất:"
                placeholder="Nhập giá lớn nhất"
                required={false}
                value={maxPrice}
                onChangeText={handleMaxPriceChange}
                key="numeric"
                editable={minPrice !== ""}
                type={"number"}
                style={{ paddingHorizontal: 5 }}
              />

              <View style={styles.iconASC_DESC}>
                <TouchableOpacity style={styles.iconDESC} onPress={handleDesc}>
                  <Octicons name="sort-desc" size={24} color="black" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconASC} onPress={handleAsc}>
                  <Octicons name="sort-asc" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            {/* SO LUONG */}
            <View style={styles.paddingCustom}>
              <CustomInput
                label="Số lượng:"
                placeholder="Nhập số lượng"
                required={false}
                onChangeText={setLocation}
                type={"number"}
                style={{ paddingHorizontal: 5 }}
              />
            </View>

            {/* BUTTON AP DUNG */}
            <View style={[styles.paddingCustom, styles.btnContainer]}>
              <TouchableOpacity style={styles.btnApply}>
                <Text style={styles.textApply}>Áp dụng</Text>
              </TouchableOpacity>
            </View>

            {/* BUTTON QUAY LAI */}
            <TouchableOpacity onPress={onRequestClose}>
              <Feather name="chevrons-right" size={30} color="black" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    // marginVertical: 5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    shadowColor: BackgroundColor.primary,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },

  modalContainer: {
    padding: 0,
    margin: 0,
    marginLeft: "8%",
  },

  overlay: {
    height: "100%",
  },

  paddingCustom: {
    paddingBottom: 30,
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
    fontWeight: "bold",
    fontSize: 16,
    paddingLeft: 5
  },

  iconASC_DESC: {
    transform: [{ translateY: -69 }],
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
    width: "50%"
  },
  textApply:{
    fontWeight: "bold",
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
  }

});

export default Filter;
