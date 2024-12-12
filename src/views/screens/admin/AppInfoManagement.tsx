import {Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import BackLayout from "../../layouts/Back";
import {BackgroundColor, TextColor} from "../../../configs/ColorConfig";
import AppInfoContainer from "../../components/admin/AppInfoContainer";
import {Dispatch, useCallback, useContext, useEffect, useState} from "react";
import SFirebase from "../../../services/SFirebase";
import {AppInfoContext} from "../../../configs/AppInfoContext";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-simple-toast";
import {LanguageContext} from "../../../configs/LanguageConfig";
import {NavigationContext} from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';
import SLog, {LogType} from "../../../services/SLog";

export default function AppInfoManagementScreen() {
  //contexts
  const appInfoContext = useContext(AppInfoContext).infos;
  const languageContext = useContext(LanguageContext).language;

  const navigation = useContext(NavigationContext);

  //states
  const [appName, setAppName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [aiKey, setAIKey] = useState("");
  const [otpServiceKey, setOTPServiceKey] = useState("");
  const [appWebLink, setAppWebLink] = useState("https://");
  const [appStoreId, setAppStoreId] = useState("");
  const [playStoreId, setPlayStoreId] = useState("");
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
  const [initialPoint, setInitialPoint] = useState(0);
  const [raterReportPoint, setRaterReportPoint] = useState(0);
  const [raterRatingPoint, setRaterRatingPoint] = useState(0);
  const [raterRatedPoint1, setRaterRatedPoint1] = useState(0);
  const [raterRatedPoint2, setRaterRatedPoint2] = useState(0);
  const [raterRatedPoint3, setRaterRatedPoint3] = useState(0);
  const [raterRatedPoint4, setRaterRatedPoint4] = useState(0);
  const [raterRatedPoint5, setRaterRatedPoint5] = useState(0);
  const [loading, setLoading] = useState(false);

  //handlers
  const handlerChangeAppInfo = useCallback((key: string, value: string | number, setState?: Dispatch<any>) => {

    if (!value) return;

    setLoading(true);

    const infors = {...appInfoContext, [key]: value};

    SFirebase.setAppInfos(infors, () => {
      setState && setState(typeof value == typeof 0 ? 0 : "");
      setLoading(false);
      Toast.show(languageContext.UPDATED, 1000);
    });
  }, [appInfoContext]);

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
          <TouchableOpacity onPress={() => navigation.goBack()} style={{paddingRight: 10}}>
            <Ionicons name="chevron-back" size={24} color="white"/>
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

  useEffect(() => {
    if (!contactEmail) {
      setContactEmail("@gmail.com");
    }
  }, [contactEmail]);

  return (
    <ScrollView style={{backgroundColor: BackgroundColor.white}}>
      <View style={styles.bodyContainer}>
        <Spinner visible={loading}/>

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

        {/* contact email */}
        <AppInfoContainer
          title={languageContext.CONTACT_EMAIL}
          oldValue={(
            <TextValue value={appInfoContext.contact_email}/>
          )}
          newValue={(
            <TextValueInput value={contactEmail} setValue={setContactEmail}/>
          )}
          onSubmit={() => handlerChangeAppInfo("contact_email", contactEmail, setContactEmail)}
        />

        {/* AI key */}
        <AppInfoContainer
          title={languageContext.AI_KEY}
          oldValue={(
            <TextValue value={appInfoContext.ai_key}/>
          )}
          newValue={(
            <TextValueInput value={aiKey} setValue={setAIKey}/>
          )}
          onSubmit={() => handlerChangeAppInfo("ai_key", aiKey, setAIKey)}
        />

        {/* OTP service key */}
        <AppInfoContainer
          title={languageContext.OTP_SERVICE_KEY}
          oldValue={(
            <TextValue value={appInfoContext.otp_service_key}/>
          )}
          newValue={(
            <TextValueInput value={otpServiceKey} setValue={setOTPServiceKey}/>
          )}
          onSubmit={() => handlerChangeAppInfo("otp_service_key", otpServiceKey, setOTPServiceKey)}
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

        {/*/!*  app store id *!/*/}
        <AppInfoContainer
          title={languageContext.APP_STORE_APP_ID}
          oldValue={(
            <TextValue value={appInfoContext.apple_store_app_id} isLink={true}/>
          )}
          newValue={(
            <TextValueInput value={appStoreId} setValue={setAppStoreId} isLink={true}/>
          )}
          onSubmit={() => handlerChangeAppInfo("apple_store_app_id", appStoreId, setAppStoreId)}
        />

        {/*/!*  play store *!/*/}
        <AppInfoContainer
          title={languageContext.PLAY_STORE_APP_ID}
          oldValue={(
            <TextValue value={appInfoContext.play_store_app_id} isLink={true}/>
          )}
          newValue={(
            <TextValueInput value={playStoreId} setValue={setPlayStoreId} isLink={true}/>
          )}
          onSubmit={() => handlerChangeAppInfo("play_store_app_id", playStoreId, setPlayStoreId)}
        />

        <AppInfoContainer
          title={languageContext.BANKING_CODE}
          oldValue={(
            <TextValue value={appInfoContext.banking_code} isLink={true}/>
          )}
          newValue={(
            <TextValueInput value={bankingCode} setValue={setBankingCode} isLink={false}/>
          )}
          onSubmit={() => handlerChangeAppInfo("banking_code", bankingCode, setBankingCode)}
        />

        <AppInfoContainer
          title={languageContext.BANKING_NUMBER}
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

        {/*/!* initial point *!/*/}
        <AppInfoContainer
          title={"initial point"}
          oldValue={(
            <TextValue value={appInfoContext.initial_point + ""} isNum={true}/>
          )}
          newValue={(
            <TextValueInput value={initialPoint || ""} setValue={(value) => setInitialPoint(+value)}
                            isNum={true}/>
          )}
          onSubmit={() => handlerChangeAppInfo("initial_point", initialPoint, setInitialPoint)}
        />

        {/*/!* initial point *!/*/}
        <AppInfoContainer
          title={"rater rating point"}
          oldValue={(
            <TextValue value={appInfoContext.rater_rating_point + ""} isNum={true}/>
          )}
          newValue={(
            <TextValueInput value={raterRatingPoint || ""} setValue={(value) => setRaterRatingPoint(+value)}
                            isNum={true}/>
          )}
          onSubmit={() => handlerChangeAppInfo("rater_rating_point", raterRatingPoint, setRaterRatingPoint)}
        />

        {/*/!* initial point *!/*/}
        <AppInfoContainer
          title={"rater reported point"}
          oldValue={(
            <TextValue value={appInfoContext.rater_report_point + ""} isNum={true}/>
          )}
          newValue={(
            <TextValueInput value={raterReportPoint || ""} setValue={(value) => setRaterReportPoint(+value)}
                            isNum={true}/>
          )}
          onSubmit={() => handlerChangeAppInfo("rater_report_point", raterReportPoint, setRaterReportPoint)}
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

        <AppInfoContainer
          title={"rater rating point"}
        >
          <>
            <AppInfoContainer
              title={"vote 1 start"}
              oldValue={(
                <TextValue value={appInfoContext.ratee_rated_point_1 + ""} isNum={true}/>
              )}
              newValue={(
                <TextValueInput value={raterRatedPoint1 || ""}
                                setValue={(value) => setRaterRatedPoint1(+value)} isNum={true}/>
              )}
              onSubmit={() => handlerChangeAppInfo("ratee_rated_point_1", raterRatedPoint1, setRaterRatedPoint1)}
            />

            <AppInfoContainer
              title={"vote 2 start"}
              oldValue={(
                <TextValue value={appInfoContext.ratee_rated_point_2 + ""} isNum={true}/>
              )}
              newValue={(
                <TextValueInput value={raterRatedPoint2 || ""}
                                setValue={(value) => setRaterRatedPoint2(+value)} isNum={true}/>
              )}
              onSubmit={() => handlerChangeAppInfo("ratee_rated_point_2", raterRatedPoint2, setRaterRatedPoint2)}
            />

            <AppInfoContainer
              title={"vote 3 start"}
              oldValue={(
                <TextValue value={appInfoContext.ratee_rated_point_3 + ""} isNum={true}/>
              )}
              newValue={(
                <TextValueInput value={raterRatedPoint3 || ""}
                                setValue={(value) => setRaterRatedPoint3(+value)} isNum={true}/>
              )}
              onSubmit={() => handlerChangeAppInfo("ratee_rated_point_3", raterRatedPoint3, setRaterRatedPoint3)}
            />

            <AppInfoContainer
              title={"vote 4 start"}
              oldValue={(
                <TextValue value={appInfoContext.ratee_rated_point_4 + ""} isNum={true}/>
              )}
              newValue={(
                <TextValueInput value={raterRatedPoint4 || ""}
                                setValue={(value) => setRaterRatedPoint4(+value)} isNum={true}/>
              )}
              onSubmit={() => handlerChangeAppInfo("ratee_rated_point_4", raterRatedPoint4, setRaterRatedPoint4)}
            />

            <AppInfoContainer
              title={"vote 5 start"}
              oldValue={(
                <TextValue value={appInfoContext.ratee_rated_point_5 + ""} isNum={true}/>
              )}
              newValue={(
                <TextValueInput value={raterRatedPoint5 || ""}
                                setValue={(value) => setRaterRatedPoint5(+value)} isNum={true}/>
              )}
              onSubmit={() => handlerChangeAppInfo("ratee_rated_point_5", raterRatedPoint5, setRaterRatedPoint5)}
            />
          </>
        </AppInfoContainer>

        {/* suggested rating*/}
        <AppInfoContainer
          title={languageContext.SUGGESTED_RATING}>

          <AppInfoContainer title={"Tiếng Việt"}>
            <ArrayValue array={appInfoContext.suggested_rating_contents.vn} name={"vn"}
                        fireBaseKey={"suggested_rating_contents"}/>
          </AppInfoContainer>

          <AppInfoContainer title={"English"}>
            <ArrayValue array={appInfoContext.suggested_rating_contents.en} name={"en"}
                        fireBaseKey={"suggested_rating_contents"}/>
          </AppInfoContainer>

          <AppInfoContainer title={"日本語"}>
            <ArrayValue array={appInfoContext.suggested_rating_contents.ja} name={"ja"}
                        fireBaseKey={"suggested_rating_contents"}/>
          </AppInfoContainer>

        </AppInfoContainer>

        {/* suggested messages for tutors*/}
        <AppInfoContainer
          title={languageContext.SUGGESTED_MESSAGES_FOR_TUTORS}>

          <AppInfoContainer title={"Tiếng Việt"}>
            <ArrayValue array={appInfoContext.suggested_messages_for_tutors.vn} name={"vn"}
                        fireBaseKey={"suggested_messages_for_tutors"}/>
          </AppInfoContainer>

          <AppInfoContainer title={"English"}>
            <ArrayValue array={appInfoContext.suggested_messages_for_tutors.en} name={"en"}
                        fireBaseKey={"suggested_messages_for_tutors"}/>
          </AppInfoContainer>

          <AppInfoContainer title={"日本語"}>
            <ArrayValue array={appInfoContext.suggested_messages_for_tutors.ja} name={"ja"}
                        fireBaseKey={"suggested_messages_for_tutors"}/>
          </AppInfoContainer>

        </AppInfoContainer>

        {/* suggested messages for learners*/}
        <AppInfoContainer
          title={languageContext.SUGGESTED_MESSAGES_FOR_LEARNERS}>

          <AppInfoContainer title={"Tiếng Việt"}>
            <ArrayValue array={appInfoContext.suggested_messages_for_learners.vn} name={"vn"}
                        fireBaseKey={"suggested_messages_for_learners"}/>
          </AppInfoContainer>

          <AppInfoContainer title={"English"}>
            <ArrayValue array={appInfoContext.suggested_messages_for_learners.en} name={"en"}
                        fireBaseKey={"suggested_messages_for_learners"}/>
          </AppInfoContainer>

          <AppInfoContainer title={"日本語"}>
            <ArrayValue array={appInfoContext.suggested_messages_for_learners.ja} name={"ja"}
                        fireBaseKey={"suggested_messages_for_learners"}/>
          </AppInfoContainer>

        </AppInfoContainer>

      </View>
    </ScrollView>
  );
}

function ArrayValue({array, fireBaseKey, name}: {
  array: string[];
  fireBaseKey: string,
  name: string
}): React.JSX.Element {
  //states
  const [newItem, setNewItem] = useState("");

  //handlers
  const handleAddItem = useCallback(async () => {
    if (!newItem) return;
    setNewItem("");

    const newArray = [...(array ?? []), newItem];

    SFirebase.setNewList(newArray, fireBaseKey, name, () => {
      SLog.log(LogType.Info, "SFirebase.setNewList", "after being deleted", newArray);
    });
  }, [newItem, fireBaseKey, name]);

  const handleDeleteItem = useCallback(async (index: number) => {
    const newArray: string[] = [];

    for (let i = 0; i < array.length; i++) {
      if (i === index) continue;
      newArray.push(array[i]);
    }

    SLog.log(LogType.Warning, "check new list", "after being deleted", newArray);

    SFirebase.setNewList(newArray, fireBaseKey, name, () => {
      SLog.log(LogType.Info, "SFirebase.setNewList", "after being deleted", newArray);
    });
  }, [array, fireBaseKey, name]);

  return <>
    {array && array.map((item, index) => (
      <View key={index} style={{flexDirection: "row", marginBottom: 12, padding: 8}}>
        <Text style={{flex: 1}}>{item}</Text>

        <Ionicons onPress={() => handleDeleteItem(index)} name={"close"} size={25} style={{alignSelf: "center"}}/>
      </View>
    ))}

    <View style={{
      flexDirection: "row",
      marginBottom: 10,
      padding: 5,
      paddingLeft: 15,
      borderWidth: 0.1,
      borderColor: TextColor.sub_primary,
      borderRadius: 10
    }}>
      <View style={{flex: 1}}>
        <TextInput value={newItem} onChangeText={setNewItem}/>
      </View>

      <Ionicons onPress={handleAddItem} name={"arrow-up-circle-outline"} size={20} style={{alignSelf: "center"}}/>
    </View>
  </>
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
