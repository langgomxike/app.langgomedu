import { Text } from "react-native";
import BackLayout from "../../layouts/Back";
import { useContext } from "react";
import { LanguageContext } from "../../../configs/LanguageConfig";

export default function UserReportDetailScreen() {
  const language = useContext(LanguageContext).language;

  return (
    <BackLayout>
      <Text>{language.USER_REPORT_DETAIL_SCREEN}</Text>
    </BackLayout>
  );
}
