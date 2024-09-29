import { useState } from "react";
import {
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

const Filter = () => {
  const [location, setLocation] = useState("");
  const [subject, setSubject] = useState("");
  const [format, setFormat] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [locations, setLocations] = useState(["Địa điểm 1", "Địa điểm 2"]);
  const [subjects, setSubjects] = useState(["Môn học 1", "Môn học 2"]);
  const [formats, setFormats] = useState(["Online", "Offline"]);

  type Option = {
    label: string;
    value: string;
  };
  

  const options: Option[] = [
    { label: 'Online', value: 'online' },
    { label: 'Offline', value: 'offline' },
  ];

  const handleSelect = (value: string) => {
    console.log('Selected:', value);
  };

  const removeLocation = (index: any) => {
    if (index >= 0 && index < locations.length) {
      setLocations((prevLocations) =>
        prevLocations.filter((_, i) => i !== index)
      );
    }
  };

  const removeSubject = (index: any) => {
    if (index >= 0 && index < subjects.length) {
      setSubjects((prevSubjects) => prevSubjects.filter((_, i) => i !== index));
    }
  };

  const removeFormat = (index: any) => {
    if (index >= 0 && index < formats.length) {
      setFormats((prevFormats) => prevFormats.filter((_, i) => i !== index));
    }
  };

  const handleDelete = () => {
    alert("Are you sure you want to delete");
    // thuc hien hanh dong xoa sau khi OK
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* DIA DIEM */}
        <View style={styles.paddingCustom}>
          {/* <CustomInput
            label="Địa điểm:"
            placeholder="Nhập địa điểm"
            required={false}
            onChangeText={setLocation}
            type={"text"}
          /> */}
          <Text>Địa điểm</Text>
          <Search onChangeText={setLocation} value="" />

          <View style={[styles.section, styles.childrenSection]}>
            <Text>Địa điểm</Text>
            <TouchableOpacity style={styles.iconButton}>
              <MyIcon icon={AppIcon.ic_exit} onPress={handleDelete} />
            </TouchableOpacity>
          </View>
          <View style={[styles.section, styles.childrenSection]}>
            <Text>Địa điểm</Text>
            <TouchableOpacity style={styles.iconButton}>
              <MyIcon icon={AppIcon.ic_exit} onPress={handleDelete} />
            </TouchableOpacity>
          </View>
        </View>

        {/* MON HOC */}
        <View style={styles.paddingCustom}>
          <CustomInput
            label="Môn học:"
            placeholder="Nhập môn học"
            required={false}
            onChangeText={setLocation}
            type={"text"}
          />

          <View style={[styles.section, styles.childrenSection]}>
            <Text>Môn học</Text>
            <TouchableOpacity style={styles.iconButton}>
              <MyIcon icon={AppIcon.ic_exit} onPress={handleDelete} />
            </TouchableOpacity>
          </View>
          <View style={[styles.section, styles.childrenSection]}>
            <Text>Môn học</Text>
            <TouchableOpacity style={styles.iconButton}>
              <MyIcon icon={AppIcon.ic_exit} onPress={handleDelete} />
            </TouchableOpacity>
          </View>
        </View>

        {/* HINH THUC */}
        <View style={styles.paddingCustom}>
          {/* <CustomInput
            label="Hình thức:"
            placeholder="Nhập hình thức"
            required={false}
            onChangeText={setLocation}
            type={"text"}
          /> */}
          <RadioButton onSelect={handleSelect} options={options}/>

          {/* <View style={[styles.section, styles.childrenSection]}>
            <Text>Online</Text>
            <TouchableOpacity style={styles.iconButton}>
              <MyIcon icon={AppIcon.ic_exit} onPress={handleDelete} />
            </TouchableOpacity>
          </View>
          <View style={[styles.section, styles.childrenSection]}>
            <Text>Offline</Text>
            <TouchableOpacity style={styles.iconButton}>
              <MyIcon icon={AppIcon.ic_exit} onPress={handleDelete} />
            </TouchableOpacity>
          </View> */}
        </View>

        {/* SAP XEP THEO GIA */}
        <View style={[styles.section, styles.paddingCustom]}>
          <Text style={styles.textSection}>Sắp xếp theo giá</Text>
          <TouchableOpacity style={styles.iconButton}>
            <MyIcon icon={AppIcon.ic_descending} onPress={handleDelete} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconASC}>
            <MyIcon icon={AppIcon.ic_ascending} onPress={handleDelete} />
          </TouchableOpacity>
        </View>

        {/* SAP XEP DANH GIA */}
        <View style={[styles.section, styles.paddingCustom]}>
          <Text style={styles.textSection}>Sắp xếp theo đánh giá</Text>
          <TouchableOpacity style={styles.iconButton}>
            <MyIcon icon={AppIcon.ic_descending} onPress={handleDelete} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconASC}>
            <MyIcon icon={AppIcon.ic_ascending} onPress={handleDelete} />
          </TouchableOpacity>
        </View>

        {/* GIA NHO NHAT */}
        <View style={styles.paddingCustom}>
          <CustomInput
            label="Giá nhỏ nhất:"
            placeholder="Nhập giá nhỏ nhất"
            required={false}
            onChangeText={setLocation}
            type={"text"}
          />
        </View>

        {/* GIA LON NHAT */}
        <View style={styles.paddingCustom}>
          <CustomInput
            label="Giá lớn nhất:"
            placeholder="Nhập giá lớn nhất"
            required={false}
            onChangeText={setLocation}
            type={"text"}
          />

          <View style={styles.iconASC_DESC}>
            <TouchableOpacity style={styles.iconASC}>
              <MyIcon icon={AppIcon.ic_ascending} onPress={handleDelete} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <MyIcon icon={AppIcon.ic_descending} onPress={handleDelete} />
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
            type={"text"}
          />
        </View>

        {/* BUTTON AP DUNG */}
        <View>
          <Button
            backgroundColor={BackgroundColor.primary}
            onPress={handleDelete}
            textColor={TextColor.white}
            title="Áp dụng"
          />
        </View>

        {/* BUTTON QUAY LAI */}
        <MyIcon icon={AppIcon.ic_exit} onPress={handleDelete} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  paddingCustom: {
    paddingBottom: 25,
  },

  section: {
    flexDirection: "row",
    alignItems: "center",
    transform: [{ translateY: 5 }],
  },

  iconButton: {
    position: "absolute",
    right: 23,
    transform: [{ translateY: 10 }],
  },

  iconASC: {
    position: "absolute",
    right: 50,
    transform: [{ translateY: 10 }],
  },

  textSection: {
    fontWeight: "bold",
    fontSize: 16,
  },

  iconASC_DESC: {
    transform: [{ translateY: -90 }],
  },

  childrenSection: {
    paddingLeft: 20,
    paddingBottom: 5,
  },
});

export default Filter;
