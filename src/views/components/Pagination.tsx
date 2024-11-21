import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LanguageContext } from "./../../configs/LanguageConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";
import Feather from '@expo/vector-icons/Feather';

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

    // Handlers for setting active page
    const goToFirstPage = () => setActive(1);
    const goToLastPage = () => setActive(totalPage);
    const goToPreviousPage = () => setActive((prev) => Math.max(1, prev - 1));
    const goToNextPage = () => setActive((prev) => Math.min(totalPage, prev + 1));

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
          <TouchableOpacity
              disabled={active === 1}
              onPress={goToFirstPage}
            >
             <Feather name="chevrons-left" size={18} color={active === 1 ? "gray" : "black"} />
            </TouchableOpacity>
        </View>

        {/* prev offset pages */}
        <View style={styles.button}>
          {active > 1 && (
             <TouchableOpacity onPress={goToPreviousPage}>
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
           <TouchableOpacity onPress={goToNextPage}>
              <Text style={{ fontWeight: "700" }}>{active + 1}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* next */}
        <View style={styles.button}>
        <TouchableOpacity
            disabled={active === totalPage}
            onPress={goToLastPage}
          >
             <Feather name="chevrons-right" size={18} color={active === totalPage ? "gray" : "black"} />
            </TouchableOpacity>
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
    color: "gray",
    alignItems: "center",
    textAlign: "center",
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
