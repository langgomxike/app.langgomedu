import {ScrollView, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import BackWithDetailLayout from "../layouts/BackWithDetail";
import {ListItemVietnamese, ListItemEnglish, ListItemJapanese} from "../../configs/AccountListItemConfig";
import AccountItem, {AccountItemProps} from "../components/AccountItem";
import QRInfo from "../components/QRInfo";
import {QRItems} from "../../configs/QRConfig";
import {ElementRef, useCallback, useContext, useEffect, useRef, useState} from "react";
import {NavigationContext} from "@react-navigation/native";
import ScreenName from "../../constants/ScreenName";
import SAsyncStorage, {AsyncStorageKeys} from "../../services/SAsyncStorage";
import Toast from "react-native-simple-toast";
import {AccountContext} from "../../configs/AccountConfig";
import {LanguageContext, Languages} from "../../configs/LanguageConfig";
import RBSheet from "react-native-raw-bottom-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";
import ConfirmDialog from "../components/ConfirmDialog";

type FlatListItemProps = {
    item: AccountItemProps;
    index: number;
}

function FlatListItem({item, index}: FlatListItemProps) {
    // contexts
    const navigation = useContext(NavigationContext);
    const accountContext = useContext(AccountContext);
    const languageContext = useContext(LanguageContext);

    //refs
    const refRBSheet = useRef<ElementRef<typeof RBSheet>>(null);

    //states
    const [handlers, setHandler] = useState<Array<any>>([]);
    const [showConfirmLogout, setShowConfirmLogout] = useState(false);
    const [showConfirmDeleteAccount, setShowConfirmDeleteAccount] = useState(false);

    //handlers
    const goToPersonalInfoScreen = useCallback(() => {
        navigation?.navigate(ScreenName.PROFILE);
    }, []);

    const goToCVScreen = useCallback(() => {
        navigation?.navigate(ScreenName.SETTING_PERSONAL_CV);
    }, []);

    const goToScheduleScreen = useCallback(() => {
        navigation?.navigate(ScreenName.PERSONAL_SCHEDULE);
    }, []);

    const goToRatingScreen = useCallback(() => {
        navigation?.navigate(ScreenName.RATING);
    }, []);

    const goToChangePasswordScreen = useCallback(() => {
        navigation?.navigate(ScreenName.OTP);
    }, []);

    const handleDeleteAccount = useCallback(() => {
        setShowConfirmDeleteAccount(false);
        alert("handleDeleteAccount");
    }, []);

    const handleChangeLanguage = useCallback((language: Languages) => {
        languageContext.setLanguage && languageContext.setLanguage(language);

        refRBSheet.current?.close();
    }, []);

    const handleLogout = useCallback(() => {
        setShowConfirmLogout(false);
        SAsyncStorage.removeData(AsyncStorageKeys.TOKEN,
            () => {
                accountContext.setAccount && accountContext.setAccount(undefined);

                navigation?.navigate(ScreenName.LOGIN);
                Toast.show("Đăng xuất thành công", 2000);
            },
            (error) => {
                alert("Không thể đăng xuất");
            }
        )
    }, []);

    useEffect(() => {
        const handlers = [
            goToPersonalInfoScreen,
            goToCVScreen,
            goToScheduleScreen,
            goToRatingScreen,
            goToChangePasswordScreen,
            () => setShowConfirmDeleteAccount(true),
            refRBSheet.current?.open,
            () => setShowConfirmLogout(true),
        ];

        setHandler(handlers);
    }, []);

    return (
        <>
            <AccountItem
                iconName={item.iconName}
                title={item.title}
                onPress={handlers[index]}
            />

            {/*    language bottom sheet */}
            <RBSheet ref={refRBSheet} useNativeDriver={false} height={150}>
                <TouchableOpacity style={action.action} onPress={() => handleChangeLanguage(Languages.VN)}>
                    <Ionicons
                        name="return-down-forward-outline"
                        size={20}
                        color={BackgroundColor.black}
                    />
                    <Text style={action.item}>Tiếng Việt</Text>
                </TouchableOpacity>

                <TouchableOpacity style={action.action} onPress={() => handleChangeLanguage(Languages.EN)}>

                    <Ionicons
                        name="return-down-forward-outline"
                        size={20}
                        color={BackgroundColor.black}
                    />
                    <Text style={action.item}>English</Text>
                </TouchableOpacity>

                <TouchableOpacity style={action.action} onPress={() => handleChangeLanguage(Languages.JA)}>

                    <Ionicons
                        name="return-down-forward-outline"
                        size={20}
                        color={BackgroundColor.black}
                    />
                    <Text style={action.item}>日本語</Text>
                </TouchableOpacity>
            </RBSheet>

            {/*confirm dialog for logout*/}
            <ConfirmDialog title={"Dang xuat"} content={"Xac nhan dang xuat"} open={showConfirmLogout}
                           confirm={"Xac nhan"}
                           cancel={"Huy"}
                           onConfirm={handleLogout}
                           onCancel={() => setShowConfirmLogout(false)}/>

            {/*confirm dialog for delete account*/}
            <ConfirmDialog title={"Xoa tai khoan"} content={"Xac nhan xoa tai khoan"} open={showConfirmDeleteAccount}
                           confirm={"Xac nhan"}
                           cancel={"Huy"}
                           onConfirm={handleDeleteAccount}
                           onCancel={() => setShowConfirmDeleteAccount(false)}/>

        </>
    );
}

export default function AccountScreen() {
    //contexts
    const languageContext = useContext(LanguageContext);

    //states
    const [ListItem, setListItem] = useState<AccountItemProps[]>(ListItemVietnamese);

    //effects
    useEffect(() => {
        switch (languageContext.language.TYPE) {
            case  Languages.VN:
                setListItem(ListItemVietnamese);
                break;
            case Languages.EN:
                setListItem(ListItemEnglish);
                break;
            case Languages.JA:
                setListItem(ListItemJapanese);
                break;
        }

        //save language into storage
        SAsyncStorage.setData(AsyncStorageKeys.LANGUAGE, languageContext.language.TYPE + "");

        Toast.show(languageContext.language.CHANGE_LANGUAGE, 2000);
    }, [languageContext.language]);

    //tsx
    return (
        <>
            <QRInfo id={123} type={QRItems.USER}/>
            <BackWithDetailLayout icName="Back">
                <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                    {ListItem.map((item, index) => (
                        <FlatListItem item={item} index={index} key={item.title}/>
                    ))}
                </ScrollView>
                <View style={{marginBottom: 50}}/>
            </BackWithDetailLayout>
        </>
    );
}

const action = StyleSheet.create({
    action: {
        flexDirection: "row",
        margin: 10,
        gap: 10,
    },
    item: {
        fontSize: 13,
        fontWeight: "bold",
        alignSelf: "center",
    },

    scrollToBottomButtonContainer: {
        position: "absolute",
        top: -40,
        left: 0,
        right: 0,
    },

    scrollToBottomButton: {
        backgroundColor: BackgroundColor.sub_primary,
        borderRadius: 30,
        paddingVertical: 5,
        paddingHorizontal: 10,
        color: TextColor.white,
        alignSelf: "center",
    },
});