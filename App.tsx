import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Tab, { TabItem } from "./src/views/components/Tab";
import Pagination from "./src/views/components/Pagination";
import HorizontalList from "./src/views/components/HorizontalList";

export default function App() {
  const tabs: Array<TabItem> = [];

  for (let i = 0; i < 2; i++) {
    const element: TabItem = {
      title: "Tab avcgfdgcydgcyd" + i,
      view: () => <Text>{i}</Text>,
    };

    tabs.push(element);
  }

  return (
    <View style={styles.container}>
      <View>
        <HorizontalList
          title="Test list"
          onViewAll={() => alert("hello")}
          list={tabs}
          ItemView={(item) => <Text>{JSON.stringify(item)}</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
});
