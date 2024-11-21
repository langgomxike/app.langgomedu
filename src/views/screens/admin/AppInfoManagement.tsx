import {Linking, StyleSheet, Text, TextInput, View} from "react-native";
import BackLayout from "../../layouts/Back";
import {BackgroundColor, TextColor} from "../../../configs/ColorConfig";
import AppInfoContainer from "../../components/admin/AppInfoContainer";
import {Dispatch, SetStateAction, useCallback, useContext, useEffect, useState} from "react";
import SFirebase from "../../../services/SFirebase";
import general_infos from "../../../constants/general_infos.json";
import {AppInfoContext} from "../../../configs/AppInfoContext";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-simple-toast";
import {LanguageContext} from "../../../configs/LanguageConfig";

export default function AppInfoManagementScreen() {
  //contexts
  const appInfoContext = useContext(AppInfoContext).infos;
  const languageContext = useContext(LanguageContext).language;

  //states
  const [appName, setAppName] = useState("");
  const [appLogo, setAppLogo] = useState("");
  const [appWebLink, setAppWebLink] = useState("https://");
  const [creationFeeForTutors, setCreationFeeForTutors] = useState(0);
  const [creationFeeForParents, setCreationFeeForParents] = useState(0);
  const [urNotSerious, setURNotSerious] = useState(0);
  const [urQuiteSerious, setURQuiteSerious] = useState(0);
  const [urSerious, setURSerious] = useState(0);
  const [urExtremelySerious, setURExtremelySerious] = useState(0);
  const [crNotSerious, setCRNotSerious] = useState(0);
  const [crQuiteSerious, setCRQuiteSerious] = useState(0);
  const [crSerious, setCRSerious] = useState(0);
  const [crExtremelySerious, setCRExtremelySerious] = useState(0);
  const [loading, setLoading] = useState(false);

  //handlers
  const handlerChangeAppInfo = useCallback((key: string, value: string | number, setState? : Dispatch<any>) => {
    setLoading(true);

    const infors = {...appInfoContext, [key]: value};

    SFirebase.setAppInfos(infors, () => {
      setState && setState(typeof value == typeof 0 ? 0: "");
      setLoading(false);
      Toast.show("Updated!", 1000);
    });
  }, [appName, appInfoContext]);

  //effects
  useEffect(() => {
    if (!appWebLink) {
      setAppWebLink("https://");
    }
  }, [appWebLink]);

  return (
    <BackLayout>
      <View style={{flex: 1}}>
        <Spinner visible={loading} />

        <Text style={styles.title}>{languageContext.GENERAL_MANAGEMENT?.toUpperCase()}</Text>

        {/* App name */}
        <AppInfoContainer
          title={"App name"}
          oldValue={(
            <TextValue value={appInfoContext.app_name}/>
          )}
          newValue={(
            <TextValueInput value={appName} setValue={setAppName}/>
          )}
          onSubmit={() => handlerChangeAppInfo("app_name", appName, setAppName)}
        />

        {/*/!*  web link*!/*/}
        <AppInfoContainer
          title={"Website link"}
          oldValue={(
            <TextValue value={appInfoContext.webiste_link} isLink={true}/>
          )}
          newValue={(
            <TextValueInput value={appWebLink} setValue={setAppWebLink} isLink={true}/>
          )}
          onSubmit={() => handlerChangeAppInfo("webiste_link", appWebLink, setAppWebLink)}
        />

        {/*/!*  creation fee for tutor *!/*/}
        <AppInfoContainer
          title={"Creation fee for tutors"}
          oldValue={(
            <TextValue value={appInfoContext.creation_fee_for_tutors * 100 + "%"} isNum={true}/>
          )}
          newValue={(
            <TextValueInput value={creationFeeForTutors || ""} setValue={(value) => setCreationFeeForTutors(+value)}
                            isNum={true}/>
          )}
          onSubmit={() => handlerChangeAppInfo("creation_fee_for_tutors", creationFeeForTutors / 100, setCreationFeeForTutors)}
        />

        {/*/!* creation fee for parent *!/*/}
        <AppInfoContainer
          title={"Creation fee for parents"}
          oldValue={(
            <TextValue value={appInfoContext.creation_fee_for_parents * 100 + "%"} isNum={true}/>
          )}
          newValue={(
            <TextValueInput value={creationFeeForParents || ""} setValue={(value) => setCreationFeeForParents(+value)}
                            isNum={true}/>
          )}
          onSubmit={() => handlerChangeAppInfo("creation_fee_for_parents", creationFeeForParents / 100, setCreationFeeForParents)}
        />

        {/*/!*   report user levels *!/*/}
        <AppInfoContainer
          title={"Report user levels"}
        >
          <>
            <AppInfoContainer
              title={"Not serious"}
              oldValue={(
                <TextValue value={appInfoContext.report_user_level_1 + ""} isNum={true}/>
              )}
              newValue={(
                <TextValueInput value={urNotSerious || ""}
                                setValue={(value) => setURNotSerious(+value)} isNum={true}/>
              )}
              onSubmit={() => handlerChangeAppInfo("report_user_level_1", urNotSerious, setURNotSerious)}
            />

            <AppInfoContainer
              title={"Quite serious"}
              oldValue={(
                <TextValue value={appInfoContext.report_user_level_2 + ""} isNum={true}/>
              )}
              newValue={(
                <TextValueInput value={urQuiteSerious || ""}
                                setValue={(value) => setURQuiteSerious(+value)} isNum={true}/>
              )}
              onSubmit={() => handlerChangeAppInfo("report_user_level_2", urQuiteSerious, setURQuiteSerious)}
            />

            <AppInfoContainer
              title={"Serious"}
              oldValue={(
                <TextValue value={appInfoContext.report_user_level_3 + ""} isNum={true}/>
              )}
              newValue={(
                <TextValueInput value={urSerious || ""}
                                setValue={(value) => setURSerious(+value)} isNum={true}/>
              )}
              onSubmit={() => handlerChangeAppInfo("report_user_level_3", urSerious, setURSerious)}
            />

            <AppInfoContainer
              title={"Extremely serious"}
              oldValue={(
                <TextValue value={appInfoContext.report_user_level_4 + ""} isNum={true}/>
              )}
              newValue={(
                <TextValueInput value={urExtremelySerious || ""}
                                setValue={(value) => setURExtremelySerious(+value)} isNum={true}/>
              )}
              onSubmit={() => handlerChangeAppInfo("report_user_level_4", urExtremelySerious, setURExtremelySerious)}
            />
          </>
        </AppInfoContainer>

        <AppInfoContainer
          title={"Report class levels"}
        >
          <>
            <AppInfoContainer
              title={"Not serious"}
              oldValue={(
                <TextValue value={appInfoContext.report_class_level_1 + ""} isNum={true}/>
              )}
              newValue={(
                <TextValueInput value={crNotSerious || ""}
                                setValue={(value) => setCRNotSerious(+value)} isNum={true}/>
              )}
              onSubmit={() => handlerChangeAppInfo("report_class_level_1", crNotSerious, setCRNotSerious)}
            />

            <AppInfoContainer
              title={"Quite serious"}
              oldValue={(
                <TextValue value={appInfoContext.report_class_level_2 + ""} isNum={true}/>
              )}
              newValue={(
                <TextValueInput value={crQuiteSerious || ""}
                                setValue={(value) => setCRQuiteSerious(+value)} isNum={true}/>
              )}
              onSubmit={() => handlerChangeAppInfo("report_class_level_2", crQuiteSerious, setCRQuiteSerious)}
            />

            <AppInfoContainer
              title={"Serious"}
              oldValue={(
                <TextValue value={appInfoContext.report_class_level_3 + ""} isNum={true}/>
              )}
              newValue={(
                <TextValueInput value={crSerious || ""}
                                setValue={(value) => setCRSerious(+value)} isNum={true}/>
              )}
              onSubmit={() => handlerChangeAppInfo("report_class_level_3", crSerious, setCRSerious)}
            />

            <AppInfoContainer
              title={"Extremely serious"}
              oldValue={(
                <TextValue value={appInfoContext.report_class_level_4 + ""} isNum={true}/>
              )}
              newValue={(
                <TextValueInput value={crExtremelySerious || ""}
                                setValue={(value) => setCRExtremelySerious(+value)} isNum={true}/>
              )}
              onSubmit={() => handlerChangeAppInfo("report_class_level_4", crExtremelySerious, setCRExtremelySerious)}
            />
          </>
        </AppInfoContainer>
      </View>
    </BackLayout>
  );
}

function TextValue({value, isLink, isNum}: { value: string, isLink?: boolean, isNum?: boolean }) {
  return (
    <Text
      style={[textValueStyles.container, isLink && textValueStyles.isLink, isNum && textValueStyles.isNum]}>{value}</Text>
  )
}

function TextValueInput({value, setValue, isLink, isNum}: {
  value: string | number,
  setValue: (value: string) => void,
  isLink?: boolean,
  isNum?: boolean
}) {
  return (
    <TextInput inputMode={isNum ? "numeric" : "text"} value={value + ""} onChangeText={setValue}
               style={[textValueStyles.container, isLink && textValueStyles.isLink, isNum && textValueStyles.isNum]}
               placeholder={"Edit here"}/>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  }
});

const textValueStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 10,
    shadowColor: BackgroundColor.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    backgroundColor: BackgroundColor.white,
    borderRadius: 10,
    padding: 12,
  },

  isLink: {
    color: TextColor.sub_primary,
    textDecorationLine: "underline",
  },

  isNum: {
    textAlign: "right",
  },
});
