import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Search from "./Inputs/Search";
import Ionicons from '@expo/vector-icons/Ionicons';
import { LanguageContext } from "../../configs/LanguageConfig";

//Interface
type OptionPopupProps = {
  visible: string | null;
  options: string[];
  onSelect: (option: string) => void;
  onRequestClose: () => void;
};

const ITEMS_PER_PAGE = 6;
export default function optionPopup({
  visible,
  options,
  onSelect,
  onRequestClose,
}: OptionPopupProps) {

  // context
  const language = useContext(LanguageContext).language;

  const [currentData, setCurrentData] = useState(
    options.slice(0, ITEMS_PER_PAGE)
  );
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadMoreItems = () => {
    if (!isLoading && currentData.length < options.length) {
      setIsLoading(true);

      setTimeout(() => {
        const newPage = page + 1;
        const newItems = options.slice(0, newPage * ITEMS_PER_PAGE);
        setCurrentData(newItems);
        setPage(newPage);
        setIsLoading(false);
      }, 5000);
    }
  };

  //Loc du lieu theo tu khoa tim kiem
  const filteredData = currentData.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // Modal
    <Modal
      visible={visible === "modal_1"}
      transparent={true}
      animationType="slide"
    >
        <View style={styles.overlay}>
          {/* Show the popup */}
          <View style={styles.popup}>
            {/* Title */}
            <View style={[styles.sectionOne, styles.header]}>
              <View style={styles.sectionOne}>
                <Text style={styles.modalTitle}>{language.SELECT_SUBJECT}</Text>
              </View>
              <View style={[styles.sectionOne, {alignItems:'flex-end'}]}>
                <TouchableOpacity onPress={onRequestClose} style={styles.btnClose}>
                <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            {/* Search */}
            <View style={[styles.sectionOne, { padding: 10 }]}>
              <Search
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
            </View>
            {/* OPtion */}
            <View style={styles.sectionTow}>
              <FlatList
                data={filteredData}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <TouchableOpacity onPress={() => onSelect(item)}>
                      <Text style={styles.option}>{item}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                onEndReached={loadMoreItems} // Gọi hàm tải thêm khi cuộn đến cuối
                onEndReachedThreshold={0.5} // Kích hoạt khi cuộn đến 50% cuối danh sách
                ListFooterComponent={
                  isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                  ) : null
                } // Hiển thị "loading" khi đang tải thêm dữ liệu
              />
            </View>
            {/* Button */}
            <View style={styles.sectionThree}>
              <Pressable style={styles.btnDelete}>
                <Text style={styles.btnDeleteText}>{language.DESELECT}</Text>
              </Pressable>
            </View>
          </View>
        </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  popup: {
    flexDirection: "column",
    width: "90%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },

  option: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "#CCCCCC",
  },

  card: {
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 7,
    backgroundColor: "white",
    padding: 5,
  },

  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    elevation: 5,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
  },

  header: {
    flexDirection: "row",
  },

  sectionOne: {
    flex: 1,
  },

  sectionTow: {
    flex: 8,
  },

  sectionThree: {
    flex: 1,
  },

  btnDelete: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#CCC",
    width: "30%",
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 10,
  },

  btnDeleteText: {
    color: "white",
    padding: 10,
    fontSize: 14,
    fontWeight: "500",
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },

  btnClose: {
  }
});
