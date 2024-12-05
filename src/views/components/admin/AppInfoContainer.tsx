import { StyleSheet, Text, View } from "react-native";
import { PropsWithChildren, useCallback, useContext, useState } from "react";
import { BackgroundColor } from "../../../configs/ColorConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import Button from "../Button";
import { LanguageContext } from "../../../configs/LanguageConfig";
import ConfirmDialog from "../ConfirmDialog";

type AppInfoContainerProps = {
  title: string;
  oldValue?: React.JSX.Element;
  newValue?: React.JSX.Element;
  onSubmit?: () => void;
  onLongPress?: () => void;
};

export default function AppInfoContainer({
  title,
  oldValue,
  newValue,
  onSubmit,
  onLongPress,
  children,
}: AppInfoContainerProps & PropsWithChildren) {
  const language = useContext(LanguageContext).language;

  //states
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);

  //handlers
  const onConfirm = useCallback(() => {
    onLongPress && onLongPress();
    setConfirm(false);
  }, []);

  return (
    <View style={styles.container}>
      <ConfirmDialog
        title={"DELETE ITEM"}
        content={"Do you want to delete this item"}
        open={confirm}
        onConfirm={onConfirm}
        onCancel={() => setConfirm(false)}
      />

      {/* header */}
      <View style={{ flexDirection: "row" }}>
        {/* title */}
        <Text
          onLongPress={() => setConfirm(true)}
          onPress={() => setOpen((prev) => !prev)}
          style={styles.title}
        >
          {title?.toUpperCase()}
        </Text>

        {/* show body button*/}
        <View style={styles.showing}>
          {open ? (
            <Ionicons
              onPress={() => setOpen((prev) => !prev)}
              name={"chevron-up-outline"}
              size={20}
            />
          ) : (
            <Ionicons
              onPress={() => setOpen((prev) => !prev)}
              name={"chevron-down-outline"}
              size={20}
            />
          )}
        </View>
      </View>

      {open && (
        <>
          {/* body */}
          <View style={[styles.body]}>
            {children || (
              <>
                <Text style={styles.title}>{language.OLD_VALUE}</Text>
                {oldValue}
                <Text style={[styles.title, { marginTop: 5 }]}>
                  {language.NEW_VALUE}
                </Text>
                {newValue}
              </>
            )}
          </View>

          {/* submit button */}
          {!children && (
            <Button
              title={language.SUBMIT}
              textColor="white"
              backgroundColor={BackgroundColor.primary}
              onPress={onSubmit}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 10,
    shadowColor: BackgroundColor.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    backgroundColor: BackgroundColor.white,
    borderRadius: 20,
    padding: 12,
  },
  title: {
    flex: 1,
    fontWeight: "600",
    fontSize: 15,
  },
  showing: {
    alignSelf: "center",
  },
  body: {
    flex: 1,
    padding: 5,
  },
});
