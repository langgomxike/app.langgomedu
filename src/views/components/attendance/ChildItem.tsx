import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { BackgroundColor } from "../../../configs/ColorConfig";
import { Dimensions } from "react-native";
import User from "../../../models/User";
import ReactAppUrl from "../../../configs/ConfigUrl";
import ModalPaidResult from "../modal/ModalPaidResult";
import AAttendance from "../../../apis/AAttendance";

type ChildItemProps = {
  lessonId: number;
  learnerData: User;
  onConfirmStatus: (status: boolean) => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get("screen");
const URL = ReactAppUrl.PUBLIC_URL;

export default function ChildItem({
  lessonId,
  learnerData,
  onConfirmStatus,
}: ChildItemProps) {
  // states ----------------------------------------------------------------
  const [modalVisible, setModalVisible] = useState<string | null>("");
  const [loading, setLoading] = React.useState(false);
  const [notificationContent, setNotificationContent] = useState<{
    image: any;
    message: string;
  }>({ image: null, message: "" });

  // handler ----------------------------------------------------------------
  // Hàm xác nhận thanh toán cho gia sư
  const handleConformPay = useCallback((userId: string) => {
    const action = "confirm_paid";
    AAttendance.confirmPaidForLearner(
      lessonId,
      userId,
      action,
      (data) => {
        setModalVisible("modalDialogForClass");
        if (data.result) {
          onConfirmStatus(data.result);
        }
      },
      setLoading
    );
  }, []);

  const handleConformDeferred = useCallback((userId: string) => {
    const action = "confirm_deferred";
    AAttendance.confirmPaidForLearner(
      lessonId,
      userId,
      action,
      (data) => {
        setModalVisible("modalDialogForClass");
        if (data.result) {
          onConfirmStatus(data.result);
        }
      },
      setLoading
    );
  }, []);

  const handleNotify = useCallback((userId: string) => {
    alert("Đã gửi thông báo");
  }, []);

  // effect ----------------------------------------------------------------
  useEffect(() => {
    const determineNotificationContent = () => {
      if (learnerData.attendance?.paid) {
        return {
          image: require("../../../../assets/images/ic_pay.png"),
          message: "Bạn học này đã thành toán.\nChờ bạn xác nhận!",
        };
      } else if (learnerData.attendance?.deferred) {
        return {
          image: require("../../../../assets/images/ic_deferred.png"),
          message: "Bạn học muốn được trì hoãn thanh toán.\nChờ bạn xác nhận!",
        };
      } else {
        return {
          image: require("../../../../assets/images/ic_no_money.png"),
          message: "Bạn học này chưa thanh toán.\nHãy nhắc nhở họ!",
        };
      }
    };

    setNotificationContent(determineNotificationContent());
  }, [learnerData]);

  return (
    <View style={[styles.childItemContainer, styles.boxshadow]}>
      <View style={styles.points}>
        {learnerData.attendance && 
        <View
          style={[
            styles.point,
            {
              backgroundColor: learnerData.attendance?.attended
                ? BackgroundColor.green_light
                : BackgroundColor.gray_c6,
            },
          ]}
        ></View>
        }
      </View>
      <View style={styles.childInfo}>
        <Image
          source={{
            uri: `${URL}${learnerData.avatar}`,
          }}
          style={styles.avtarImage}
        />
        <Text style={styles.fullName}>{learnerData.full_name}</Text>
      </View>

      {learnerData.attendance && (
        <View>
          <View style={styles.notificationContent}>
            {notificationContent.image && (
              <Image
                source={notificationContent.image}
                style={styles.payIcon}
              />
            )}
            <Text style={styles.infomationText}>
              {notificationContent.message}
            </Text>

            <TouchableOpacity
              onPress={() => {
                if (learnerData.attendance?.type === "bank") {
                  setModalVisible("modal_paid_result");
                }
              }}
            >
              {learnerData.attendance?.type === "bank" ? (
                <Text style={[styles.textSubTitle, styles.borderBottom]}>
                  Xem thông tin
                </Text>
              ) : (
                <Text style={styles.textSubTitle}> ... </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.btnContainer}>
            {learnerData.attendance?.paid && (
              <TouchableOpacity
                disabled={learnerData.attendance.confirm_paid}
                onPress={() => handleConformPay(learnerData.id)}
                style={[
                  styles.btn,
                  styles.boxshadow,
                  learnerData.attendance.confirm_paid
                    ? styles.btnDisabled
                    : styles.btnAccpet,
                ]}
              >
                <Text
                  style={[styles.btnText, { color: BackgroundColor.white }]}
                >
                  {learnerData.attendance.confirm_paid
                    ? "Đã xác nhận thanh toán"
                    : "Xác nhân thanh toán"}
                </Text>
                {loading && 
                <ActivityIndicator color="#fff" />
                }
              </TouchableOpacity>
            )}

            {learnerData.attendance?.deferred && (
              <TouchableOpacity
                disabled={learnerData.attendance.confirm_deferred}
                onPress={() => {
                  handleConformDeferred(learnerData.id);
                }}
                style={[
                  styles.btn,
                  styles.boxshadow,
                  learnerData.attendance.confirm_deferred
                    ? styles.btnDisabled
                    : styles.btnDeferred,
                ]}
              >
                <Text
                  style={[styles.btnText, { color: BackgroundColor.white }]}
                >
                  {learnerData.attendance.confirm_deferred
                    ? "Đã xác nhận trì hoãn"
                    : "Xác nhận trì hoãn"}
                </Text>
                {loading && 
                <ActivityIndicator color="#fff" />}
              </TouchableOpacity>
            )}

            {!learnerData.attendance?.deferred &&
              !learnerData.attendance?.paid && (
                <TouchableOpacity
                  onPress={() => handleNotify(learnerData.id)}
                  style={[styles.btn, styles.btnNotify, styles.boxshadow]}
                >
                  <Text
                    style={[styles.btnText, { color: BackgroundColor.white }]}
                  >
                    Gửi nhắc nhở
                  </Text>
                  {/* <ActivityIndicator color="#fff" /> */}
                </TouchableOpacity>
              )}
          </View>
        </View>
      )}

      {/* Modal show paid result */}
      <ModalPaidResult
        visiable={modalVisible}
        onRequestClose={() => setModalVisible(null)}
        image_uri={`${ReactAppUrl.PUBLIC_URL}${learnerData.attendance?.payment_path}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  childItemContainer: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: BackgroundColor.white,
    marginRight: 15,
    borderRadius: 8,
  },

  points: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "flex-end",
  },

  point: {
    width: 25,
    height: 10,
    borderRadius: 99,
  },

  boxshadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },

  avtarImage: {
    width: 40,
    height: 40,
    borderRadius: 999,
  },

  fullName: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 16,
  },

  childInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: SCREEN_WIDTH * 0.7,
  },

  notificationContent: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },

  infomationText: {
    color: BackgroundColor.gray_text,
    textAlign: "center",
    fontWeight: "500",
  },

  payIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },

  btnContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  btn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
    width: SCREEN_WIDTH * 0.3,
    flexDirection: "row",
    gap: 10,
    alignContent: "center",
    justifyContent: "center"
  },

  btnText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },

  btnDisabled: {
    backgroundColor: BackgroundColor.gray_50,
  },

  btnDeferred: {
    backgroundColor: BackgroundColor.warning,
  },

  btnAccpet: {
    backgroundColor: BackgroundColor.primary,
  },

  btnNotify: {
    backgroundColor: "#FE4242",
  },

  textSubTitle: {
    textAlign: "center",
    marginTop: 10,
    color: BackgroundColor.primary,
    fontWeight: "bold",
  },

  borderBottom: {
    borderBottomColor: BackgroundColor.primary,
    borderBottomWidth: 1,
  },
});
