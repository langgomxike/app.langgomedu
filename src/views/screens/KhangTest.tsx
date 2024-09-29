import { Text, View, StyleSheet } from "react-native";
import ConfirmDialog from "../components/ConfirmDialog";
import WeekCalendar from "../components/WeekCalendar";

export default function KhangTestScreen() {
  return (
    <View style={styles.container}>
      <WeekCalendar today={18} dayOfWeek={0}/>
      {/* <ConfirmDialog title="do you love me" content="if you love me click confirm" buttonName="demo"/> */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})
