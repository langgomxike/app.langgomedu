import { AppIcon } from "../views/components/MyIcon";
import { AccountItemProps } from "../views/components/AccountItem";
import ScreenName from "../constants/ScreenName";
export type AccountScreenProps ={
    title: string,
    iconName: AppIcon,
    screenName?: ScreenName ,
    type: Type
}

export enum Type {
    screen = 0,
    popup = 1,
    function = 2
}

export const ListItem: Array<AccountScreenProps> = [
    {
        title: 'Hồ Sơ Thông Tin',
        iconName: AppIcon.ic_user_blue,
        screenName: ScreenName.SETTING_INFORMATION,
        type: Type.screen
    },
    {
        title: 'CV Gia Sư',
        iconName: AppIcon.ic_user_blue,
        screenName: ScreenName.SETTING_PERSONAL_CV,
        type: Type.screen
    },
    {
        title: 'Quản lý lớp học',
        iconName: AppIcon.ic_classes,
        screenName: ScreenName.SETTING_PERSONAL_CLASSES,
        type: Type.screen,
    },
    {
        title: 'Đánh giá từ phụ huynh, học sinh',
        iconName: AppIcon.icon_star_light,
        screenName: ScreenName.SETTING_PERSONAL_RATINGS,
        type: Type.screen,
    },
    {
        title: 'Đổi Mật Khẩu',
        iconName: AppIcon.ic_lock,
        screenName: ScreenName.CHANGE_PASSWORD,
        type: Type.screen
    },
    {
        title: 'Xóa tài khoản',
        iconName: AppIcon.ic_bin,
        type: Type.popup
    },
    {
        title: 'Tiếng Việt',
        iconName: AppIcon.ic_language,
        type: Type.popup,
    },
    {
        title: 'Đăng xuất',
        iconName: AppIcon.ic_logout,
        type: Type.function
    },
]