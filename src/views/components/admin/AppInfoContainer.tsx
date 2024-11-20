import {StyleSheet, Text, View} from "react-native";
import {PropsWithChildren, useState} from "react";
import {BackgroundColor} from "../../../configs/ColorConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import Button from "../Button";

type AppInfoContainerProps = {
  title: string,
  oldValue?: React.JSX.Element,
  newValue?: React.JSX.Element,
  onSubmit?: () => void
}

export default function AppInfoContainer({
                                           title,
                                           oldValue,
                                           newValue,
                                           onSubmit,
                                           children
                                         }: AppInfoContainerProps & PropsWithChildren) {

  //states
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={{flexDirection: 'row'}}>
        {/* title */}
        <Text onPress={() => setOpen(prev => !prev)} style={styles.title}>{title?.toUpperCase()}</Text>

        {/* show body button*/}
        <View style={styles.showing}>
          {open ? (
            <Ionicons onPress={() => setOpen(prev => !prev)} name={"chevron-up-outline"} size={20}/>
          ) : (
            <Ionicons onPress={() => setOpen(prev => !prev)} name={"chevron-down-outline"} size={20}/>
          )}
        </View>
      </View>

      {open &&
        <>
          {/* body */}
          <View style={[styles.body]}>
            {children || (
              <>
                <Text style={styles.title}>Old Value</Text>
                {oldValue}
                <Text style={[styles.title, {marginTop: 5}]}>New Value</Text>
                {newValue}
              </>
            )}
          </View>

          {/* submit button */}
          {!children && (
            <Button
              title={"Submit"}
              textColor="white"
              backgroundColor={BackgroundColor.primary}
              onPress={onSubmit}
            />
          )}
        </>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal:
      5,
    marginVertical:
      10,
    shadowColor:
    BackgroundColor.black,
    shadowOffset:
      {
        width: 0,
        height:
          2,
      }
    ,
    shadowOpacity: 0.25,
    shadowRadius:
      3.84,
    elevation:
      5,
    backgroundColor:
    BackgroundColor.white,
    borderRadius:
      20,
    padding:
      12,
  }
  ,

  title: {
    flex: 1,
    fontWeight:
      "600",
    fontSize:
      15,
  }
  ,

  showing: {
    alignSelf: "center",
  }
  ,

  body: {
    flex: 1,
    padding:
      5,
  }
});