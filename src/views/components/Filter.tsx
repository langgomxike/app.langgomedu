import { useCallback, useContext, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import CustomInput from "./Inputs/CustomInput";
import MyIcon, { AppIcon } from "./MyIcon";
import Button from "./Button";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";
import Search from "./Inputs/Search";
import RadioButton from "./Inputs/CustomRadioButton";
import ButtonNavBar from "./ButtonNavBar";
import { NavigationContext } from "@react-navigation/native";

const Filter = () => {
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
    })
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
    })
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

  const handleASC = () => {
    Alert.alert("ASC", "asc");
  }

  const handleDESC = () => {
    Alert.alert("DESC", "desc");
  }

  const handleApply = () => {
    Alert.alert("APPLY", "apply");
  }

  return (
    <ScrollView nestedScrollEnabled={true}>
      <View style={styles.container}>
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
          />
          

          <FlatList
            data={itemLocations}
            keyExtractor={(index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.listItem}>
                <Text>{item}</Text>
                  <MyIcon icon={AppIcon.ic_exit} onPress={() => removeItemLocation(index)}/>
              </View>
            )}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
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
          />
          <FlatList
            data={itemSubjects}
            keyExtractor={(index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.listItem}>
                <Text>{item}</Text>
                  <MyIcon icon={AppIcon.ic_exit} onPress={() => removeItemSubject(index)}/>
              </View>
            )}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
        {/* HINH THUC */}
        <Text style={styles.textSection}>Hình thức:</Text>
        <View style={{ paddingLeft: 20 }}>
          <RadioButton onSelect={handleSelect} options={options} />
        </View>

        {/* SAP XEP THEO GIA */}
        <View style={[styles.section, styles.paddingCustom]}>
          <Text style={styles.textSection}>Sắp xếp theo giá:</Text>
          <TouchableOpacity style={styles.iconDESC}>
            <MyIcon icon={AppIcon.ic_descending} onPress={handleDESC} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconASC}>
            <MyIcon icon={AppIcon.ic_ascending} onPress={handleASC} />
          </TouchableOpacity>
        </View>

        {/* SAP XEP DANH GIA */}
        <View style={[styles.section, styles.paddingCustom]}>
          <Text style={styles.textSection}>Sắp xếp theo đánh giá:</Text>
          <TouchableOpacity style={styles.iconDESC}>
            <MyIcon icon={AppIcon.ic_descending} onPress={handleDESC} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconASC}>
            <MyIcon icon={AppIcon.ic_ascending} onPress={handleASC} />
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
          />

          <View style={styles.iconASC_DESC}>
            <TouchableOpacity style={styles.iconASC}>
              <MyIcon icon={AppIcon.ic_ascending} onPress={handleDESC} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconDESC}>
              <MyIcon icon={AppIcon.ic_descending} onPress={handleASC} />
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
          />
        </View>

        {/* BUTTON AP DUNG */}
        <View>
          <Button
            backgroundColor={BackgroundColor.primary}
            onPress={handleApply}
            textColor={TextColor.white}
            title="Áp dụng"
          />
        </View>

        {/* BUTTON QUAY LAI */}
        <MyIcon icon={AppIcon.ic_exit} onPress={handleBack} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  search: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  paddingCustom: {
    paddingBottom: 10,
  },

  section: {
    flexDirection: "row",
    alignItems: "center",
    transform: [{ translateY: 5 }],
  },

  iconButton: {
    position: "absolute",
    right: 23,
    transform: [{ translateY: -2 }],
  },

  iconASC: {
    position: "absolute",
    right: 50,
    transform: [{ translateY: -5 }],
  },

  iconDESC: {
    position: "absolute",
    right: 20,
    transform: [{ translateY: -5 }],
  },

  textSection: {
    fontWeight: "bold",
    fontSize: 16,
  },

  iconASC_DESC: {
    transform: [{ translateY: -69 }],
  },

  childrenSection: {
    paddingLeft: 20,
    paddingBottom: 5,
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
  removeButton: {
    color: "red",
  },
});

export default Filter;
