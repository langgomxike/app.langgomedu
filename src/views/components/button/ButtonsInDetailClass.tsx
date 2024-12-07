import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityComponent,
} from "react-native";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {BackgroundColor, BorderColor} from "../../../configs/ColorConfig";
import Class from "../../../models/Class";
import Ionicons from "@expo/vector-icons/Ionicons";

import {UserContext, UserType} from "../../../configs/UserContext";
import {AccountContext} from "../../../configs/AccountConfig";
import ModalPayClassFee from "../modal/ModalPayClassFee";
import AClass from "../../../apis/AClass";
import {NavigationContext} from "@react-navigation/native";
import ScreenName from "../../../constants/ScreenName";
import {
  CreateReportNavigationType,
  MessageNavigationType,
  ReportNavigationType
} from "../../../configs/NavigationRouteTypeConfig";
import ModalDialogForClass from "../modal/ModalDialogForClass";
import ButtonDisableInClassDetail from "./ButtonDisableInClassDetail";
import {LanguageContext} from "../../../configs/LanguageConfig";
import {AppInfoContext} from "../../../configs/AppInfoContext";

type ButtonsInDetailClassProps = {
  classDetail: Class;
  handleJoinClass: () => void;
  handleAcceptClass: () => void;
};

export default function ButtonsInDetailClass({
                                               classDetail,
                                               handleJoinClass,
                                               handleAcceptClass,
                                             }: ButtonsInDetailClassProps) {
  // contexts ----------------------------------------------------------------
  const user = useContext(UserContext).user;
  const account = useContext(AccountContext).account;
  const navigation = useContext(NavigationContext);
  const language = useContext(LanguageContext).language;
  const appInfoContext = useContext(AppInfoContext).infos;

  const classFee = classDetail ? (classDetail.total_lessons * classDetail.price) *
    (classDetail.author?.id === classDetail.tutor?.id
      ? appInfoContext.creation_fee_for_tutors
      : appInfoContext.creation_fee_for_parents)
    : 0;
  const isAuthor = classDetail?.user_status === "author";
  const isMember = classDetail?.user_status === "member";
  const isAuthorTutor = classDetail?.user_status === "author_and_tutor";
  const notJoin = classDetail?.user_status === "not_joined";
  const isTutor = classDetail?.user_status === "tutor";
  const isTutorAccept =
    classDetail?.user_status === "tutor" && classDetail.author_accepted;
  const isTutorNotAccept =
    classDetail?.user_status === "tutor" && !classDetail.author_accepted;

  const isLeaner = user.TYPE === UserType.LEANER;

  const isDisabled = isLeaner
    ? isMember || isTutor || isAuthor
    : isTutor || isAuthor || isMember;

  // states ----------------------------------------------------------------
  const [modalVisible, setModalVisible] = useState<string | null>("");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [resultResponse, setResultResponse] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    message: string;
  }>({title: "", message: ""});
  const [waitResponse, setWaitResponse] = useState(false);

  // handlers ----------------------------------------------------------------
  const handlePayClassFee = useCallback(() => {
    const formData = new FormData();
    formData.append("class_id", String(classDetail.id));
    formData.append("class_fee", String(classFee));

    if (selectedImage) {
      console.log("selected image", selectedImage);
      formData.append("paid_image", {
        uri: selectedImage.uri,
        name: selectedImage.fileName,
        type: selectedImage.mimeType,
      } as any);
    }

    setModalContent({
      title: language.PAYMENT,
      message: language.PAYMENT_RECORDED,
    });
    setModalVisible("modalDialogForClass");
    AClass.payFeeForClass(
      formData,
      (data) => {

      },
      setWaitResponse
    );
  }, [selectedImage]);

  const goToChatWithAuthor = () => {
    if (classDetail.author) {
      const data: MessageNavigationType = {user: classDetail.author};
      navigation?.navigate(ScreenName.MESSAGE, data);
    }
  };

  const goToCReport = () => {
    if (classDetail.author) {
      const data: CreateReportNavigationType = {reportee: classDetail.author, class: classDetail};
      navigation?.navigate(ScreenName.CREATE_REPORT, data);
    }
  };

  const handleAcceptTutorForClass = (authorAccepted: boolean) => {
    setModalVisible("modalDialogForClass");
    if (authorAccepted) {
      setModalContent({
        title: language.CONFIRM,
        message: language.CONFIRM_TUTOR_SUCCESS,
      });
    } else {
      setModalContent({
        title: language.DECLINE,
        message: language.REJECT_TUTOR_SUCCESS,
      });
    }

    AClass.acceptTutorForClass(
      classDetail.id,
      authorAccepted,
      () => {
      },
      setWaitResponse
    );
  };

  const getButtonText = () => {
    if (isLeaner) {
      if (isMember) return language.JOINED_CLASS;
      if (isTutor) return language.TAUGHT_CLASS;
      if (isAuthor) return language.CREATED_CLASS_D;
      if (notJoin) return language.JOIN_CLASS;
    }

    if (isTutor && !classDetail.author_accepted) {
      return language.PLEASE_WAIT_ACCEPTANCE;
    }

    if (isAuthorTutor && classDetail.admin_accepted && classDetail.paid)
      return language.CREATED_CLASS_D;
    if (isMember) return language.JOINED_CLASS;

    if (notJoin && !isLeaner) return language.TAKE_CLASS;
  };

  // effects ----------------------------------------------------------------

  return (
    <View>

      {/* Không phải lớp của mình */}
      {!isAuthor && !isAuthorTutor && !isTutorAccept && !isTutorNotAccept && (
        <View style={[styles.buttonContainer, styles.boxShadow]}>
          <TouchableOpacity
            onPress={() => {
              if (isLeaner) {
                handleJoinClass();
              } else {
                handleAcceptClass();
              }
            }}
            disabled={isDisabled}
            style={[
              styles.btn,
              isDisabled ? styles.btnAcceptDisable : styles.btnAccept,
              styles.boxShadowBlue,
            ]}
          >
            <Text style={styles.btnAcceptText}>{getButtonText()}</Text>
          </TouchableOpacity>

          {isMember && (
            <TouchableOpacity
              onPress={goToCReport}
              style={[styles.btn, styles.btnChat, styles.boxShadowBlue]}
            >
              <Ionicons
                name="alert"
                size={20}
                color="black"
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={goToChatWithAuthor}
            style={[styles.btn, styles.btnChat, styles.boxShadowBlue]}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={20}
              color="black"
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Lớp mình tham gia để dạy và chờ người tạo chấp nhận */}
      {!isAuthor && isTutorNotAccept && (
        <View style={[styles.buttonContainer, styles.boxShadow]}>
          <ButtonDisableInClassDetail content={language.PLEASE_WAIT_CONFIRMATION}/>
        </View>
      )}

      {/* Lớp mình tham gia để dạy và người tạo chấp nhận sau đó phải đóng phí */}
      {!isAuthor && isTutorAccept && !classDetail.paid_path && (
        <View style={[styles.buttonContainer, styles.boxShadow]}>
          <TouchableOpacity
            onPress={() => setModalVisible("modalPayClassFee")}
            style={[styles.btn, styles.btnAccept, styles.boxShadowBlue]}
          >
            <Text style={styles.btnAcceptText}>{language.PAY_CLASS_CREATION_FEE}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Chấp nhận từ chối khi có tutor tham gia vào lớp mình tạo */}
      {isAuthor && classDetail?.tutor?.id && !classDetail?.author_accepted && (
        <View style={[styles.buttonContainer, styles.boxShadow]}>
          <TouchableOpacity
            onPress={() => handleAcceptTutorForClass(false)}
            style={[styles.btn, styles.btnAccept, styles.boxShadowBlue]}
          >
            <Text style={styles.btnDenyText}>{language.DECLINE}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleAcceptTutorForClass(true)}
            style={[styles.btn, styles.btnAccept, styles.boxShadowBlue]}
          >
            <Text style={styles.btnAcceptText}>{language.ACCEPT}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Chờ admin duyệt lớp mà mình tạo ra */}
      {isAuthorTutor && !classDetail.admin_accepted && (
        <View style={[styles.buttonContainer, styles.boxShadow]}>
          <ButtonDisableInClassDetail content={language.PLEASE_WAIT_CLASS_APPROVAL}/>
        </View>
      )}

      {/* Chờ admin chấp nhận thanh toán lớp của mình hoặc lớp mà người dạy tham gia vào */}
      {(isAuthorTutor || isTutorAccept) &&
        !classDetail.paid &&
        classDetail.paid_path && (
          <View style={[styles.buttonContainer, styles.boxShadow]}>
            <ButtonDisableInClassDetail content={language.PLEASE_WAIT_PAYMENT_CONFIRMATION}/>
          </View>
        )}

      {/* Thanh toán phí tạo lớp cho admin */}
      {isAuthorTutor && classDetail.admin_accepted && !classDetail.paid_path && (
        <View style={[styles.buttonContainer, styles.boxShadow]}>
          <TouchableOpacity
            onPress={() => setModalVisible("modalPayClassFee")}
            style={[styles.btn, styles.btnAccept, styles.boxShadowBlue]}
          >
            <Text style={styles.btnAcceptText}>{language.PAY_CLASS_CREATION_FEE}</Text>
          </TouchableOpacity>
        </View>
      )}

      <ModalPayClassFee
        confirmTitle={language.PAYMENT}
        visiable={modalVisible}
        onRequestCloseDialog={() => setModalVisible(null)}
        classFee={classFee}
        onSelectedImage={setSelectedImage}
        onPay={handlePayClassFee}
      />

      <ModalDialogForClass
        confirmTitle={modalContent.title}
        confirmContent={modalContent.message}
        imageStatus={"success"}
        visiable={modalVisible}
        onRequestCloseDialog={() => {
          setModalVisible(null);
          setWaitResponse(false)
        }}
        loading={waitResponse}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  boxShadowBlue: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 3,
  },

  buttonContainer: {
    backgroundColor: BackgroundColor.white,
    flexDirection: "row",
    borderTopColor: BorderColor.gray_30,
    borderTopWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 15,
  },

  btn: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  btnAccept: {
    flex: 9,
    borderWidth: 1,
    borderColor: BackgroundColor.gray_e6,
    backgroundColor: BackgroundColor.white,
  },

  btnAcceptDisable: {
    flex: 10,
    borderWidth: 1,
    borderColor: BackgroundColor.gray_e6,
    backgroundColor: BackgroundColor.gray_e6,
  },

  btnAcceptText: {
    color: BackgroundColor.primary,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },

  btnDenyText: {
    color: "#ff0000",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },

  btnChat: {
    flex: 1,
    borderWidth: 1,
    borderColor: BackgroundColor.gray_e6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BackgroundColor.white,
  },
});
