import { ScrollView, StyleSheet } from "react-native";
import InfoClass from "./InfoClass";
import InfoLesson from "./InfoLesson";
import InfoTuition from "./InfoTuition";

const Class = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <InfoClass />
      <InfoLesson />
      <InfoTuition/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Đảm bảo chiếm đủ không gian
    paddingBottom: 250,
  },
});

export default Class;
