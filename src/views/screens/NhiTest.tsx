import { Text, View } from "react-native";
import BoxWhite from "../components/BoxWhite";
import MyText from "../components/MyText";
import MyIcon, { AppIcon } from "../components/MyIcon";
import BackWithDetailLayout from "../layouts/BackWithDetail";
import BackLayout from "../layouts/Back";
import ModalLayout from "../layouts/Modal";
import CustomModal from "../components/CustomModal";
import Box from "../components/Box";
import Button from "../components/Button";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";
import Avatar, { Orientation } from "../components/Avatar";
import { StyleSheet } from "react-native";

export default function NhiTestScreen() {

  const handleInfor = () => {
    alert("Info");
  };

  const handleClose = () => {
    alert("Info");
  };

  return (
    <>
      {/* <BoxWhite/>  */}

      {/* <BackWithDetailLayout
        icName="Back"
        subIcon={<MyIcon icon={AppIcon.ic_info} onPress={handleInfor} />}
      >
        <Text>NGUYEN PHUONG NHI</Text>
      </BackWithDetailLayout> */}

      {/* <BackLayout>
        <Text>NGUYEN VAN A</Text>
      </BackLayout> */}

      <ModalLayout>
        <Text>USER: a@gmail.com</Text>
        <Avatar
          canEdit={false}
          onPress={handleClose}
          orientation={Orientation.horizontally}
          userName="NGUYEN VAN A"
        />
        <Text>SCOPE: User</Text>
        <Text>PERMISSION TO: Delete</Text>
      </ModalLayout>
    </>
  );
}
