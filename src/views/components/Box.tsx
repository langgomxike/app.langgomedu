import { View, Text, StyleSheet, Image, ImageURISource } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Sử dụng một icon phù hợp

type propsBox = {
  contents: Array<contentItem>;
  titleHeader: string;
};

type contentItem = {
  title: string;
  content: string;
  image: ImageURISource;
};

const Box = ({ contents, titleHeader }: propsBox) => {
  return (
    <View style={styles.container}>
      {/* Tiêu đề lớn */}
      <Text style={styles.mainTitle}>{titleHeader}</Text>

      {/* Box thứ nhất */}
      {contents.map((con, index) => (
        <View key={index} style={styles.box}>
          <Image source={con.image} style={styles.image} />          
          <View>
            <Text style={styles.title}>{con.title}</Text>
            <Text style={styles.content}>{con.content}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    margin: 15,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    paddingBottom: 5,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  image: {
    marginRight: 10,
    width: 50,
    height: 50,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    fontSize: 14,
    color: "#666",
  },
});

export default Box;
