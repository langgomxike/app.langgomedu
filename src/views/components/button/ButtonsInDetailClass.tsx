import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { BackgroundColor, BorderColor } from "../../../configs/ColorConfig";
import Class from "../../../models/Class";
import Ionicons from "@expo/vector-icons/Ionicons";

import { UserContext, UserType } from "../../../configs/UserContext";
import { AccountContext } from "../../../configs/AccountConfig";
import ModalPayClassFee from "../modal/ModalPayClassFee";
import AClass from "../../../apis/AClass";

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

  const isAuthor = classDetail?.user_status === "author";
  const isMember = classDetail?.user_status === "member";
  const isTutor = classDetail?.user_status === "tutor";
  const isClassTutor = classDetail?.tutor?.id === account?.id;
  const isClassAuthor = classDetail?.author?.id === account?.id;
  const isLeaner = user.TYPE === UserType.LEANER;

  const isDisabled = isLeaner
    ? isMember || isClassTutor || isClassAuthor
    : isTutor || isClassAuthor || isMember;

  const buttonText = isLeaner
    ? isMember
      ? "Bạn đã tham gia lớp học"
      : isClassTutor
      ? "Bạn đã dạy lớp này"
      : isClassAuthor
      ? "Bạn đã tạo lớp này"
      : "Tham gia lớp học"
    : isTutor
    ? "Đã nhập lớp"
    : isClassAuthor
    ? "Bạn đã tạo lớp này"
    : isMember
    ? "Bạn đã tham gia lớp này"
    : "Nhận dạy lớp";

    // states ----------------------------------------------------------------
    const [modalVisible, setModalVisible] = useState<string | null>("");
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [resultResponse, setResultResponse] = useState(false);
    

    // handlers ----------------------------------------------------------------
    const handlePayClassFee = useCallback(() => {
      const formData = new FormData();
      formData.append("class_id", String(classDetail.id));

      if (selectedImage) {
        console.log("selected image", selectedImage);
        formData.append("paid_image", {
          uri: selectedImage.uri,
          name: selectedImage.fileName,
          type: selectedImage.mimeType,
        } as any);
      }

      AClass.payFeeForClass(formData, (data) => {
        setResultResponse(data.result);
      }, setLoading)


    }, [selectedImage])

  // effects ----------------------------------------------------------------

  return (
    <View>
      {/* Nếu không phải là người tạo lớp */}
      {!isAuthor && (
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
            <Text style={styles.btnAcceptText}>{buttonText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnChat, styles.boxShadowBlue]}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Nếu là người tạo: 
            1: Nếu là gia sư thì hiển thị button chuyển khoản
            2. Nếu là người bình thường thì hiển thị button cho phép họ nhận gia sư hoặc từ chối gia sư đó
       */}
       {isAuthor && 
       <View>
           {account?.id !== classDetail.tutor?.id && (
             <View style={[styles.buttonContainer, styles.boxShadow]}>
               <TouchableOpacity
                 style={[styles.btn, styles.btnAccept, styles.boxShadowBlue]}
               >
                 <Text style={styles.btnDenyText}>Từ chối</Text>
               </TouchableOpacity>
               <TouchableOpacity
                 style={[styles.btn, styles.btnAccept, styles.boxShadowBlue]}
               >
                 <Text style={styles.btnAcceptText}>Chấp nhận</Text>
               </TouchableOpacity>
             </View>
           )}
     
             {account?.id === classDetail.tutor?.id && !classDetail.author_accepted ||  !classDetail.paid && (
              <View style={[styles.buttonContainer, styles.boxShadow]}>
             <TouchableOpacity
                onPress={() => setModalVisible("modalPayClassFee")}
                disabled={!classDetail.admin_accepted || classDetail.paid_path !== null }
               style={[
                 styles.btn, !classDetail.admin_accepted || classDetail.paid_path !== null ? styles.btnAcceptDisable : styles.btnAccept,
                 styles.boxShadowBlue,
               ]}
             >
                 {!classDetail.admin_accepted && 
                 <Text style={styles.btnAcceptText}>Vui lòng chờ duyệt lớp</Text>
                 }
                 {!classDetail.paid && classDetail.admin_accepted && !classDetail.paid_path &&
                 <Text style={styles.btnAcceptText}>Thanh toán phí tạo lớp</Text>
                 }
                 {!classDetail.paid && classDetail.paid_path &&
                 <Text style={styles.btnAcceptText}>Vui lòng chờ xác nhận thanh toán</Text>
                 }
             </TouchableOpacity>
           </View>
           )}
        </View>
       }

       <ModalPayClassFee
       confirmTitle="Thanh toán"
       visiable={modalVisible}
       onRequestCloseDialog={() => setModalVisible(null)}
       onSelectedImage={setSelectedImage}
       onPay={handlePayClassFee}
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
