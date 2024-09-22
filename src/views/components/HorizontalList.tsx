import { FunctionComponent, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

type HorizontalListProp = {
  title: string;
  onViewAll: () => void;
  list: Array<object>;
  ItemView: ({ item }: ItemViewProp) => React.JSX.Element;
};

type ItemViewProp = {
  item: unknown;
};

const activeColor = "#0D99FF";
const hintColor = "#AAA";

const BUTTON_SIZE = 35;

export default function HorizontalList({
  title = "",
  onViewAll = () => {},
  list = [],
  ItemView = ({ item }: ItemViewProp) => <></>,
}: HorizontalListProp) {
  //refs, contexts

  //states

  //effects

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        {/* title */}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.viewAll} onPress={onViewAll}>
          View all
        </Text>
      </View>

      {/* list */}
      <FlatList
        horizontal={true}
        data={list}
        renderItem={({ item }) => <ItemView item={item} />}
        style={styles.content}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 5,
  },

  header: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingTop: 10,
  },

  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
  },

  viewAll: {
    fontSize: 15,
    fontWeight: "bold",
    color: hintColor,
  },

  content: {
    margin: 10,
  },
});
