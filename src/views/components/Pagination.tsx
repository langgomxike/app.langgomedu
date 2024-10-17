import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LanguageContext } from "./../../configs/LanguageConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";

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
  const languageContext = useContext(LanguageContext);

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
        {languageContext.language.SHOWING_PAGE} {active} / {totalPage}
      </Text>

      {/* main */}
      <View style={styles.buttonContainer}>
        {/* back */}
        <View style={styles.button}>
          {active > 2 && (
            <TouchableOpacity onPress={() => setActive(1)}>
              <Ionicons name="arrow-back" />
            </TouchableOpacity>
          )}
        </View>

        {/* prev offset pages */}
        <View style={styles.button}>
          {active > 1 && (
            <TouchableOpacity onPress={() => setActive(active - 1)}>
              <Text style={{ fontWeight: "700" }}>{active - 1}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* active page */}
        <View style={styles.button}>
          <Text style={[styles.activeButton]}>{active}</Text>
        </View>

        {/* next offset pages */}
        <View style={styles.button}>
          {active < totalPage && (
            <TouchableOpacity onPress={() => setActive(active + 1)}>
              <Text style={{ fontWeight: "700" }}>{active + 1}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* next */}
        <View style={styles.button}>
          {active < totalPage - 1 && (
            <TouchableOpacity onPress={() => setActive(totalPage)}>
              <Ionicons name="arrow-forward" />
            </TouchableOpacity>
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
    fontSize: 12,
    color: TextColor.hint,
    fontStyle: "italic",
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
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
    backgroundColor: BackgroundColor.primary,
    color: TextColor.white,
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "bold",
  },
});
