import * as React from "react";
import { Text, View } from "react-native";
import BoxWhite from "../components/BoxWhite";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from "@react-navigation/native";
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
import { useState } from "react";
import Filter from "../components/Filter";
import RadioButton from "../components/Inputs/CustomRadioButton";

export default function NhiTestScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleInfor = () => {
    alert("Info");
  };

  const handleClose = () => {
    alert("Close");
    setModalVisible(false); // Đóng modal
  };

  const handleOk = () => {
    alert("OK");
    setModalVisible(false);
  };


  const Drawer = createDrawerNavigator();

  return (
    <>
      {/* TEST BOX WHITE */}
      {/* <BoxWhite>
        <Text>Đây là một ví dụ về box có thể co giãn theo nội dung.</Text>
        <Text>Thêm một số nội dung để kiểm tra khả năng co giãn.</Text>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
      </BoxWhite> */}

      {/* TEST BOX WITH DETAIL */}
      <BackWithDetailLayout
        icName="Back"
        subIcon={<MyIcon icon={AppIcon.ic_info} onPress={handleInfor} />}
      >
        <Text>NGUYEN PHUONG NHI</Text>
      </BackWithDetailLayout>

      {/* <BackLayout>
        <Text>NGUYEN VAN A</Text>
      </BackLayout> */}

      {/* TEST MODAL */}
      {/* <Button
        title="Show Modal"
        onPress={() => setModalVisible(true)}
        backgroundColor={BackgroundColor.primary}
        textColor={TextColor.white}
      />

      <ModalLayout
        subAction={
          <Button
            title="Apply"
            backgroundColor={BackgroundColor.primary}
            textColor={TextColor.white}
            onPress={handleOk}
          />
        }
        onClose={handleClose}
        visible={modalVisible}
      >
        <Text>USER: a@gmail.com</Text>
        <Avatar
          canEdit={false}
          onPress={handleInfor}
          orientation={Orientation.horizontally}
          userName="NGUYEN VAN A"
        />
        <Text>SCOPE: User</Text>
        <Text>PERMISSION TO: Delete</Text>
      </ModalLayout> */}

      {/* <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Notifications" component={Filter} />
        </Drawer.Navigator>
      </NavigationContainer> */}

      {/* <Filter/> */}
      {/* <RadioButton onSelect={handleSelect} options={options}/> */}
    </>
  );
}
