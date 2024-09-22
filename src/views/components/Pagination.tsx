import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type PaginationProp = {
  totalPage: number;
  currentPage: number;
  onChange: (page: number) => void;
};

const activeColor = "#0D99FF";
const hintColor = "#AAA";

const BUTTON_SIZE = 35;

export default function Pagination({
  totalPage = 0,
  currentPage = 1,
  onChange = (page: number) => {},
}: PaginationProp) {
  //refs, contexts

  //states
  const [active, setActive] = useState<number>(
    currentPage > totalPage || currentPage <= 0 ? 1 : currentPage
  );

  //effects
  useEffect(() => {
    onChange(active);
  }, [active]);

  return (
    <View style={styles.container}>
      {/* title */}
      <Text style={styles.title}>
        Showing page {active} of {totalPage}
      </Text>

      {/* main */}
      <View style={styles.buttonContainer}>
        {/* back */}
        <View style={styles.button}>
          {active > 2 && <Text onPress={() => setActive(1)}>{"<<"}</Text>}
        </View>

        {/* prev offset pages */}
        <View style={styles.button}>
          {active > 1 && (
            <Text
              style={{ fontWeight: "500" }}
              onPress={() => setActive(active - 1)}
            >
              {active - 1}
            </Text>
          )}
        </View>

        {/* active page */}
        <View style={styles.button}>
          <Text style={[styles.activeButton]}>{active}</Text>
        </View>

        {/* next offset pages */}
        <View style={styles.button}>
          {active < totalPage && (
            <Text
              style={{ fontWeight: "500" }}
              onPress={() => setActive(active + 1)}
            >
              {active + 1}
            </Text>
          )}
        </View>

        {/* next */}
        <View style={styles.button}>
          {active < totalPage - 1 && (
            <Text onPress={() => setActive(totalPage)}>{">>"}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 5,
  },

  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: hintColor,
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    flex: 1,
    alignItems: "center",
    minWidth: 30,
  },

  offsetButton: {
    flex: 1,
  },

  activeButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: activeColor,
    color: "#fff",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "bold",
  },
});
