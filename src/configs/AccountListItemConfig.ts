import { AppIcon } from "../views/components/MyIcon";
import { AccountItemProps } from "../views/components/AccountItem";

export const ListItem: Array<AccountItemProps> = [
    {
        title: 'Hồ Sơ Thông Tin',
        iconName: AppIcon.ic_user_blue,
        screenName: 'ProfileScreen'
    },
    {
        title: 'CV Gia Sư',
        iconName: AppIcon.ic_user_blue,
        screenName: 'ProfileScreen'
    },
    {
        title: 'Quản lý lớp học',
        iconName: AppIcon.ic_classes,
        screenName: 'ProfileScreen'
    },
    {
        title: 'Đánh giá từ phụ huynh, học sinh',
        iconName: AppIcon.icon_star_light,
        screenName: 'ProfileScreen'
    },
    {
        title: 'Đổi Mật Khẩu',
        iconName: AppIcon.ic_lock,
        screenName: 'ProfileScreen'
    },
    {
        title: 'Xóa tài khoản',
        iconName: AppIcon.ic_bin,
        screenName: 'ProfileScreen'
    },
    {
        title: 'Tiếng Việt',
        iconName: AppIcon.ic_language,
        screenName: 'ProfileScreen'
    },
    {
        title: 'Đăng xuất',
        iconName: AppIcon.ic_logout,
        screenName: 'ProfileScreen'
    },
]