import {Image, ScrollView, StyleSheet, Text, View} from "react-native";
import InputRegister from "../components/Inputs/InputRegister";
import Button from "../components/Button";
import {useCallback, useContext, useState} from "react";
import {NavigationContext} from "@react-navigation/native";
import ScreenName from "../../constants/ScreenName";
import AUser from "../../apis/AUser";
import {AccountContext} from "../../configs/AccountConfig";
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";
import SLog, {LogType} from "../../services/SLog";
import SAsyncStorage, {AsyncStorageKeys} from "../../services/SAsyncStorage";
import Toast from 'react-native-simple-toast';
import Role from "../../models/Role";

export default function LoginScreen() {
    //contexts
    const navigation = useContext(NavigationContext);
    const accountContext = useContext(AccountContext);

    //states
    const [emailOrPhoneNumber, setEmailOrPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    //handlers
    const handleForgettingPassword = useCallback(() => {
        navigation?.goBack();
        navigation?.navigate(ScreenName.OTP);
    }, []);

    const goToRegister = useCallback(() => {
        navigation?.goBack();
        navigation?.navigate(ScreenName.REGISTER_1);
    }, []);

    const handleLogin = useCallback(() => {
        //validate
        if (
            !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                emailOrPhoneNumber
            ) &&
            !/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(
                emailOrPhoneNumber
            )
        ) {
            alert(
                "Email hoặc số điện thoại không đúng định dạng.\nVui lòng thử lại."
            );
            return;
        }

        if (!/(?=^.{6,}$)(?=.*[0-9])(?=.*[A-Z]).*/.test(password)) {
            alert(
                "Mật khẩu không đúng định dạng:\n\t\t- Từ 6 đến 25 kí tự \n\t\t- Chứa ít nhất 1 số\nVui lòng thử lại."
            );
            return;
        }

        const email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
            emailOrPhoneNumber
        )
            ? emailOrPhoneNumber
            : "";

        const phoneNumber =
            /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(
                emailOrPhoneNumber
            )
                ? emailOrPhoneNumber
                : "";

        AUser.login(email, phoneNumber, password, (user) => {
            if (!user) {
                alert("Đăng nhập thất bại");
                return;
            }

            if (accountContext.setAccount) {
                //save to global context
                accountContext.setAccount(user);

                //save into storage
                SAsyncStorage.setData(AsyncStorageKeys.TOKEN, user.token, () => {
                    //back to home
                    navigation?.goBack();

                    //check if admin/superadmin or not
                    if (user.role?.id === Role.SUPER_ADMIN_ROLE_ID || user.role?.id === Role.SUPER_ADMIN_ROLE_ID) {
                        navigation?.navigate(ScreenName.HOME_ADMIN);
                    } else {
                        navigation?.navigate(ScreenName.HOME);
                    }

                    Toast.show("Xin chào " + user.full_name, 2000);
                }, () => {
                    alert("Đăng nhập thất bại. Không thể sử dụng ứng dụng ngay lúc này. Vui lòng thử lại");
                    return;
                });
            }

        });
    }, [emailOrPhoneNumber, password, accountContext.account]);

    return (
        <ScrollView>
            <View style={styles.container}>
                <Image
                    style={styles.img}
                    source={require("../../../assets/images/ illustration/Mobile login-rafiki.png")}
                />

                <View style={styles.row}>
                    <View>
                        <Text style={styles.title}> Đăng nhập</Text>
                        <Text style={styles.content}>Hãy nhập thông tin để đăng nhập</Text>
                    </View>
                    <View></View>
                </View>

                {/* input email or phone number */}
                <View style={styles.input}>
                    <InputRegister
                        label="Email hoặc số điện thoại"
                        required={true}
                        placeholder="Emal hoặc số điện thoại"
                        type="text"
                        onChangeText={setEmailOrPhoneNumber} // Hàm cập nhật state khi nhập
                        iconName="phone"
                        value={emailOrPhoneNumber}
                    />
                </View>

                {/* input password */}
                <View style={styles.input}>
                    <InputRegister
                        label="Mật khẩu của bạn"
                        required={true}
                        placeholder="Mật khẩu của bạn"
                        type="password"
                        iconName="password"
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                {/* forgot password */}
                <Text
                    style={[styles.forgotPassword, styles.link]}
                    onPress={handleForgettingPassword}
                >
                    Bạn quên mật khẩu?
                </Text>

                {/* submit button */}
                <Button
                    title="Đăng nhập"
                    textColor="white"
                    backgroundColor={BackgroundColor.primary}
                    onPress={handleLogin}
                />

                {/* register */}
                <Text style={styles.link} onPress={goToRegister}>
                    Bạn chưa có tài khoản? Hãy đăng ký
                </Text>
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },

    input: {
        top: "0%",
        height: 20,
        width: "90%",
        marginBottom: "15%",
    },

    img: {
        top: 30,
        width: 250,
        height: 250,
        alignItems: "center",
    },

    title: {
        fontSize: 25,
        fontWeight: "bold",
    },

    content: {
        fontSize: 14,
        marginBottom: "20%",
    },

    forgotPassword: {
        top: -10,
        left: 100,
        marginBottom: "20%",
    },

    link: {
        color: TextColor.sub_primary,
    },

    button: {
        marginTop: "10%",
        alignItems: "center",
    },

    row: {
        // Đặt các biểu tượng nằm trên cùng một hàng
        marginLeft: "-40%", // Cân đối khoảng cách giữa các biểu tượng
        marginBottom: " -12%", // Thêm khoảng cách dưới hàng icon
    },
});
