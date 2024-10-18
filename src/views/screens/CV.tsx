import { Text } from "react-native";
import BackLayout from "../layouts/Back";
import QRInfo from "../components/QRInfo";
import { QRItems } from "../../configs/QRConfig";

export default function CVScreen() {
  return (
    <>
      <QRInfo id={123} type={QRItems.CV} />

      <BackLayout>
        <Text>CVScreen</Text>
      </BackLayout>
    </>
  );
}
