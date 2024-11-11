import { FunctionComponent, useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { LanguageContext, Languages } from "../../configs/LanguageConfig";
import { TextColor } from "../../configs/ColorConfig";

type HorizontalListProp = {
  title?: string;
  onViewAll?: () => void;
  list: Array<object>;
  ItemView: ({ item }: ItemViewProp) => React.JSX.Element;
};

type ItemViewProp = {
  item: unknown;
};

const HEADER_PADDING = 10;
const CONTENT_MARGIN = 10;

export default function HorizontalList({
  title = "",
  onViewAll = () => {},
  list = [],
  ItemView = ({ item }: ItemViewProp) => <></>,
}: HorizontalListProp) {
  //refs, contexts
  const languageContext = useContext(LanguageContext);

  //states

  //effects

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        {/* title */}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.viewAll} onPress={onViewAll}>
          {languageContext.language.VIEW_ALL}
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
    paddingHorizontal: HEADER_PADDING,
    paddingTop: HEADER_PADDING,
  },

  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
    color: TextColor.black,
  },

  viewAll: {
    fontSize: 15,
    fontWeight: "bold",
    color: TextColor.hint,
  },

  content: {
    margin: CONTENT_MARGIN,
  },
});
