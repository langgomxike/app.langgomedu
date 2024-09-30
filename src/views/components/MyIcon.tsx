import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text } from "react-native";

// Định nghĩa enum AppIcon ở đầu file
export enum AppIcon {
  // Sử dụng require để chỉ định đường dẫn
<<<<<<< HEAD
  account_tab = require("../../../assets/avatar/avatarTempt.png"), //dang loi ma khong biet sao loi luon á
  chat_tab = require("../../../assets/icons/account_tab.png"),
  home_tab = require("../../../assets/icons/home-tab.png"),
=======
  account_tab = require("../../../assets/icons/account_tab.png"), //dang loi ma khong biet sao loi luon á
  chat_tab = require("../../../assets/icons/account_tab.png"),
 home_tab = require("../../../assets/icons/home-tab.png"),
>>>>>>> 4255cda (fix icon componnent)
  ic_literature = require("../../../assets/icons/ic_literature.png"),
  ic_painting = require("../../../assets/icons/ic_painting.png"),
  ic_physics = require("../../../assets/icons/ic_physics.png"),
  ic_ = require("../../../assets/icons/ic_.png"),
  ic_account_manage = require("../../../assets/icons/ic_account_manage.png"),
  ic_add = require("../../../assets/icons/ic_add.png"),
  ic_admin_rule = require("../../../assets/icons/ic_admin_rule.png"),
  ic_adobe_indesign = require("../../../assets/icons/ic_adobe_indesign.png"),
  ic_ascending = require("../../../assets/icons/ic_ascending.png"),
  ic_back_circle = require("../../../assets/icons/ic_back_circle.png"),
  ic_begin = require("../../../assets/icons/ic_begin.png"),
  ic_bin = require("../../../assets/icons/ic_bin.png"),
  ic_biology = require("../../../assets/icons/ic_biology.png"),
  ic_birthday = require("../../../assets/icons/ic_birthday.png"),
<<<<<<< HEAD
  ic_book = require("../../../assets/icons/ic_book.png"),
=======
  ic_book = require("../../../assets/icons/ic_books.png"),
>>>>>>> 4255cda (fix icon componnent)
  ic_calendar_bold = require("../../../assets/icons/ic_calendar_bold.png"),
  ic_calendar_location = require("../../../assets/icons/ic_calendar_location.png"),
  ic_calendar_outline = require("../../../assets/icons/ic_calendar_outline.png"),
  ic_calendar = require("../../../assets/icons/ic_calendar.png"),
  ic_camera = require("../../../assets/icons/ic_camera.png"),
  ic_cccd = require("../../../assets/icons/ic_cccd.png"),
  ic_certificate = require("../../../assets/icons/ic_certificate.png"),
  ic_chemistry = require("../../../assets/icons/ic_chemistry.png"),
  ic_chinese = require("../../../assets/icons/ic_chinese.png"),
  ic_class_pending_approval = require("../../../assets/icons/ic_class_pending_approval.png"),
  ic_classes = require("../../../assets/icons/ic_classes.png"),
  ic_clock = require("../../../assets/icons/ic_clock.png"),
  ic_close_desk = require("../../../assets/icons/ic_close_desk.png"),
  ic_coin_outline = require("../../../assets/icons/ic_coin_outline.png"),
  ic_collab = require("../../../assets/icons/ic_collab.png"),
  ic_corel_draw = require("../../../assets/icons/ic_corel_draw.png"),
  ic_descending = require("../../../assets/icons/ic_descending.png"),
  ic_end = require("../../../assets/icons/ic_end.png"),
  ic_english = require("../../../assets/icons/ic_english.png"),
  ic_exit = require("../../../assets/icons/ic_exit.png"),
  ic_eye_black = require("../../../assets/icons/ic_eye_black.png"),
  ic_eye_blind_black = require("../../../assets/icons/ic_eye_blind_black.png"),
  ic_eye_blind_gradient = require("../../../assets/icons/ic_eye_blind_gradient.png"),
  ic_eye_gradient = require("../../../assets/icons/ic_eye_gradient.png"),
  ic_figma = require("../../../assets/icons/ic_figma.png"),
  ic_file = require("../../../assets/icons/ic_file.png"),
  ic_filter_outlilne = require("../../../assets/icons/ic_filter_outlilne.png"),
  ic_filter = require("../../../assets/icons/ic_filter.png"),
  ic_find = require("../../../assets/icons/ic_find.png"),
  ic_folder = require("../../../assets/icons/ic_folder.png"),
  ic_french = require("../../../assets/icons/ic_french.png"),
  ic_gender_outline = require("../../../assets/icons/ic_gender_outline.png"),
  ic_gender = require("../../../assets/icons/ic_gender.png"),
  ic_geography = require("../../../assets/icons/ic_geography.png"),
  ic_graduate_outline_gradient = require("../../../assets/icons/ic_graduate_outline_gradient.png"),
  ic_graduate_outline = require("../../../assets/icons/ic_graduate_outline.png"),
  ic_graduate = require("../../../assets/icons/ic_graduate.png"),
  ic_gradute_and_scroll = require("../../../assets/icons/ic_gradute_and_scroll.png"),
  ic_heart = require("../../../assets/icons/ic_heart.png"),
  ic_history = require("../../../assets/icons/ic_history.png"),
  ic_home = require("../../../assets/icons/ic_home.png"),
  ic_info = require("../../../assets/icons/ic_info.png"),
  ic_japanese = require("../../../assets/icons/ic_japanese.png"),
  ic_location = require("../../../assets/icons/ic_location(1).png"),
  ic_language = require("../../../assets/icons/ic_language.png"),
  ic_locations = require("../../../assets/icons/ic_location.png"),
  ic_lock_blue = require("../../../assets/icons/ic_lock_blue.png"),
  ic_lock = require("../../../assets/icons/ic_lock.png"),
  ic_logout = require("../../../assets/icons/ic_logout.png"),
  ic_manage_tutor = require("../../../assets/icons/ic_manage_tutor.png"),
  ic_math = require("../../../assets/icons/ic_math.png"),
  ic_music = require("../../../assets/icons/ic_music.png"),
  ic_phone = require("../../../assets/icons/ic_phone(1).png"),
  ic_phones = require("../../../assets/icons/ic_phone.png"),
  ic_photo = require("../../../assets/icons/ic_photo.png"),
  ic_photoshop = require("../../../assets/icons/ic_photoshop.png"),
  ic_plus = require("../../../assets/icons/ic_plus.png"),
  ic_report_account = require("../../../assets/icons/ic_report_account.png"),
  ic_select = require("../../../assets/icons/ic_select.png"),
  ic_setting = require("../../../assets/icons/ic_setting.png"),
  ic_sketchUp = require("../../../assets/icons/ic_sketchUp.png"),
  ic_sport = require("../../../assets/icons/ic_sport.png"),
  ic_star_outline = require("../../../assets/icons/ic_star_outline.png"),
  ic_star = require("../../../assets/icons/ic_star.png"),
  ic_subject = require("../../../assets/icons/ic_subject.png"),
  ic_trophy = require("../../../assets/icons/ic_trophy.png"),
  ic_user_blue = require("../../../assets/icons/ic_user_blue.png"),
  ic_chatbox = require("../../../assets/icons/ic-chatbox.png"),
  ic_user = require("../../../assets/icons/ic_user.png"),
  icon_image = require("../../../assets/icons/icon_image.png"),
  icon_mail = require("../../../assets/icons/icon_mail.png"),
  icon_star_light = require("../../../assets/icons/icon_star_light.png"),
  image108 = require("../../../assets/icons/image108.png"),
  image122 = require("../../../assets/icons/image122.png"),
  image180 = require("../../../assets/icons/image180.png"),
  img_avatar_cat = require("../../../assets/icons/img_avatar_cat.png"),
  img_avatar_rabbit = require("../../../assets/icons/img_avatar_rabbit.png"),
  img_avatar_user = require("../../../assets/icons/img_avatar_user.png"),
  img_factory = require("../../../assets/icons/img_factory.png"),
  img_login = require("../../../assets/icons/img_login.png"),
  img_security = require("../../../assets/icons/img_security.png"),
  report = require("../../../assets/icons/report.png"),
  send = require("../../../assets/icons/send.png"),
}

type Icon = {
  icon: AppIcon; 
  iconName?: string; 
<<<<<<< HEAD
  onPress: () => void;
=======
  onPress?: () => void;
>>>>>>> 4255cda (fix icon componnent)
};

const MyIcon: React.FC<Icon> = ({ icon, iconName, onPress,size }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View>
      <Image source={icon} style={styles.icon} />
        {/* <Image source={{ uri: icon }} style={styles.icon} /> */}
        {/* <Text style={styles.iconName}>{iconName}</Text> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {

    borderRadius: 5,
  },
  iconName: {
    marginTop: 5,
    fontSize: 16,
    color: "#000", // Màu sắc của tên biểu tượng
  },
});

export default MyIcon;
