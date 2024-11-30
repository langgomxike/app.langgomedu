import {Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
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
import { NavigationContext } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function AppInfoManagementScreen() {
  //contexts
  const appInfoContext = useContext(AppInfoContext).infos;
  const languageContext = useContext(LanguageContext).language;
  const navigation = useContext(NavigationContext);

  //states
  const [appName, setAppName] = useState("");
  const [appLogo, setAppLogo] = useState("");
  const [appWebLink, setAppWebLink] = useState("https://");
  const [bankingCode, setBankingCode] = useState("");
  const [bankingNumber, setBankingNumber] = useState("");
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

    if (!value) return;

    setLoading(true);

    const infors = {...appInfoContext, [key]: value};

    SFirebase.setAppInfos(infors, () => {
      setState && setState(typeof value == typeof 0 ? 0: "");
      setLoading(false);
      Toast.show(languageContext.UPDATED, 1000);
    });
  }, [appName, appInfoContext]);

  //effects
  useEffect(() => {
    // Đặt lại title của header khi màn hình được hiển thị
    if (navigation) {
      navigation.setOptions({
        title: `${languageContext.GENERAL_MANAGEMENT}`,
        headerShown: true,
        contentStyle: {
          padding: 0,
        },
        headerStyle: {
          backgroundColor: BackgroundColor.primary,
        },
        headerTintColor: "#fff",
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        )
      });
    }
  }, [navigation]);

  useEffect(() => {
    if (!appWebLink) {
      setAppWebLink("https://");
    }
  }, [appWebLink]);

  return (
    <ScrollView style={{backgroundColor: BackgroundColor.white}}>
      <View style={styles.bodyContainer}>
        <Spinner visible={loading} />

        <Text style={styles.title}>{languageContext.GENERAL_MANAGEMENT?.toUpperCase()}</Text>

        {/* App name */}
        <AppInfoContainer
          title={languageContext.APP_NAME}
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
          title={languageContext.WEBSITE_LINK}
          oldValue={(
            <TextValue value={appInfoContext.webiste_link} isLink={true}/>
          )}
          newValue={(
            <TextValueInput value={appWebLink} setValue={setAppWebLink} isLink={true}/>
          )}
          onSubmit={() => handlerChangeAppInfo("webiste_link", appWebLink, setAppWebLink)}
        />

        <AppInfoContainer
          title={languageContext.WEBSITE_LINK}
          oldValue={(
            <TextValue value={appInfoContext.banking_code} isLink={true}/>
          )}
          newValue={(
            <TextValueInput value={bankingCode} setValue={setBankingCode} isLink={false}/>
          )}
          onSubmit={() => handlerChangeAppInfo("banking_code", bankingCode, setBankingCode)}
        />

        <AppInfoContainer
          title={languageContext.WEBSITE_LINK}
          oldValue={(
            <TextValue value={appInfoContext.banking_number + ""} isLink={true}/>
          )}
          newValue={(
            <TextValueInput value={bankingNumber} setValue={setBankingNumber} isLink={false}/>
          )}
          onSubmit={() => handlerChangeAppInfo("banking_number", bankingNumber, setBankingNumber)}
        />

        {/*/!*  creation fee for tutor *!/*/}
        <AppInfoContainer
          title={languageContext.CREATION_FEE_FOR_TUTORS}
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
          title={languageContext.CREATION_FEE_FOR_PARENTS}
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
          title={languageContext.REPORT_USER_LEVELS}
        >
          <>
            <AppInfoContainer
              title={languageContext.NOT_SERIOUS}
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
              title={languageContext.QUITE_SERIOUS}
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
              title={languageContext.SERIOUS}
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
              title={languageContext.EXTREMELY_SERIOUS}
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
          title={languageContext.REPORT_CLASS_LEVELS}
        >
          <>
            <AppInfoContainer
              title={languageContext.NOT_SERIOUS}
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
              title={languageContext.QUITE_SERIOUS}
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
              title={languageContext.SERIOUS}
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
              title={languageContext.EXTREMELY_SERIOUS}
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
    </ScrollView>
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

  const language = useContext(LanguageContext).language;

  return (
    <TextInput inputMode={isNum ? "numeric" : "text"} value={value + ""} onChangeText={setValue}
               style={[textValueStyles.container, isLink && textValueStyles.isLink, isNum && textValueStyles.isNum]}
               placeholder={language.EDIT_HERE}/>
  )
}

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1, 
    paddingHorizontal: 15,
    paddingTop: 20,
  },

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
