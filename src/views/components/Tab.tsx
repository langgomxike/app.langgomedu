import { FunctionComponent, useCallback, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export type TabItem = {
  title: string;
  view: FunctionComponent;
};

type TabProp = {
  tabs: Array<TabItem>;
  defaultActiveTab: number;
};

const activeColor = "#0D99FF";

const titleStyle = StyleSheet.create({
  style: { fontSize: 15, fontWeight: "bold" },
}).style;

const TAB_HEIGHT = 50;

export default function Tab({ tabs = [], defaultActiveTab = 0 }: TabProp) {
  //refs, contexts

  //states
  const [active, setActive] = useState<number>(
    defaultActiveTab >= tabs.length ? 0 : defaultActiveTab
  );

  const [containerWidth, setContainerWidth] = useState<number>(0);

  const ActiveTabView = tabs[active].view;

  //handlers
  const onTab = useCallback(
    (tab: number) => {
      if (tab === active || tab < 0 || tab >= tabs.length) {
        return;
      }

      setActive(tab);
    },
    [active]
  );

  const onContainerChangeLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerWidth(event?.nativeEvent?.layout?.width);
  }, []);

  return (
    <View onLayout={onContainerChangeLayout} style={styles.container}>
      {/* Tab header */}
      <View style={styles.header}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          {tabs.map((tab, index) => (
            <Pressable
              onPress={() => onTab(index)}
              key={index}
              style={[
                {
                  minWidth:
                    tabs.length > 3 ? 150 : containerWidth / tabs.length,
                },
                styles.tabContainer,
              ]}
            >
              <Text
                style={[
                  titleStyle,
                  styles.title,
                  index === active && styles.activeTitle,
                ]}
              >
                {tab.title || "Tab " + (index + 1)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Tab content */}
      <View style={styles.content}>
        <ActiveTabView />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },

  header: {
    minHeight: TAB_HEIGHT,
    flex: 0,
  },

  tabContainer: {
    minHeight: TAB_HEIGHT,
    paddingHorizontal: 20,
    paddingVertical: 2,
    backgroundColor: "#fff",
    alignSelf: "center",
  },

  title: {
    minHeight: TAB_HEIGHT,
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "heavy",
  },

  activeTitle: {
    color: activeColor,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: activeColor,
  },

  content: {
    flex: 1,
  },
});