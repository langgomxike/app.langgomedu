import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import MyIcon, { AppIcon } from "../../components/MyIcon";
import Button from "../../components/Button";
import IconReport from "../../components/ItemUserReport";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import ImageViewer from "react-native-image-zoom-viewer";
export default function UpdateReportedUser() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const openModal = (index: number) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  interface Item {
    id: number;
    name: string;
  }
  const data: Item[] = [
    {
      id: 1,
      name: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL63FzMpwJQvGI1Wt3WiKphfqKGtRD3OUC3w&s",
    },
    {
      id: 2,
      name: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL63FzMpwJQvGI1Wt3WiKphfqKGtRD3OUC3w&s",
    },
    {
      id: 3,
      name: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL63FzMpwJQvGI1Wt3WiKphfqKGtRD3OUC3w&s",
    },
    {
      id: 4,
      name: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL63FzMpwJQvGI1Wt3WiKphfqKGtRD3OUC3w&s",
    },
  ];
  const renderItem = ({ item, index }: { item: Item; index: number }) => (
    <TouchableOpacity style={styles.imgParent} onPress={() => openModal(index)}>
      <Image style={styles.img} source={{ uri: item.name }} />
    </TouchableOpacity>
  );

  // Styles animated chevron
  const text: string =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis impedit laboriosam ullam, nulla sunt dolorum, fugiat a doloremque possimus saepe aliquam officiis facere odit totam rem cum. Obcaecati, consectetur at!.";
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* nút back và tên màn hình */}
      <View style={styles.component}>
        <View style={styles.screenName}>
          <View style={styles.backBtn}>
            <MyIcon icon={AppIcon.back_button} size="20"></MyIcon>
          </View>
          <Text style={styles.screenTitel}> Chi tiết báo cáo lớp học</Text>
        </View>
        {/* tài khoản báo cáo */}
        <Text style={styles.smallTitle1}>Tài khoản báo cáo</Text>
        <IconReport userName="Phạm Anh Quân" credibility={111}></IconReport>
        {/* tài khoản bị báo cáo */}
        <Text style={styles.smallTitle2}>Tài khoản bị báo cáo</Text>
        <IconReport
          userName="Khoai Lang Thang"
          credibility={111111}
        ></IconReport>
        {/* lớp học bị báo cáo */}
      </View>
      <View style={styles.component1}>
        <Text style={styles.smallTitle3}>Đã bị báo cáo 2 lần</Text>
        <View style={styles.reportParent}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            <View style={styles.itemlCenter}>
              <View style={styles.textareaContainer}>
                <ScrollView
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                >
                  <Text>{text}</Text>
                </ScrollView>
              </View>
              <View style={styles.textareaContainer}>
                <ScrollView
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                >
                  <Text>{text}</Text>
                </ScrollView>
              </View>
              <View style={styles.textareaContainer}>
                <ScrollView
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                >
                  <Text>{text}</Text>
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </View>
        <Text style={styles.smallTitle3}>Lý do</Text>
        <Text style={styles.reportContent}>
          {" "}
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempora
          excepturi dicta magni porro? Exercitationem consequuntur earum eaque
          veniam adipisci quos molestiae inventore odio alias, ad, aspernatur,
          aliquam odit saepe nesciunt!
        </Text>
      </View>

      <View style={styles.component2}>
        <Text style={styles.smallTitle3}>Minh chứng:</Text>
        <View style={styles.images}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          ></FlatList>
        </View>
        <View>
          <View style={styles.btns}>
            <View>
              <Button
                title="Chấp nhận báo cáo"
                textColor="#fff"
                backgroundColor="#0D99FF"
              />
            </View>
            <View>
              <Button
                title=" Từ chối báo cáo "
                textColor="#fff"
                backgroundColor="#F9CA24"
              />
            </View>
          </View>
          <Button
            title="Chấp nhận báo cáo và xoá tài khoản"
            textColor="#fff"
            backgroundColor="#E10909"
          />
        </View>
      </View>
      {/* Modal hiển thị hình ảnh */}
      {selectedIndex !== null && (
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(true)}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <ImageViewer
            imageUrls={data.map((item) => ({ url: item.name }))}
            index={selectedIndex}
            onSwipeDown={() => setModalVisible(false)}
            enableSwipeDown={true}
          />
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EEEEEE",
  },
  screenName: {
    flexDirection: "row",
    top: 30,
    marginBottom: 30,
    width: "100%",
  },
  screenTitel: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    left: "50%",
    width: "80%",
    top: "1%",
  },
  backBtn: {
    top: "2%",
  },
  user: {
    height: 60,
    alignItems: "center", // Căn giữa các phần tử theo chiều dọc
    borderWidth: 1, // Độ dày của viền
    borderColor: "#ccc", // Màu sắc của viền
    borderRadius: 10, // Bo góc cho viền
    shadowColor: "#000",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 25,
    marginTop: 10,
    marginLeft: 10,
  },
  smallTitle1: {
    top: 10,
    fontWeight: "bold",
    fontSize: 18,
    paddingBottom: 15,
    color: "#0D99FF",
  },
  smallTitle2: {
    top: 10,
    fontWeight: "bold",
    fontSize: 18,
    paddingBottom: 15,
    color: "red",
  },
  smallTitle3: {
    top: 10,
    fontWeight: "bold",
    fontSize: 18,
    paddingBottom: 15,
    color: "black",
  },
  iconInUser: {
    flexDirection: "row",
    marginTop: "5%",
    left: "35%",
  },
  classInfor: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: "center",
    height: 60,
    borderRadius: 10, // Bo góc cho viền
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
  },
  component: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  component1: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  component2: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  textareaContainer: {
    width: "98%",
    borderRadius: 10,
    height: 100,
    paddingHorizontal: 15,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
    marginBottom: 20,
  },

  reportParent: {
    height: 350,
    marginBottom: 20,
  },
  itemlCenter: {
    alignItems: "center",
  },
  reportContent: {
    width: "98%",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
    marginBottom: 30,
  },
  img: {
    width: 300,
    height: 200,
    borderRadius: 5,
  },
  imgParent: {
    marginRight: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
  },
  btns: {
    flexDirection: "row",
    marginBottom:-20,
  },
  images: {
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 10,
    width: 70,
    height: 50,
    top: 50,
    left: 350,
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 1,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1, // Để chiếm toàn bộ chiều cao màn hình
    justifyContent: "center", // Căn giữa nội dung theo chiều dọc
    alignItems: "center", // Căn giữa nội dung theo chiều ngang
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Làm mờ nền
  },
});
